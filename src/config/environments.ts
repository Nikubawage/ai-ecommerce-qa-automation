export type TestEnvironment = 'local' | 'test';

export interface EnvironmentConfig {
  baseURL: string;
  apiBaseURL: string;
}

const environments: Record<TestEnvironment, EnvironmentConfig> = {
  local: {
    baseURL: 'https://practicesoftwaretesting.com',
    apiBaseURL: 'https://api.practicesoftwaretesting.com',
  },
  test: {
    baseURL: 'https://practicesoftwaretesting.com',
    apiBaseURL: 'https://api.practicesoftwaretesting.com',
  },
};

const requestedEnvironment = process.env.TEST_ENV;

function isTestEnvironment(value: string): value is TestEnvironment {
  return value === 'local' || value === 'test';
}

if (requestedEnvironment !== undefined && !isTestEnvironment(requestedEnvironment)) {
  throw new Error(
    `Unsupported TEST_ENV "${requestedEnvironment}". Supported values are: local, test.`,
  );
}

export const testEnvironment: TestEnvironment = requestedEnvironment ?? 'test';

export const environmentConfig: EnvironmentConfig = environments[testEnvironment];
