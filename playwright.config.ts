import { defineConfig, devices } from '@playwright/test';
import { environmentConfig } from './src/config/environments';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. */
  reporter: [['html', { open: 'never' }]],

  /* Shared settings for all projects. */
  use: {
    /* Base URL is selected centrally through TEST_ENV. */
    baseURL: environmentConfig.baseURL,

    /* Collect trace when retrying the failed test. */
    trace: 'on-first-retry',
  },

  /* Configure projects for different test types. */
  projects: [
    {
      name: 'chromium',
      testIgnore: /[\\/]ai[\\/]/,
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      testIgnore: /[\\/]ai[\\/]/,
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      testIgnore: /[\\/]ai[\\/]/,
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'ai',
      testMatch: /ai\/.*\.spec\.mts$/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
