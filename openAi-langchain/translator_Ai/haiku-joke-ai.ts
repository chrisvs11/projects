import promptSynch from "prompt-sync";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOpenAI } from "@langchain/openai";

require("dotenv").config();

const prompt = promptSynch();

const tellJoke = async (word:string) => {

  const model = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_KEY,
    model: "gpt-4o-mini",
    temperature: 0.7,
  });
  
  const promptTemplate = ChatPromptTemplate.fromTemplate(
    "You are a haiku comedian, tell a haiku joke base on the following word {input}"
  );

  const chain = promptTemplate.pipe(model);

  const response = await chain.invoke({
    input:`${word}`
  })

  

  console.log(`\n${response.content}`)
  
}

console.log("Welcome to the joke generator base on one word")
const word:string = prompt("Write the word and I will tell the joke: ")

tellJoke(word)