import { expect, test as base } from '@playwright/test';
import { environmentConfig } from '../config/environments';

type FrameworkFixtures = {
  configuredBaseURL: string;
};

export const test = base.extend<FrameworkFixtures>({
  configuredBaseURL: async ({}, use) => {
    await use(environmentConfig.baseURL);
  },
});

export { expect };
