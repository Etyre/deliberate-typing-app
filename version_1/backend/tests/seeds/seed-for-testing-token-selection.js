import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

await prisma.user.create({
  data: {
    username: "test user",
    passwordHash: "test",
    passwordSalt: "test",
    emailAddress: "elityre@gmail.com",
    hasPaid: false,
  },
});

{
  await prisma.trackedToken.create({
    data: {
      tokenString: "this",
    },
  });

  await prisma.trackedToken.create({
    data: {
      tokenString: "is",
    },
  });

  await prisma.trackedToken.create({
    data: {
      tokenString: "a",
    },
  });

  await prisma.trackedToken.create({
    data: {
      tokenString: "test",
    },
  });
}

{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}

{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
{
  const newSample = await prisma.sample.create({
    data: {
      userId: 1,
      dateTimeStart: new Date(),
      dateTimeEnd: new Date(),
      targetText: "This is a test sentence. (#1)",
      numberOfTargetCharacters: 23,
      numberOfTargetWords: 5,
      trialDisplayMode: "VISUAL",
      trainingTokenSourcing: "ALL_TRACKED_TOKENS",
      batchSize: 5,
      trainingAlgorithm: "DELIBERATE_PRACTICE",
      ttsAlgoDeliberatePractice: true,
      ttsAlgoPrioritizeLapsedTokens: true,
      ttsAlgoReviewGraduatedTokens: true,
      tokenHighlighting: true,
      tokenHighlightingThreshold: 0.5,
      numberOfMissedWords: 0,
    },
  });

  // False every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 1,
      wasMissed: false,
      startIndex: 0,
    },
  });
  // True every time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 2,
      wasMissed: true,
      startIndex: 5,
    },
  });

  // Alternating between true and false
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: false,
      startIndex: 8,
    },
  });

  // False every time, except for the second to last time
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 4,
      wasMissed: false,
      startIndex: 10,
    },
  });
}
