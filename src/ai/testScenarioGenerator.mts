import { GeminiClient } from './geminiClient.mts';

export interface TestScenario {
  scenario: string;
  testData: string;
  expectedResult: string;
  technique: string;
}

const REQUIRED_SCENARIO_FIELDS: Array<keyof TestScenario> = [
  'scenario',
  'testData',
  'expectedResult',
  'technique',
];

/** Validates Gemini JSON before it becomes test data for callers. */
export function parseTestScenarios(response: string): TestScenario[] {
  let parsed: unknown;

  try {
    parsed = JSON.parse(response);
  } catch {
    throw new Error('Gemini returned an invalid JSON response.');
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini returned an empty scenario list.');
  }

  return parsed.map((item, index) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) {
      throw new Error(`Gemini scenario at index ${index} must be an object.`);
    }

    const scenario = item as Record<string, unknown>;
    for (const field of REQUIRED_SCENARIO_FIELDS) {
      if (typeof scenario[field] !== 'string' || scenario[field].trim() === '') {
        throw new Error(`Gemini scenario at index ${index} has an invalid ${field} field.`);
      }
    }

    return {
      scenario: scenario.scenario as string,
      testData: scenario.testData as string,
      expectedResult: scenario.expectedResult as string,
      technique: scenario.technique as string,
    };
  });
}

export class TestScenarioGenerator {
  constructor(private readonly geminiClient: GeminiClient) {}

  async generate(requirement: string): Promise<TestScenario[]> {
    const prompt = `
You are a senior QA engineer.

Analyze the following software requirement and generate functional test scenarios.

Use these black-box testing techniques:
- Equivalence Partitioning
- Boundary Value Analysis
- Error Guessing

For each scenario provide:
- scenario
- testData
- expectedResult
- technique

Every field must be a non-empty string. Generate no more than eight scenarios.

Return ONLY a valid JSON array.
Do not include markdown fences.
Do not include explanations outside the JSON.

The JSON must follow this structure:
[
  {
    "scenario": "string",
    "testData": "string",
    "expectedResult": "string",
    "technique": "string"
  }
]

Requirement:
${requirement}
`;

    const response = await this.geminiClient.generateText(prompt);

    try {
      return parseTestScenarios(response);
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'unknown validation error';
      const correctedResponse = await this.geminiClient.generateText(`
Your previous response did not satisfy the required JSON schema: ${reason}

Return a corrected version of the following response. Return ONLY a valid JSON array.
Every array item must have non-empty string fields named scenario, testData, expectedResult, and technique.
Do not add Markdown fences or explanatory text.

Previous response:
${response}`);

      return parseTestScenarios(correctedResponse);
    }
  }
}
