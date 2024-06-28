import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const user = await prisma.user.create({
  data: {
    username: "test for grabbing graduated tokens",
    passwordHash: "test",
    passwordSalt: "test",
    emailAddress: "afakeemail@gmail.com",
    hasPaid: false,
  },
});

{
  const newTrackedToken1 = await prisma.trackedToken.upsert({
    where: { tokenString: "this" },
    update: {},
    create: {
      tokenString: "this",
    },
  });

  await prisma.userTrackedToken.create({
    data: {
      userId: user.id,
      trackedTokenId: newTrackedToken1.id,
    },
  });

  const newTrackedToken2 = await prisma.trackedToken.upsert({
    where: { tokenString: "is" },
    update: {},
    create: {
      tokenString: "is",
    },
  });

  await prisma.userTrackedToken.create({
    data: {
      userId: user.id,
      trackedTokenId: newTrackedToken2.id,
    },
  });

  const newTrackedToken3 = await prisma.trackedToken.upsert({
    where: { tokenString: "a" },
    update: {},
    create: {
      tokenString: "a",
    },
  });

  await prisma.userTrackedToken.create({
    data: {
      userId: user.id,
      trackedTokenId: newTrackedToken3.id,
    },
  });

  const newTrackedToken4 = await prisma.trackedToken.upsert({
    where: { tokenString: "test" },
    update: {},
    create: {
      tokenString: "test",
    },
  });

  await prisma.userTrackedToken.create({
    data: {
      userId: user.id,
      trackedTokenId: newTrackedToken4.id,
    },
  });
}

{
  const newSample = await prisma.sample.create({
    data: {
      userId: user.id,
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning, but with a string of hits at the begining
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: true,
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: true,
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: true,
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
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
      wasMissed: true,
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
      tokenHighlighting: "CURRENT_TRAINING_TOKENS",
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

  // Alternating between true and false, but with a string of hits at the beginning
  await prisma.sampleTrackedToken.create({
    data: {
      sampleId: newSample.id,
      trackedTokenId: 3,
      wasMissed: true,
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
