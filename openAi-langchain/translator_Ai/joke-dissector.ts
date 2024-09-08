import { ChatOpenAI } from '@langchain/openai';
import * as dotenv from "dotenv"
import {z} from "zod"

dotenv.config()

const model = new ChatOpenAI({
  model:"gpt-4o-mini",
  temperature:0,
  openAIApiKey: process.env.OPEN_AI_KEY
})

//create the object schema with zod
const joke = z.object({
  setup:z.string().describe("The setup of the joke"),
  punchline:z.string().describe("The punchline to the joke"),
  rating:z.number().optional().describe("How funny the joke is, from 1 to 10")
})

//add structure to the model Llm
const structureLlm = model.withStructuredOutput(joke,{name:"joke"})

const jokeDissector = async () => {
  try{
    const response = await structureLlm.invoke("Tell me a joke about cats")

    return response
  } catch(e) {
    console.error(e)
  }
}

jokeDissector().then(response => console.log(response))