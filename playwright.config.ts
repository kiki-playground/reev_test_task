import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';


const ENV = process.env.ENV || 'local';
dotenv.config({ path: `./config/env/${ENV}.env` });


export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : 2,
  reporter: 'html',
  use: {
    baseURL: process.env.BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'api',
      testMatch: '**/*api.spec.ts',
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testMatch: ['**/*ui.spec.ts', '**/*e2e.spec.ts'],
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: ['**/*ui.spec.ts', '**/*e2e.spec.ts'],
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: ['**/*ui.spec.ts', '**/*e2e.spec.ts'],
    }
  ],

});
