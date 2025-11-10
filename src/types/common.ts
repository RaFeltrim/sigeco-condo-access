/**
 * Common types used across the application
 */

// Generic data type for flexible objects
export type GenericData = Record<string, unknown>;

// Log data type
export type LogData = Record<string, unknown> | undefined;

// Event data for analytics
export type EventData = Record<string, unknown>;

// Generic error type
export type GenericError = Error | unknown;

// Page type for Playwright
export type PlaywrightPage = {
  goto: (url: string) => Promise<unknown>;
  click: (selector: string) => Promise<void>;
  fill: (selector: string, value: string) => Promise<void>;
  waitForSelector: (selector: string, options?: unknown) => Promise<unknown>;
  locator: (selector: string) => unknown;
  // Add other methods as needed
  [key: string]: unknown;
};
