import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import express, { Request, Response } from "express";
import 'dotenv/config';
import { systemPrompt } from '../lib/system_prompt';

const router = express.Router();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

router.post("/chat", async (request: Request, response: Response) => {
  const { messages } = request.body as { messages?: any[] };

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: 'Invalid request body. Expected { messages: UIMessage[] }.' });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return response.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY is not set.' });
  }

  try {
    // Transform UIMessages to ModelMessages format
    const modelMessages = messages.map((message) => ({
      role: message.role,
      content: message.parts,
    }));

    const result = await generateText({
      model: google('gemini-2.5-flash-lite'),
      system: systemPrompt,
      messages: modelMessages,
    });

    return response.json({ 
      response: result.text,
      usage: result.usage 
    });
  } catch (error) {
    console.error('Error:', error);
    return response.status(500).json({ error: 'Chat request failed.' });
  }
});

export default router;