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

  // Select a set of training tokens based on the trainingAlgorithm.

  // Full algorithm:

  const trainingTokens = [];

  // Step 1: Check if the training tokens of the previous sample are ready to graduate, and use them if not.

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

  // Step 2: Check if there are any lapsed tokens. If so, take the worst-scoring lapsed token first, and change it's status to "training".

  // while (trainingTokens.length < n) {

  // Take each token, and review it's sample-history, from the top down. On the way, note if it has been missed. Search until you find a "trainingThreshold" number of "hits". If there was a miss, before that most recent series of hits, then add it to the list of lapsed tokens.

  //   const lapsedTokens = await prisma.$queryRaw`

  //   `;

  // }

  // Step 3: Take a combination of pending tokens and review tokens.

  //   Note: The following code block is only adding new pending tokens. I'll need to add a different version here, pivoting on an if statement, to add a randomized mix of pending and review tokens.

  if (trainingTokens.length < batchSize) {
    const slotsLeft = batchSize - trainingTokens.length;
    const tokens = await getMostMissedTokens(slotsLeft, userId);
    trainingTokens.push(...tokens);
  }

  console.log("trainingTokens: ", trainingTokens);
  return trainingTokens;
}
