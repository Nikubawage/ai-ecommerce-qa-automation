import { generateMessages } from '@cucumber/gherkin';
import { IdGenerator, SourceMediaType } from '@cucumber/messages';
import { GeminiClient } from './geminiClient.mts';

/** Parses and checks a Gemini-generated feature before it is returned to callers. */
export function validateGherkinFeature(gherkin: string): string {
  if (gherkin.trim() === '') {
    throw new Error('Gemini returned an empty Gherkin response.');
  }

  const messages = generateMessages(
    gherkin,
    'generated.feature',
    SourceMediaType.TEXT_X_CUCUMBER_GHERKIN_PLAIN,
    {
      includeGherkinDocument: true,
      includePickles: true,
      newId: IdGenerator.uuid(),
    },
  );

  const parseError = messages.find((message) => message.parseError);

  if (parseError?.parseError) {
    throw new Error(
      `Gemini returned invalid Gherkin: ${parseError.parseError.message}`,
    );
  }

  const document = messages.find(
    (message) => message.gherkinDocument,
  )?.gherkinDocument;

  const scenarios = messages.filter((message) => message.pickle);

  if (!document?.feature || scenarios.length === 0) {
    throw new Error(
      'Gemini Gherkin must contain a Feature and at least one Scenario.',
    );
  }

  if (
    !/\bGiven\b/i.test(gherkin) ||
    !/\bWhen\b/i.test(gherkin) ||
    !/\bThen\b/i.test(gherkin)
  ) {
    throw new Error(
      'Gemini Gherkin must include Given, When, and Then steps.',
    );
  }

  return gherkin.trim();
}

export class GherkinScenarioGenerator {
  constructor(private readonly geminiClient: GeminiClient) {}

  async generate(requirement: string): Promise<string> {
    const prompt = `
You are a senior QA engineer. Convert the requirement below into an executable Gherkin feature.

Use a Feature with realistic Scenario entries. Cover Equivalence Partitioning, Boundary Value Analysis,
and Error Guessing where relevant. Every scenario must explicitly contain Given, When, and Then steps.
Return ONLY valid plain Gherkin. Do not use Markdown fences or explanatory text.
Do not invent application behavior beyond the requirement.

Requirement:
${requirement}
`;

    const response = await this.geminiClient.generateText(prompt);

    return validateGherkinFeature(response);
  }
}