import express from "express";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import openAiApi from "./openai-api.js";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

config();

const prisma = new PrismaClient();

const __dirname = dirname(fileURLToPath(import.meta.url));
// Got this from here: https://stackoverflow.com/a/50052194

const app = express();

const port = 3000;

app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
// This doesn't seem to work with "get", even though when we use "use", that uses a get requset. It seems to work with "use" though ¯\_(ツ)_/¯.

app.use(express.json());

function isUserLoggedIn() {
  return false;
}

async function getCurrentUser() {
  if (isUserLoggedIn()) {
    // use primsa to get the user data from the database
  } else {
    return await prisma.user.create({
      data: {
        username: null,
        passwordHash: null,
        emailAddress: null,
        hasPaid: false,
      },
    });
  }
}

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

function checkIfTracked(token) {}

// This whole thing is the code that takes the results of a sample-run, sent from the front end in json format, and saves in the database.
app.post("/api/sample-run", async (req, res) => {
  const dateTimeStart = new Date(req.body.sampleData.dateTimeStart);
  const dateTimeEnd = new Date(req.body.sampleData.dateTimeEnd);
  const targetText = req.body.sampleData.targetText;
  const trainingTokens = req.body.sampleData.trainingTokens;
  const missedWords = req.body.sampleData.missedWords;
  const user = await getCurrentUser();
  const arrayOfTokenInfosOfSampleText = parseText(targetText);

  //  TODO: We need to write some code that will take the list of missed words, and use that to update the table of Tracked Tokens, in two ways: both updating the ratios of already tracked tokens, and tracking any untracked tokens that were mised.

  const sampleRecord = await prisma.sample.create({
    data: {
      userId: user.id,
      dateTimeStart: dateTimeStart,
      dateTimeEnd: dateTimeEnd,
      targetText: targetText,
      numberOfTargetCharacters: targetText.length,
      numberOfTargetWords: arrayOfTokenInfosOfSampleText.length,

      // missedWords: missedWords,
      numberOfMissedWords: missedWords.length,
    },
  });
  // We're checking here, if a there's a word that's in missedWords, but not in trackedTokens, then we add it to trackedTokens.
  for (let index = 0; index < missedWords.length; index++) {
    const word = missedWords[index];
    const wordText = word.tokenString;
    await prisma.trackedToken.upsert({
      where: { text: wordText },
      update: {},
      create: { text: wordText },
    });
  }

  // SELECT ALL "TrackedToken" WHERE "TrackedToken.text" IN arrayOfTokenInfosOfSampleText

  // We're looking for "relevant tracked tokens", for this sample. A relevant tracked token is any tracked token that shows up in the target text of this sample. That includes the all the training tokens, but it might also include tracked tokens that were not served as training tokens this time. This function gives us a list of all the tracked tokens.

  const arrayOfRelevantTrackedTokens = await prisma.trackedToken.findMany({
    where: {
      text: {
        in: arrayOfTokenInfosOfSampleText.map(
          (tokenInfo) => tokenInfo.tokenString
        ),
      },
    },
  });

  for (let index = 0; index < arrayOfTokenInfosOfSampleText.length; index++) {
    const word = arrayOfTokenInfosOfSampleText[index];

    const matchingToken = arrayOfRelevantTrackedTokens.find((trackedToken) => {
      return word.tokenString == trackedToken.text;
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

    // Here, we're grabbing the tackedToken the Tracked Token table, so we can get the id.
    const trackedToken = arrayOfRelevantTrackedTokens.find((trackedToken) => {
      return trainingToken.text == trackedToken.text;
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

async function getSample(prompt) {
  return await openAiApi(prompt);
}

app.get("/api/sample", async (req, res) => {
  const testPrompt =
    "Please give me a paragraph on any topic. It should be about 50 to 100 words long.";
  const sample = await getSample(testPrompt);
  res.send(sample);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
