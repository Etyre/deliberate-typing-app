import OpenAI from 'openai';
import { config } from "dotenv";
config()


export default async function openAiApi (completedPrompt) {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    // console.log(openai)
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: completedPrompt }],
      model: "gpt-4",
    });
    console.log(chatCompletion)
    return chatCompletion.choices[0].message.content
  }