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
  return true;
}

async function getCurrentUser() {
  if (isUserLoggedIn()) {
    return {
      id: 1,
      username: null,
      passwordHash: null,
      emailAddress: null,
      hasPaid: false,
    };
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
  console.log("FooBoo: ", req.body.sampleData.dateTimeStart);
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

async function getSample(prompt) {
  return await openAiApi(prompt);
}

async function determineTrainingTokens(numberOfTokens) {
  const users = await prisma.sampleTrackedToken.findMany();

  console.log(users);
}

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

app.get("/api/sample-text", async (req, res) => {
  const currentUser = await getCurrentUser();
  const trainingTokens = await getMostMissedTokens(4, currentUser.id);

  const stringOfTrainingTokens = trainingTokens
    .map((token) => {
      return token.tokenString;
    })
    .join("\n");

  let ourPrompt;
  if (trainingTokens.length) {
    ourPrompt =
      `Please give me a sentence, or a few sentences, on any topic. It should be about 25 to 50 words long.
    
The paragraph should include the following words. Use each of these words at least once.
    
` + stringOfTrainingTokens;
  } else {
    ourPrompt = `Please make up a short snippet of text, on any topic. It should be about 25 to 50 words long.`;
  }

  const sample = await getSample(ourPrompt);
  console.log(ourPrompt);
  res.send({ targetText: sample, trainingTokens: trainingTokens });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
