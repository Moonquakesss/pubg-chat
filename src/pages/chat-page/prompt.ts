import { ChatOpenAI } from "@langchain/openai"
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { openaiOptions } from "./const";
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { doc1 } from "./pubg.doc";

export const generateAnswer = async (naturalLanguage: string) => {
  // pubg 知识库
  // const pubgDocUrl = "https://gl.ali213.net/html/2024-6/1413669.html";
  // const webLoader = new CheerioWebBaseLoader(pubgDocUrl);
  // const docs = await webLoader.load();

  // const pubgDocs = docs[0].pageContent;
  const systemPrompt = SystemMessagePromptTemplate.fromTemplate(
    `你的名字叫贾队长，你是一个PUBG知识专家，你的知识参考文档如下：{pubgDocs}`
  )
  const userPrompt = HumanMessagePromptTemplate.fromTemplate(
    `根据下面的问题回答：{question}`
  )
  const chatPrompt = ChatPromptTemplate.fromMessages([
    systemPrompt,
    userPrompt,
  ])

  const model = new ChatOpenAI(openaiOptions);

  const outputParser = new StringOutputParser()

  const chain = chatPrompt.pipe(model).pipe(outputParser)

  const streamRes = await chain.stream({
    pubgDocs: doc1,
    question: naturalLanguage,
  })

  return streamRes;
}