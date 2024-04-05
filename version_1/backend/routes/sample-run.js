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

// This whole thing is the code that takes the results of a sample-run, sent from the front end in json format, and saves in the database.
router.post("/api/sample-run", async (req, res) => {
  const dateTimeStart = new Date(req.body.sampleData.dateTimeStart);
  const dateTimeEnd = new Date(req.body.sampleData.dateTimeEnd);
  const targetText = req.body.sampleData.targetText;
  const trainingTokens = req.body.sampleData.trainingTokens;
  const missedWordsRaw = req.body.sampleData.missedWords;
  const missedWords = missedWordsRaw.map((word) => {
    return { ...word, tokenString: word.tokenString.toLocaleLowerCase() };
  });
  const user = await getCurrentUser();
  const arrayOfTokenInfosOfSampleTextRaw = parseText(targetText);
  const arrayOfTokenInfosOfSampleText = arrayOfTokenInfosOfSampleTextRaw.map(
    (token) => {
      return { ...token, tokenString: token.tokenString.toLocaleLowerCase() };
    }
  );

  //  TODO: We need to write some code that will take the list of missed words, and use that to update the table of Tracked Tokens, in two ways: both updating the ratios of already tracked tokens, and tracking any untracked tokens that were mised.

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

      trialDisplayMode: user.trialDisplayMode,
      trainingTokenSourcing: user.trainingTokenSourcing,
      batchSize: user.batchSize,
      trainingAlgorithm: user.trainingAlgorithm,
      tokenHighlighting: user.tokenHighlighting,
      tokenHighlightingThreshold: user.tokenHighlightingThreshold,

      // missedWords: missedWords,
      numberOfMissedWords: missedWords.length,
    },
  });
  // We're checking here, if a there's a word that's in missedWords, but not in trackedTokens, then we add it to trackedTokens.
  for (let index = 0; index < missedWords.length; index++) {
    const word = missedWords[index];
    const wordText = word.tokenString;
    await prisma.trackedToken.upsert({
      where: { tokenString: wordText },
      update: {},
      create: { tokenString: wordText },
    });
  }

  // SELECT ALL "TrackedToken" WHERE "TrackedToken.tokenString" IN arrayOfTokenInfosOfSampleText

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
