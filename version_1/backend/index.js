import express from "express"
import path from "path"
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import openAiApi from "./openai-api.js"

import { config } from "dotenv";
config()

const __dirname = dirname(fileURLToPath(import.meta.url));
// Got this from here: https://stackoverflow.com/a/50052194

const app = express()

const port = 3000

app.use('/', express.static(path.join(__dirname, '../frontend/dist')))
// This doesn't seem to work with "get", even though when we use "use", that uses a get requset. It seems to work with "use" though ¯\_(ツ)_/¯.


async function getSample(prompt) {
  return await openAiApi(prompt)
}


app.get('/api/sample', async (req, res)=>{
  const testPrompt = "Please give me a paragraph on any topic. It should be about 50 to 100 words long."
  const sample = await getSample(testPrompt)
  res.send(sample)

})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
