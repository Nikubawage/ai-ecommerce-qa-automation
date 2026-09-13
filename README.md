# AI E-commerce QA Automation

Playwright and TypeScript test automation for the Practice Software Testing application. The project keeps UI, API, BDD, and AI-assisted test design separate so routine browser/API runs do not require an AI key.

## Architecture

- `src/pages/` — Playwright page objects used by UI and BDD tests.
- `src/api/` — API client and API specifications.
- `src/fixtures/` and `test-data/` — shared Playwright fixtures and stable test data.
- `tests/ui/` and `tests/api/` — regular Playwright tests.
- `features/` and `tests/bdd/` — Gherkin features and Cucumber step definitions. The quantity steps reuse `HomePage` and `ProductPage`.
- `src/ai/` — Gemini client plus JSON scenario and Gherkin feature generators.
- `ai/prompts/` — requirement inputs for AI-assisted test design.

## Running tests

Install dependencies and browser binaries once:

```bash
npm ci
npx playwright install
```

```bash
npm run typecheck       # TypeScript validation
npm run test:ui         # Chromium UI suite
npm run test:api        # API suite
npm test                # Full non-AI Playwright matrix
npm run test:bdd        # Cucumber quantity feature against the live application
npm run test:ai         # Gemini-only tests (requires GEMINI_API_KEY)
```

The Playwright configuration excludes `tests/ai/` from normal browser projects. GitHub Actions runs type checking, normal Playwright tests, and BDD tests; it intentionally does not run Gemini tests, so no key is exposed in CI.

## AI usage

Create a local `.env` file (it is gitignored) containing only your own key:

```dotenv
GEMINI_API_KEY=your_key_here
```

`GeminiClient` reads the key only from the environment and never logs it. It uses Gemini Interactions API with `gemini-3.6-flash`.

The existing `TestScenarioGenerator` turns a requirement into validated structured JSON scenarios. `GherkinScenarioGenerator` turns the same requirement into a parsed, validated Gherkin feature and rejects empty, malformed, or structurally incomplete output.

Example AI → Gherkin workflow:

1. Write or update a requirement such as `ai/prompts/product-quantity-requirement.txt`.
2. Run `npm run test:ai` to verify Gemini can generate valid JSON scenarios and a Feature containing Given/When/Then.
3. Review generated scenarios before adopting them as executable tests.
4. Add approved behavior to a `.feature` file and implement/reuse page-object steps under `tests/bdd/`.
5. Run `npm run test:bdd` to execute it against the application.

## Quantity BDD coverage

`features/product-quantity.feature` covers equivalence partitions, boundary values, and error guessing for the observed quantity behavior: 0 becomes 1, 1 and 99 are accepted, and 100 becomes 99 with the product limit message.
