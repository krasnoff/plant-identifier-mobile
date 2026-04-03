import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import express, { Request, Response } from "express";
import 'dotenv/config';

const router = express.Router();

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY || '',
});

router.post("/chat", async (request: Request, response: Response) => {
  const { messages } = request.body as { messages?: any[] };

  console.log('Received request body:', request.body);

  if (!Array.isArray(messages)) {
    return response.status(400).json({ error: 'Invalid request body. Expected { messages: UIMessage[] }.' });
  }

  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return response.status(500).json({ error: 'GOOGLE_GENERATIVE_AI_API_KEY is not set.' });
  }

  console.log('Received messages:', messages);

  try {
    // Simplify to just get the latest user message
    const lastMessage = messages[messages.length - 1];
    const prompt = lastMessage?.content || "Help me identify a plant";

    console.log('Using prompt:', prompt);

    const result = await generateText({
      model: google('gemini-2.5-flash-lite'),
      prompt: `You are a helpful plant identification assistant. User says: "${prompt}"`
    });

    console.log('Generated response:', result.text);
    
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