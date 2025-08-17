import { z } from "zod";
import { createTool } from "@mastra/core/tools";
import { google } from "@ai-sdk/google";

export const sentimentTool = createTool({
    id: "sentimentForReview",
    description: "Return sentiment {label, score[0..1]} for a book review.",
    inputSchema: z.object({ review: z.string().min(10) }),
    execute: async ({ context }) => {
        const { review } = context;
        const model = google("gemini-2.5-flash-lite");
        const prompt = [
            {
                role: 'user' as const,
                content: [
                    {
                        type: 'text' as const,
                        text: `Analyze the sentiment of this review text. Based on the content, determine:
1. A sentiment label: "positive", "negative", or "neutral"
2. A sentiment score between 0 and 1 (where 0 = very negative, 0.5 = neutral, 1 = very positive)

Review text: "${review}"

Respond with only a JSON object in this exact format: {"label": "[sentiment]", "score": [number]}`
                    }
                ]
            }
        ];
        const result = await model.doGenerate({
            inputFormat: 'messages',
            mode: { type: 'object-json' },
            prompt
        });
        const text = result.text || '';
        try {
            return JSON.parse(text);
        } catch {
            // Fallback to neutral if parsing fails
            return { label: "neutral", score: 0.5 };
        }
    },
});
