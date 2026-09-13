import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { GeminiClient } from '../../src/ai/geminiClient.mts';
import { GherkinScenarioGenerator, validateGherkinFeature } from '../../src/ai/gherkinScenarioGenerator.mts';

test('Gemini generates a valid Gherkin feature from a requirement', async () => {
  const requirement = readFileSync('ai/prompts/product-quantity-requirement.txt', 'utf8');
  const feature = await new GherkinScenarioGenerator(new GeminiClient()).generate(requirement);

  expect(feature).not.toBe('');
  expect(feature).toMatch(/\bFeature:/i);
  expect(feature).toMatch(/\bGiven\b/i);
  expect(feature).toMatch(/\bWhen\b/i);
  expect(feature).toMatch(/\bThen\b/i);
});

test('Gherkin validation rejects malformed AI output', () => {
  expect(() => validateGherkinFeature('not a feature')).toThrow('invalid Gherkin');
});
