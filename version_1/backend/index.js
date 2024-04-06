import express from "express";
import path from "path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import openAiApi from "./openai-api.js";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import sampleRunRouter from "./routes/sample-run.js";
import authenticationRouter from "./routes/authentication.js";
import { getCurrentUser } from "./utils/authentication-utils.js";
import UserDto from "./dtos/user-dto.js";
import UserSettingsDto from "./dtos/user-settings-dto.js";

config();

const prisma = new PrismaClient();

const __dirname = dirname(fileURLToPath(import.meta.url));
// Got this from here: https://stackoverflow.com/a/50052194

const app = express();

const port = 3000;

app.use("/", express.static(path.join(__dirname, "../frontend/dist")));
// This doesn't seem to work with "get", even though when we use "use", that uses a get requset. It seems to work with "use" though ¯\_(ツ)_/¯.

app.use(express.json());

app.use(sampleRunRouter);

app.use(authenticationRouter);

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

async function getTrial(prompt) {
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
  const rawCurrentUser = await getCurrentUser();
  const trainingTokens = await getMostMissedTokens(4, rawCurrentUser.id);

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

  const sample = await getTrial(ourPrompt);
  const userSettings = new UserSettingsDto(rawCurrentUser);

  console.log(ourPrompt);
  res.send({
    targetText: sample,
    trainingTokens: trainingTokens,
    userSettings: userSettings,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
