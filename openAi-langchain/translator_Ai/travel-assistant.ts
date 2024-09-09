import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from "dotenv";
import promptSync from 'prompt-sync';


const prompt = promptSync()

dotenv.config()

const model = new ChatOpenAI({
  model:"gpt-4o-mini",
  temperature:0,
  openAIApiKey: process.env.OPEN_AI_KEY
})

const template = "You are a travel assistant, and you need to response a list of the 5 best locations to go to as a list based in the {country}"

const promptTemplate = new PromptTemplate({
  inputVariables:["country"],
  template:template
})


const runModel = async () => {
  const country:string = prompt("What country do you want to know the best attractions?: ")
  const chain = promptTemplate.pipe(model)

  const response = chain.invoke({country})
  return response
}


runModel().then(response => console.log(response.content))