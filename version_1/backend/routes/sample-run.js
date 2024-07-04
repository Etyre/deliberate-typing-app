import { Router } from "express";
import { getCurrentUser } from "../utils/authentication-utils.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = Router();

function parseText(text) {
  const theWordAndPunctIterator = text.matchAll(/[\w']+|[^\w\s']/g);
  // this returns an iterator
  // It returns everything that's either a word or a punctuation mark.

  // const thePuncIterator = text.matchAll(/[^\w\s']/g);
  // This regex matches everything that's not a words, space or apostrophe.
  // this returns an iterator

  // console.log("The punctuation tokens as an array: ", [...thePuncIterator]);

  const arrayOfRegexMatches = [...theWordAndPunctIterator];
  // This is an array of arrays.

  // Note that the punctuation marks are all at the front, instead of in order between the words. This is fine, we're putting them back in order later, but don't get confused about it.

  // Elements: 0th: the matched string
  // The postition of the first charcater is the the .index property of the array. (These arrays have an index property)
  // To find out more read documentation on RegExpMatchArray

  const arrayOfTokenInfos = arrayOfRegexMatches.map((element) => ({
    startPosition: element.index,
    tokenString: element[0],
  }));

  return arrayOfTokenInfos;
}

// This whole thing is the code that takes the results of a sample-run, sent from the frontend in json format, and saves in the database.
router.post("/api/sample-run", async (req, res) => {
  const trial = req.body.sampleData.trialData;
  const dateTimeStart = new Date(req.body.sampleData.dateTimeStart);
  const dateTimeEnd = new Date(req.body.sampleData.dateTimeEnd);
  const targetText = req.body.sampleData.targetText;
  const trainingTokens = req.body.sampleData.trainingTokens;
  const missedWordsRaw = req.body.sampleData.missedWords;
  const missedWords = missedWordsRaw.map((word) => {
    return { ...word, tokenString: word.tokenString.toLocaleLowerCase() };
  });

  const userSettings = trial.userSettings;
  const user = await getCurrentUser(req, res);
  const arrayOfTokenInfosOfSampleTextRaw = parseText(targetText);
  const arrayOfTokenInfosOfSampleText = arrayOfTokenInfosOfSampleTextRaw.map(
    (token) => {
      return { ...token, tokenString: token.tokenString.toLocaleLowerCase() };
    }
  );

  //  TODO: We need to write some code that will take the list of missed words, and use that to update the table of Tracked Tokens, in two ways: both updating the ratios of already tracked tokens, and tracking any untracked tokens that were missed.

  console.log("dateTimeStart: ", dateTimeStart);
  console.log("targetText: ", targetText);

  const sampleRecord = await prisma.sample.create({
    data: {
      userId: user.id,
      dateTimeStart: dateTimeStart,
      dateTimeEnd: dateTimeEnd,
      targetText: targetText,
      numberOfTargetCharacters: targetText.length,
      numberOfTargetWords: arrayOfTokenInfosOfSampleText.length,

      trialDisplayMode: userSettings.trialDisplayMode,
      trainingTokenSourcing: userSettings.trainingTokenSourcing,
      ttsAlgoDeliberatePractice: userSettings.ttsAlgoDeliberatePractice,
      ttsAlgoPrioritizeLapsedTokens: userSettings.ttsAlgoPrioritizeLapsedTokens,
      ttsAlgoReviewGraduatedTokens: userSettings.ttsAlgoReviewGraduatedTokens,
      batchSize: userSettings.batchSize,
      trainingAlgorithm: userSettings.trainingAlgorithm,
      tokenHighlighting: userSettings.tokenHighlighting,
      tokenHighlightingThreshold: userSettings.tokenHighlightingThreshold,

      // missedWords: missedWords,
      numberOfMissedWords: missedWords.length,
    },
  });
  // We're checking here, if a there's a word that's in missedWords, but not in trackedTokens, then we add it to trackedTokens and to userTrackedTokens.
  for (let index = 0; index < missedWords.length; index++) {
    const word = missedWords[index];
    const wordText = word.tokenString;
    const recentlyMissedTrackedToken = await prisma.trackedToken.upsert({
      where: { tokenString: wordText },
      update: {},
      create: { tokenString: wordText },
    });
    await prisma.userTrackedToken.upsert({
      where: {
        userId_trackedTokenId: {
          trackedTokenId: recentlyMissedTrackedToken.id,
          userId: user.id,
        },
      },
      // old version: where: { trackedTokenId trackedToken: { tokenString: wordText }, userId: user.id },
      create: {
        userId: user.id,
        trackedTokenId: recentlyMissedTrackedToken.id,
      },
      update: {},
    });
  }

  const trainingThreshold = 5;
  // Note we probably want to stor this as a variable somewhere (maybe as a user setting?) since it is also used in the training token selection code.

  // Graduate training tokens: Check if any of the TRAINING tokens have been typed correctly 5 times in a row, and if so, modify their status to GRADUATED in the TrackedToken table.

  for (const trainingToken of trainingTokens) {
    const trackedTokenId = trainingToken.id;
    // Note: The id of this token on the TrackedToken table, is NOT the same as the id of this token on the training token table, or the sampleTrackedToken table. Here, we want the id on the trackedToken table.
    const recentInstances = await prisma.sampleTrackedToken.findMany({
      where: { trackedTokenId: trackedTokenId },
      orderBy: { sample: { dateTimeEnd: "desc" } },
      include: { trackedToken: true, sample: true },
      take: trainingThreshold,
    });

    if (
      !recentInstances.some(
        (sampleTrackedToken) => sampleTrackedToken.wasMissed
      )
    ) {
      await prisma.userTrackedToken.update({
        where: { trackedTokenId: trackedTokenId, userId: user.id },
        data: { status: "GRADUATED" },
      });
    }
  }

  // Note lapsed tokens: Check if any of the missed words are tracked tokens with the status GRADUATED. If so, change their status to LAPSED in the TrackedToken table.

  for (const token of missedWords) {
    console.log("This here token: ", token);
    await prisma.userTrackedToken.updateMany(
      {
        where: {
          status: "GRADUATED",
          userId: user.id,
          trackedToken: { tokenString: token.tokenString },
        },
        data: { status: "LAPSED" },
      },
      {}
    );
  }

  // We're looking for "relevant tracked tokens", for this sample. A relevant tracked token is any tracked token that shows up in the target text of this sample. That includes the all the training tokens, but it might also include tracked tokens that were not served as training tokens this time. This function gives us a list of all the tracked tokens.

  const arrayOfRelevantTrackedTokens = await prisma.trackedToken.findMany({
    where: {
      tokenString: {
        in: arrayOfTokenInfosOfSampleText.map(
          (tokenInfo) => tokenInfo.tokenString
        ),
      },
    },
  });

  for (let index = 0; index < arrayOfTokenInfosOfSampleText.length; index++) {
    const word = arrayOfTokenInfosOfSampleText[index];

    const matchingToken = arrayOfRelevantTrackedTokens.find((trackedToken) => {
      return word.tokenString == trackedToken.tokenString;
    });

    const wasMissed = missedWords.some((missedWord) => {
      return word.startPosition == missedWord.startPosition;
    });

    // This updates the relationship table SampleTrackedToken. This is basically a table of all of the tracked tokens that showed up in the target text of a particular sample-run.
    // if the block above doesn't find a match, matchingToken is set to undefined, which is falsey.
    if (matchingToken) {
      await prisma.sampleTrackedToken.create({
        data: {
          sampleId: sampleRecord.id,
          trackedTokenId: matchingToken.id,
          startIndex: word.startPosition,
          wasMissed: wasMissed,
        },
      });
    }
  }

  // This updates the relationship table SampleTrainingToken. This is basically a table of the training tokens of that particular training run.
  // This code block is a little complicated. We need two ids in order to create a new entry in this table. We need a sample id (which we have), and the trackedToken id, which we grab from the TrackedToken table.
  for (let index = 0; index < trainingTokens.length; index++) {
    const trainingToken = trainingTokens[index];
    console.log(
      "arrayOfTokenInfosOfSampleText: ",
      arrayOfTokenInfosOfSampleText
    );
    console.log("arrayOfRelevantTrackedTokens: ", arrayOfRelevantTrackedTokens);
    console.log("traingToken: ", trainingToken);

    // Here, we're grabbing the Tracked Token table, so we can get the id.
    const trackedToken = arrayOfRelevantTrackedTokens.find((trackedToken) => {
      return trainingToken.tokenString == trackedToken.tokenString;
    });

    if (!trackedToken) {
      continue;
      // Skip to the next iteration of the loop.
    }
    await prisma.sampleTrainingToken.create({
      data: {
        sampleId: sampleRecord.id,
        trackedTokenId: trackedToken.id,
      },
    });
  }

  res.send("We got it!");
});
export default router;
