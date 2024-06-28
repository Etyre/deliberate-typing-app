import { PrismaClient } from "@prisma/client";

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

export default async function getTrainingTokens(userId) {
  // I think that I should actually be able to get both n and trainingAlgorithm from the userId.

  // Get the user's trainingAlgorithm and batchSize.

  const userData = await prisma.user.findFirst({ where: { id: userId } });

  const batchSize = userData.batchSize;
  const trainingAlgorithm = userData.trainingAlgorithm;

  const ttsAlgoDeliberatePractice = userData.ttsAlgoDeliberatePractice;
  const ttsAlgoPrioritizeLapsedTokens = userData.ttsAlgoPrioritizeLapsedTokens;
  const ttsAlgoReviewGraduatedTokens = userData.ttsAlgoReviewGraduatedTokens;

  // Select a set of training tokens based on the trainingAlgorithm.

  // Full algorithm:

  const trainingTokens = [];

  // Step 1: Check if the training tokens of the previous sample are ready to graduate, and use them if not.

  if (ttsAlgoDeliberatePractice) {
    const trainingThreshold = 5;
    // This is the number of times that a token must be typed correctly in a row, in order to graduate.

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
            const tokenFromSampleTrackedToken = sampleTrackedToken.trackedToken;
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
      WHERE
        U."id" = ${userId} AND
        TT."status" = 'LAPSED'
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
          "tt"."id" AS "tracked_token_id",
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
  return trainingTokens;
}
