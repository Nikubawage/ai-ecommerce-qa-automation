import { test, expect } from '@playwright/test';
import { GeminiClient } from '../../src/ai/geminiClient.mts';
import { parseTestScenarios, TestScenarioGenerator } from '../../src/ai/testScenarioGenerator.mts';
import { readFileSync } from 'node:fs';

test('Gemini generates QA scenarios from a requirement', async () => {
  const geminiClient = new GeminiClient();
  const generator = new TestScenarioGenerator(geminiClient);

  const requirement = readFileSync(
    'ai/prompts/product-quantity-requirement.txt',
    'utf8',
);

  const scenarios = await generator.generate(requirement);
  console.log(JSON.stringify(scenarios, null, 2));

  expect(scenarios.length).toBeGreaterThan(0);

  for (const scenario of scenarios) {
    expect(scenario.scenario).not.toBe('');
    expect(scenario.expectedResult).not.toBe('');
    expect(scenario.technique).not.toBe('');
}

  expect(
    scenarios.some((scenario) =>
      scenario.technique.toLowerCase().includes('boundary'),
    ),
  ).toBe(true);
});

test('scenario validation rejects malformed or incomplete Gemini JSON', () => {
  expect(() => parseTestScenarios('not JSON')).toThrow('invalid JSON');
  expect(() => parseTestScenarios('[]')).toThrow('empty scenario list');
  expect(() => parseTestScenarios('[{"scenario":"Missing required fields"}]')).toThrow('invalid testData field');
});
