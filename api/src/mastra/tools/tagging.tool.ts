/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { z } from 'zod';
import { createTool } from '@mastra/core/tools';
import { google } from '@ai-sdk/google';

export const taggingTool = createTool({
  id: 'autoTagBookReview',
  description: 'Generate 3-7 concise, lowercase tags for a book review.',
  inputSchema: z.object({
    review: z.string().min(10),
    maxTags: z.number().int().min(1).max(10).default(6),
  }),
  execute: async ({ context }: any) => {
    const { review, maxTags } = context;
    // lightweight prompt + JSON format
    const model = google('gemini-2.5-flash-lite');
    const prompt = [
      {
        role: 'user' as const,
        content: [
          {
            type: 'text' as const,
            text: `Extract ${maxTags} relevant tags from this book review. Return only a JSON array of strings.\n\nReview: ${review}`,
          },
        ],
      },
    ];

    // Simple completion; you could also use a structured parse
    const result = await model.doGenerate({
      inputFormat: 'messages',
      mode: { type: 'regular' },
      prompt,
    });
    const text = result.text || '[]';
    // try parse or fallback
    try {
      const tags = JSON.parse(text);
      return { tags };
    } catch {
      const tags = text
        .replace(/[\]\n"]/g, '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .slice(0, maxTags);
      return { tags };
    }
  },
});
