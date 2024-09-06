import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";



const model:ChatOpenAI = new ChatOpenAI({ model: "gpt-4", apiKey: process.env.OPEN_AI_KEY});

const systemTemplate = "Translate the following into {language}"

const promptTemplate = ChatPromptTemplate.fromMessages([
  ["system",systemTemplate],
  ["user", "{text}"]
])


async function translateFunction(language:string, text:string){
  try {
  
    const parser = new StringOutputParser();

    const chain = promptTemplate.pipe(model).pipe(parser)

    const translation = await chain.invoke({language,text})

    console.log(translation)

  } catch (e) {
    console.error(e);
  }
}

translateFunction("italian","the child is running away with a pizza on his legs")
