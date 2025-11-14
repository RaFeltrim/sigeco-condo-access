// Stryker Configuration for Moradores CRUD Logic Mutation Testing
// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  reporters: ["html", "clear-text", "progress", "dashboard"],
  testRunner: "vitest",
  coverageAnalysis: "perTest",
  mutate: [
    "src/lib/moradores-crud.ts"  // Mutate the source logic
  ],
  vitest: {
    configFile: "vitest.config.ts"
  },
  timeoutMS: 60000,
  timeoutFactor: 2,
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  thresholds: {
    high: 80,
    low: 60,
    break: 100  // We want 100% mutation coverage
  }
};

export default config;
