import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not configured.');
}

export class GeminiClient {
  private readonly client: GoogleGenAI;

  constructor() {
    this.client = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });
  }

  async generateText(prompt: string): Promise<string> {
    const interaction = await this.client.interactions.create({
      model: 'gemini-3.6-flash',
      input: prompt,
    });

    if (!interaction.output_text) {
      throw new Error('Gemini returned an empty response.');
    }

    return interaction.output_text;
  }
}