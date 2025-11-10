import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for System Validation Agents
 *
 * This configuration is optimized for running validation agents with:
 * - Longer timeouts for complex operations
 * - Screenshot and video capture on failure
 * - Multiple browser support
 * - Ad blocker simulation support
 */
export default defineConfig({
  testDir: './tests/validation-agents',
  
  // Maximum time one test can run
  timeout: 60 * 1000, // 60 seconds
  
  // Maximum time for expect() assertions
  expect: {
    timeout: 10 * 1000, // 10 seconds
  },
  
  // Run tests in files in parallel
  fullyParallel: false,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter to use
  reporter: [
    ['html', { outputFolder: 'playwright-report/validation' }],
    ['json', { outputFile: 'playwright-report/validation/results.json' }],
    ['list'],
  ],
  
  // Shared settings for all the projects below
  use: {
    // Base URL to use in actions like `await page.goto('/')`
    baseURL: process.env.BASE_URL || 'http://localhost:5173',
    
    // Collect trace when retrying the failed test
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Maximum time for actions like click, fill, etc.
    actionTimeout: 10 * 1000,
    
    // Maximum time for navigation
    navigationTimeout: 30 * 1000,
  },
  
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
      },
    },
    
    // Uncomment to test on Firefox
    // {
    //   name: 'firefox',
    //   use: { 
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    
    // Uncomment to test on WebKit
    // {
    //   name: 'webkit',
    //   use: { 
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1920, height: 1080 },
    //   },
    // },
    
    // Ad Blocker simulation for Dashboard Agent
    {
      name: 'chromium-adblocker',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // Ad blocker will be configured in the agent itself
      },
    },
  ],
  
  // Run your local dev server before starting the tests
  // Uncomment if you want Playwright to start the dev server automatically
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:5173',
  //   reuseExistingServer: !process.env.CI,
  //   timeout: 120 * 1000,
  // },
});
