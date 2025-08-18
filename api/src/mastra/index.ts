import { google } from "@ai-sdk/google";
import { Mastra } from "@mastra/core";
import { Agent } from "@mastra/core/agent";
import { taggingTool } from "./tools/tagging.tool";
import { sentimentTool } from "./tools/sentiment.tool";

export const bookAgent = new Agent({
    name: "book-agent",
    instructions: `
You are a helpful assistant for book reviews. 
When a user provides a review, (1) summarize briefly, (2) call tools to produce tags and sentiment, (3) return a single JSON payload:
{ summary: string, sentimentScore: number, tags: string[] }
The sentimentScore should be a number between 0 and 1 where 0 is very negative and 1 is very positive.`,
    model: google("gemini-2.5-flash-lite"),
    tools: { taggingTool, sentimentTool },
});

export const mastra = new Mastra({
    agents: { bookAgent },
    telemetry: {
        enabled: false
    }
})