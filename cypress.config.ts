import { defineConfig } from "cypress";
import * as fs from "fs";
import * as path from "path";

export default defineConfig({
  projectId: "9zu5em",

  e2e: {
    baseUrl: "http://localhost:9323",
    specPattern: "tests/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/cypress/support/e2e.ts",
    videosFolder: "test-results/cypress/videos",
    screenshotsFolder: "test-results/cypress/screenshots",
    downloadsFolder: "test-results/cypress/downloads",
    fixturesFolder: "tests/cypress/fixtures",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    chromeWebSecurity: false,
    experimentalModifyObstructiveThirdPartyCode: true,
    setupNodeEvents(on, config) {
      // Error tracking storage
      const errorLogPath = path.join(__dirname, 'test-results', 'cypress', 'test-errors.json');
      let testErrors: Array<{
        spec: string;
        test: string;
        error: string;
        stack?: string;
        timestamp: string;
      }> = [];

      // Initialize error log file
      on('before:run', () => {
        const dir = path.dirname(errorLogPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        testErrors = [];
      });

      // Capture test failures
      on('after:spec', (spec, results) => {
        if (results && results.tests) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          results.tests.forEach((test: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            test.attempts.forEach((attempt: any) => {
              if (attempt.state === 'failed' && attempt.error) {
                testErrors.push({
                  spec: spec.relative,
                  test: test.title.join(' > '),
                  error: attempt.error.message || String(attempt.error),
                  stack: attempt.error.stack,
                  timestamp: new Date().toISOString()
                });
              }
            });
          });
        }
      });

      // Save errors to file after all tests
      on('after:run', () => {
        if (testErrors.length > 0) {
          fs.writeFileSync(
            errorLogPath,
            JSON.stringify({
              summary: {
                totalErrors: testErrors.length,
                generatedAt: new Date().toISOString()
              },
              errors: testErrors
            }, null, 2)
          );
          console.log(`\n✗ ${testErrors.length} test errors logged to ${errorLogPath}`);
        } else {
          console.log('\n✓ All tests passed!');
        }
      });

      on("task", {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        },
      });

      // Suppress service worker errors
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--disable-features=ServiceWorker");
        }
        return launchOptions;
      });

      return config;
    },
  },

  retries: {
    runMode: 2,
    openMode: 0,
  },

  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  pageLoadTimeout: 30000,

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    specPattern: "tests/cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "tests/cypress/support/component.ts",
    indexHtmlFile: "tests/cypress/support/component-index.html",
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
