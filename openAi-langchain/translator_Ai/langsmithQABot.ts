import * as dotenv from "dotenv";

import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";

import { CheerioWebBaseLoader  } from "@langchain/community/document_loaders/web/cheerio";

import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import { MemoryVectorStore } from "langchain/vectorstores/memory";

import { createRetrieverTool } from "langchain/tools/retriever";

import { pull } from "langchain/hub";

import { ChatPromptTemplate } from "@langchain/core/prompts";

import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";

import promptSync from "prompt-sync";


const prompt = promptSync();

dotenv.config();

const FindLangSmithQuery = async ()  => {

const searchTool = new TavilySearchResults({apiKey:process.env.TAVILY_APY_KEY});

const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  openAIApiKey: process.env.OPEN_AI_KEY,
});

const loader = new CheerioWebBaseLoader(
  "https://docs.smith.langchain.com/user_guide"
);

const rawDocs = await loader.load();

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const docs = await splitter.splitDocuments(rawDocs);

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings({apiKey:process.env.OPEN_AI_KEY})
);

const retriever = vectorStore.asRetriever();


const retrieverTool = createRetrieverTool(retriever,{
  name:"langsmith_search",
  description:"Search for information about LangSmith. For any question about LangSmith, you must use this tool"
})

const tools = [searchTool,retrieverTool]

const promptTemplate = await pull<ChatPromptTemplate>(
   "hwchase17/openai-functions-agent"
)

const agent = await createOpenAIFunctionsAgent({
  llm:model,
  tools:tools,
  prompt:promptTemplate
})

const agentExecutor = new AgentExecutor({
  agent,
  tools
})
  const query:string = prompt("How may I help you today?: ")

  const response = await agentExecutor.invoke({input:query})

  return response

}
FindLangSmithQuery().then(response => console.log(response.output))
