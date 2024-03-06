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

app.post("/api/sample-run", async (req, res) => {
  const dateTimeStart = req.body.sampleData.dateTimeStart;
  const dateTimeEnd = req.body.sampleData.dateTimeEnd;
  const targetText = req.body.sampleData.targetText;
  const trainingTokens = req.body.sampleData.trainingTokens;
  const missedWords = req.body.sampleData.missedWords;
  const user = await getCurrentUser();

  prisma.sample.create({
    data: {
      userId: user.id,
      dateTimeStart: dateTimeStart,
      dateTimeEnd: dateTimeEnd,
      targetText: targetText,
      numberOfTargetCharacters: targetText.length,
      numberOfTargetWords: parseText(targetText).length,

      trainingTokens: trainingTokens,
      missedWords: missedWords,
      numberOfMissedWords: missedWords.length,
    },
  });
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
