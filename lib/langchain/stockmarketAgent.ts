"use server"
import path from "path";
import {
    getStockPrice,
    getFinancialStatement,
    getTechnicalIndicators,
    searchMarketTrend,
    searchFinancialNews,
    webSearch,
  } from "./tools";

import { promises as fsp } from "fs";         
import { AI_STOCK_RECOMMENDATION_PROMPT } from "../inngest/prompt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";
import { selectAvailableModel } from "../modelRatelimit/availableModel";


export async function runResearch(query: string): Promise<string | undefined> {
  try {
    const tools = [getStockPrice, getFinancialStatement, getTechnicalIndicators];
    if (webSearch) {
      tools.push(searchMarketTrend, searchFinancialNews);
    }

    const modal = selectAvailableModel();
    console.log(modal)
    if (!modal) {
      throw new Error('No models available within rate limits. Please try again later.');
    }

    const llm = new ChatGoogleGenerativeAI({
      model: 'gemini-2.5-flash-lite',
      maxRetries: 3,
      temperature: 0,
      apiKey: process.env.GOOGLE_API_KEY,
    });

    const agent = createAgent({
      model: llm,
      tools,
      systemPrompt: AI_STOCK_RECOMMENDATION_PROMPT,
    });

    console.log("Starting research agent...");
    
    const result = await agent.invoke({
      messages: [{ role: "user", content: `Run deep Analysis on given stock : ${query}` }]
    });

    const finalMessage = result.messages[result.messages.length - 1];
    return typeof finalMessage.content === 'string' 
      ? finalMessage.content 
      : JSON.stringify(finalMessage.content);
    
  } catch (error) {
    console.error("Error in runResearch:", error);
    return "Error occurred while processing your request.";
  }
}