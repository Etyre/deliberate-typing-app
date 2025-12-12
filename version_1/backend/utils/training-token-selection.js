import { PrismaClient, TrainingTokenSourcing } from "@prisma/client";
import seedRandom from "seedrandom";

const prisma = new PrismaClient();

async function getMostMissedTokens(n, userId) {
  const mostMissedTokens = await prisma.$queryRaw`
      SELECT
        TT."id",
        TT."tokenString",
        SUM(CASE WHEN "wasMissed" = TRUE THEN 1 ELSE 0 END)::float / COUNT(STT."id") AS "missRatio"
      FROM
        "TrackedToken" AS TT
          INNER JOIN "SampleTrackedToken" AS STT
          ON(TT."id" = STT."trackedTokenId")
            INNER JOIN "Sample" AS S
            ON(STT."sampleId" = S."id")
              INNER JOIN "User" AS U
              ON(S."userId" = U."id")
      WHERE
        U."id" = ${userId}
      GROUP BY
        TT."id", TT."tokenString"
      ORDER BY 
        "missRatio" DESC
      LIMIT ${n};
    `;
  console.log("mostMissed:", mostMissedTokens);
  return mostMissedTokens;
}

// This function should get a random selection of n manually added tokens that have never been used as training tokens in any sample.

//old version:
// async function getNewManuallyAddedTokens(n, userId) {
//   const newManualTokens = await prisma.$queryRaw`
//     SELECT
//       TT."id",
//       TT."tokenString"
//     FROM
//       "TrackedToken" AS TT
//         INNER JOIN "UserTrackedToken" AS UTT
//         ON(TT."id" = UTT."trackedTokenId")
//     WHERE
//       UTT."userId" = ${userId} AND
//       UTT."status" = 'PENDING' AND
//       (UTT."tokenSource" = 'ADDED_MANUALLY' OR UTT."tokenSource" = 'MISSED_AND_THEN_ADDED_MANUALLY')
//     ORDER BY RANDOM()
//     LIMIT ${n};
//   `;
//   return newManualTokens;
// }

// Claude's attempt:
export async function getNewManuallyAddedTokens(n, userId) {
  const newManualTokens = await prisma.$queryRaw`
    SELECT
      TT."id",
      TT."tokenString"
    FROM
      "TrackedToken" AS TT
        INNER JOIN "UserTrackedToken" AS UTT
        ON(TT."id" = UTT."trackedTokenId")
    WHERE
      UTT."userId" = ${userId} AND
      (UTT."tokenSource" = 'ADDED_MANUALLY' OR UTT."tokenSource" = 'MISSED_AND_THEN_ADDED_MANUALLY') AND
      NOT EXISTS (
        SELECT 1 FROM "SampleTrainingToken" STT
        INNER JOIN "Sample" S ON STT."sampleId" = S."id"
        WHERE STT."trackedTokenId" = TT."id" AND S."userId" = ${userId}
      )
    ORDER BY RANDOM()
    LIMIT ${n};
  `;
  return newManualTokens;
}

export function setRandomSeed(seed) {
  seedRandom(seed, { global: true });
}

// Claude Opus 4.5 added `userId` parameter on 2025-12-11.
// Previously: reviewGraduatedTokens(numberOfReviewTokens, reviewTokenProbabilityThreshold, tokenSourceFilter)
// The function referenced `userId` but it was never passed in, causing "ReferenceError: userId is not defined"
export async function reviewGraduatedTokens(
  numberOfReviewTokens,
  reviewTokenProbabilityThreshold,
  tokenSourceFilter,
  userId
) {
  // Note: tokenSourceFilter is for allowing us to have one function that can be used for both added manually and missed and then added manually tokens, but this functionality has not been implemented yet. This version only works with added manually tokens.

  const reviewTokens = await prisma.$queryRaw`

      WITH "RankedSamples" AS (
        SELECT 
          "stt"."trackedTokenId",
          "stt"."wasMissed",
          "s"."userId",
          "s"."dateTimeEnd",
          ROW_NUMBER() OVER (PARTITION BY "stt"."trackedTokenId" ORDER BY "s"."dateTimeEnd" DESC) AS "rn",
          SUM(CASE WHEN "stt"."wasMissed" THEN 1 ELSE 0 END) OVER (PARTITION BY "stt"."trackedTokenId" ORDER BY "s"."dateTimeEnd" DESC) AS "misses"
        FROM 
          "SampleTrackedToken" "stt"
          JOIN "Sample" "s" ON ("stt"."sampleId" = "s"."id")
        INNER JOIN "UserTrackedToken" "utt" ON ("utt"."trackedTokenId" = "stt"."trackedTokenId")
        WHERE 
          "s"."userId" = ${userId} AND
          "utt"."status" = 'GRADUATED' AND
          ("utt"."tokenSource" = 'ADDED_MANUALLY' OR "utt"."tokenSource" = 'MISSED_AND_THEN_ADDED_MANUALLY')
      ),
      "ConsecutiveHits" AS (
        SELECT 
          "trackedTokenId",
          SUM(CASE WHEN "wasMissed" = false AND ("misses" = 0 OR "rn" < (SELECT MIN("rn") FROM "RankedSamples" "r2" WHERE "r2"."trackedTokenId" = "RankedSamples"."trackedTokenId" AND "r2"."wasMissed" = true)) THEN 1 ELSE 0 END) AS "consecutive_hits"
        FROM 
          "RankedSamples"
        GROUP BY 
          "trackedTokenId"
      )
      SELECT 
        "tt"."id" AS "id",
        "tt"."tokenString",
        COALESCE("ch"."consecutive_hits", 0) AS "consecutive_hits",
        POWER(0.7, "ch"."consecutive_hits")  AS "ReviewProbability"
      FROM 
        "TrackedToken" "tt"
        LEFT JOIN "ConsecutiveHits" "ch" ON "tt"."id" = "ch"."trackedTokenId"
      WHERE
        POWER(0.7, "ch"."consecutive_hits" * 0.6) > ${reviewTokenProbabilityThreshold}
      ORDER BY 
        "consecutive_hits" DESC, "tt"."tokenString" 

      LIMIT ${numberOfReviewTokens} ;
  `;
  // Note: There's some question of whether these decay curves have the right parameters, both the exponent multiple and the base. I basically picked they by eyeballing. There's probably cog sci research on the correct forgetting curves to use.

  return reviewTokens;
}

async function setStatusToTraining(userId, trackedTokenId) {
  await prisma.userTrackedToken.update({
    where: {
      userId_trackedTokenId: {
        userId: userId,
        trackedTokenId: trackedTokenId,
      },
    },
    data: { status: "TRAINING" },
  });
}

export default async function getTrainingTokens(userId) {
  // I think that I should actually be able to get both n and trainingAlgorithm from the userId.

  // Get the user's trainingAlgorithm and batchSize.

  const userData = await prisma.user.findFirst({ where: { id: userId } });

  const trainingTokenSourcing = userData.trainingTokenSourcing;

  const batchSize = userData.batchSize;
  const trainingAlgorithm = userData.trainingAlgorithm;

  const ttsAlgoDeliberatePractice = userData.ttsAlgoDeliberatePractice;
  const ttsAlgoPrioritizeLapsedTokens = userData.ttsAlgoPrioritizeLapsedTokens;
  const ttsAlgoReviewGraduatedTokens = userData.ttsAlgoReviewGraduatedTokens;

  const trainingThreshold = userData.trainingThreshold;
  // This is the number of times that a token must be typed correctly in a row, in order to graduate.

  // Select a set of training tokens based on the trainingAlgorithm.

  // Full algorithm:
  // There are two version of the algorithm, depending on if the user has set the trainingTokenSourcing to "ALL_TRACKED_TOKENS" or "MANUAL_LIST".

  const trainingTokens = [];

  // VERSION 1: ALL TRACKED TOKENS
  if (trainingTokenSourcing === "ALL_TRACKED_TOKENS") {
    // Step 1: Check if the training tokens of the previous sample are ready to graduate, and use them if not.

    if (ttsAlgoDeliberatePractice) {
      // Grab the tokens from the previous sample.
      const previousSample = await prisma.sample.findFirst({
        where: { userId: userId },
        orderBy: { dateTimeEnd: "desc" },
        include: {
          sampleTrainingTokens: { include: { trackedToken: true } },
          sampleTrackedTokens: true,
        },
      });

      if (previousSample) {
        const previousTrainingTokens = previousSample.sampleTrainingTokens;

        // For each one, check if it has been typed correctly 5 times consecutively, over the past 5 samples that is has been a training token of.

        for (const TrainingToken of previousTrainingTokens) {
          const tokenId = TrainingToken.trackedToken.id;
          // Note: The id of this token on the TrackedToken table, is NOT the same as the id of this token on the training token table, or the sampleTrackedToken table. Here, we want the id on the trackedToken table.
          const recentInstances = await prisma.sampleTrackedToken.findMany({
            where: { trackedTokenId: tokenId },
            orderBy: { sample: { dateTimeEnd: "desc" } },
            include: { trackedToken: true, sample: true },
            take: trainingThreshold,
          });

          for (const sampleTrackedToken of recentInstances) {
            if (sampleTrackedToken.wasMissed) {
              const tokenFromSampleTrackedToken =
                sampleTrackedToken.trackedToken;
              trainingTokens.push(tokenFromSampleTrackedToken);
              break;
            }
          }
        }
      }
    }
    // Step 2: Check if there are any lapsed tokens. If so, take the worst-scoring lapsed token first, and change it's status to "training".

    if (ttsAlgoPrioritizeLapsedTokens) {
      const numberOfLapsedTokens = 1;
      if (trainingTokens.length < batchSize) {
        // Note that the way we're doing the array destructuring here, we're only grabbing the first element of the array, even if numberOfLapsedTokens is greater than 1.
        const [worstLapsedToken] = await prisma.$queryRaw`
            SELECT
        TT."id",
        TT."tokenString",
        SUM(CASE WHEN "wasMissed" = TRUE THEN 1 ELSE 0 END)::float / COUNT(STT."id") AS "missRatio"
      FROM
        "TrackedToken" AS TT
          INNER JOIN "SampleTrackedToken" AS STT
          ON(TT."id" = STT."trackedTokenId")
            INNER JOIN "Sample" AS S
            ON(STT."sampleId" = S."id")
              INNER JOIN "User" AS U
              ON(S."userId" = U."id")
          INNER JOIN "UserTrackedToken" AS UTT
          ON(TT."id" = UTT."trackedTokenId")
      WHERE
        U."id" = ${userId} AND
        UTT."status" = 'LAPSED'
      GROUP BY
        TT."id", TT."tokenString"
      ORDER BY 
        "missRatio" DESC
      LIMIT ${numberOfLapsedTokens};
            `;
        if (worstLapsedToken) {
          trainingTokens.push(worstLapsedToken);
        }
      }
    }
    // Step 3: Take half of the remaining slots (on average) and fill them with graduated tokens to review in proportion to how many times they've been typed correctly since they graduated.

    if (ttsAlgoReviewGraduatedTokens) {
      const slotsLeft = batchSize - trainingTokens.length;
      if (slotsLeft > 0) {
        const numberOfReviewTokens = Math.floor(Math.random() * slotsLeft);
        const reviewTokenProbabilityThreshold = Math.random();
        const reviewTokens = await prisma.$queryRaw`

        WITH "RankedSamples" AS (
          SELECT 
            "stt"."trackedTokenId",
            "stt"."wasMissed",
            "s"."userId",
            "s"."dateTimeEnd",
            ROW_NUMBER() OVER (PARTITION BY "stt"."trackedTokenId" ORDER BY "s"."dateTimeEnd" DESC) AS "rn",
            SUM(CASE WHEN "stt"."wasMissed" THEN 1 ELSE 0 END) OVER (PARTITION BY "stt"."trackedTokenId" ORDER BY "s"."dateTimeEnd" DESC) AS "misses"
          FROM 
            "SampleTrackedToken" "stt"
            JOIN "Sample" "s" ON ("stt"."sampleId" = "s"."id")
          INNER JOIN "UserTrackedToken" "utt" ON ("utt"."trackedTokenId" = "stt"."trackedTokenId")
          WHERE 
            "s"."userId" = ${userId} AND
          "utt"."status" = 'GRADUATED' 
        ),
        "ConsecutiveHits" AS (
          SELECT 
            "trackedTokenId",
            SUM(CASE WHEN "wasMissed" = false AND ("misses" = 0 OR "rn" < (SELECT MIN("rn") FROM "RankedSamples" "r2" WHERE "r2"."trackedTokenId" = "RankedSamples"."trackedTokenId" AND "r2"."wasMissed" = true)) THEN 1 ELSE 0 END) AS "consecutive_hits"
          FROM 
            "RankedSamples"
          GROUP BY 
            "trackedTokenId"
        )
        SELECT 
          "tt"."id" AS "id",
          "tt"."tokenString",
          COALESCE("ch"."consecutive_hits", 0) AS "consecutive_hits",
          POWER(0.7, "ch"."consecutive_hits")  AS "ReviewProbability"
        FROM 
          "TrackedToken" "tt"
          LEFT JOIN "ConsecutiveHits" "ch" ON "tt"."id" = "ch"."trackedTokenId"
        WHERE
          POWER(0.7, "ch"."consecutive_hits" * 0.6) > ${reviewTokenProbabilityThreshold}
        ORDER BY 
          "consecutive_hits" DESC, "tt"."tokenString" 

        LIMIT ${numberOfReviewTokens} ;
    `;
        // Note: There's some question of whether these decay curves have the right parameters, both the exponent multiple and the base. I basically picked they by eyeballing. There's probably cog sci research on the correct forgetting curves to use.

        trainingTokens.push(...reviewTokens);
      }
    }

    // Step 4: The fallback step: fill the remaining slots with the most missed tokens.
    if (trainingTokens.length < batchSize) {
      const slotsLeft = batchSize - trainingTokens.length;
      const tokens = await getMostMissedTokens(slotsLeft, userId);
      trainingTokens.push(...tokens);
    }

    console.log("trainingTokens: ", trainingTokens);

    // Set the status of the training tokens to "training".
    for (const token of trainingTokens) {
      await setStatusToTraining(userId, token.id);
    }

    return trainingTokens;
  }
  // VERSION 2: MANUAL LIST
  else if (trainingTokenSourcing === "MANUAL_LIST") {
    // Step 1: Check if the training tokens of the previous sample are ready to graduate, and use them if not.
    if (ttsAlgoDeliberatePractice) {
      // Grab the tokens from the previous sample.
      const previousSample = await prisma.sample.findFirst({
        where: { userId: userId },
        orderBy: { dateTimeEnd: "desc" },
        include: {
          sampleTrainingTokens: {
            include: {
              trackedToken: {
                include: {
                  userTrackedToken: {
                    where: { userId: userId },
                  },
                },
              },
            },
          },
          sampleTrackedTokens: true,
        },
      });

      if (previousSample) {
        const previousTrainingTokens = previousSample.sampleTrainingTokens;

        // For each one, first check tokenSource to see if its a manually added token, then check if it has been typed correctly 5 times consecutively, over the past 5 samples that is has been a training token of.

        for (const TrainingToken of previousTrainingTokens) {
          // Check if tokenSource is ADDED_MANUALLY or MISSED_AND_THEN_ADDED_MANUALLY
          console.log("TrainingToken: ", TrainingToken);
          const userTrackedToken =
            TrainingToken.trackedToken.userTrackedToken[0];
          if (
            userTrackedToken.tokenSource === "ADDED_MANUALLY" ||
            userTrackedToken.tokenSource === "MISSED_AND_THEN_ADDED_MANUALLY"
          ) {
            const tokenId = TrainingToken.trackedToken.id;
            // Note: The id of this token on the TrackedToken table, is NOT the same as the id of this token on the training token table, or the sampleTrackedToken table. Here, we want the id on the trackedToken table.
            const recentInstances = await prisma.sampleTrackedToken.findMany({
              where: { trackedTokenId: tokenId },
              orderBy: { sample: { dateTimeEnd: "desc" } },
              include: { trackedToken: true, sample: true },
              take: trainingThreshold,
            });

            for (const sampleTrackedToken of recentInstances) {
              if (sampleTrackedToken.wasMissed) {
                const tokenFromSampleTrackedToken =
                  sampleTrackedToken.trackedToken;
                trainingTokens.push(tokenFromSampleTrackedToken);
                break;
              }
            }
          }
        }
      }
    }

    // Step 2: Check if there are any lapsed tokens that are manually added. If so, take the worst-scoring lapsed token first, and add it to the training tokens array

    if (ttsAlgoPrioritizeLapsedTokens) {
      const numberOfLapsedTokens = 1;
      if (trainingTokens.length < batchSize) {
        // Note that the way we're doing the array destructuring here, we're only grabbing the first element of the array, even if numberOfLapsedTokens is greater than 1.
        const [worstLapsedToken] = await prisma.$queryRaw`
            SELECT
        TT."id",
        TT."tokenString",
        SUM(CASE WHEN "wasMissed" = TRUE THEN 1 ELSE 0 END)::float / COUNT(STT."id") AS "missRatio"
      FROM
        "TrackedToken" AS TT
          INNER JOIN "SampleTrackedToken" AS STT
          ON(TT."id" = STT."trackedTokenId")
            INNER JOIN "Sample" AS S
            ON(STT."sampleId" = S."id")
              INNER JOIN "User" AS U
              ON(S."userId" = U."id")
          INNER JOIN "UserTrackedToken" AS UTT
          ON(TT."id" = UTT."trackedTokenId")
      WHERE
        U."id" = ${userId} AND
        UTT."status" = 'LAPSED' AND
        (UTT."tokenSource" = 'ADDED_MANUALLY' OR UTT."tokenSource" = 'MISSED_AND_THEN_ADDED_MANUALLY')
      GROUP BY
        TT."id", TT."tokenString"
      ORDER BY 
        "missRatio" DESC
      LIMIT ${numberOfLapsedTokens};
            `;
        if (worstLapsedToken) {
          trainingTokens.push(worstLapsedToken);
        }
      }
    }

    // Step 3: Take half of the remaining slots (on average) and fill them with graduated manually added tokens to review in proportion to how many times they've been typed correctly since they graduated.

    // Claude wrote this. It seems to cause a crash.
    // Edit: It now doesn't seem to be causing a crash. It just doesn't seem to be working.

    if (ttsAlgoReviewGraduatedTokens) {
      const slotsLeft = batchSize - trainingTokens.length;
      if (slotsLeft > 0) {
        const numberOfReviewTokens = Math.floor(Math.random() * slotsLeft);
        const reviewTokenProbabilityThreshold = Math.random();
        // Claude Opus 4.5 added `userId` argument on 2025-12-11. Previously only passed 2 args.
        const reviewTokens = await reviewGraduatedTokens(
          numberOfReviewTokens,
          reviewTokenProbabilityThreshold,
          null,
          userId
        );
        trainingTokens.push(...reviewTokens);
      }
    }

    // Step 4: The fallback step: fill the remaining slots with randomly selected manually added tokens that haven't been used as training tokens yet.
    if (trainingTokens.length < batchSize) {
      const slotsLeft = batchSize - trainingTokens.length;
      const tokens = await getNewManuallyAddedTokens(slotsLeft, userId);
      trainingTokens.push(...tokens);
    }

    console.log("trainingTokens: ", trainingTokens);

    // Set the status of the training tokens to "training".
    for (const token of trainingTokens) {
      await setStatusToTraining(userId, token.id);
    }

    return trainingTokens;
  } else {
    throw new Error(
      `Unsupported training token sourcing: ${trainingTokenSourcing}`
    );
  }
}
