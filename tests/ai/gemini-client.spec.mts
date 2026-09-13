import { test, expect } from '@playwright/test';
import { GeminiClient } from '../../src/ai/geminiClient.mts';

test('Gemini API returns a response', async () => {
  const geminiClient = new GeminiClient();

  const response = await geminiClient.generateText(
    'Give me one short sentence about software testing.',
  );

  expect(response.trim()).not.toBe('');
});