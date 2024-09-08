import promptSync from "prompt-sync";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { ChatOpenAI } from "@langchain/openai";

import {StringOutputParser} from "@langchain/core/output_parsers"

require("dotenv").config();

const prompt = promptSync();

const tellJoke = async (word:string) => {

  const model = new ChatOpenAI({
    apiKey: process.env.OPEN_AI_KEY,
    model: "gpt-4o-mini",
    temperature: 0.7,
  });
  
  const promptTemplate = ChatPromptTemplate.fromTemplate(
    "You are a haiku comedian, tell a haiku joke base on the following word {input}"
  );

  const parser = new StringOutputParser()

  const chain = promptTemplate.pipe(model).pipe(parser);

  const response = await chain.invoke({
    input:`${word}`
  })

  

  console.log(`\n${response}`)
  
}

console.log("Welcome to the joke generator base on one word")
const word:string = prompt("Write the word and I will tell the joke: ")

tellJoke(word)