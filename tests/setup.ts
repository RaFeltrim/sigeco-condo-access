import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import { server, resetMockData } from './mocks/server';
import { cleanupTestState } from './utils/test-utils';

/**
 * Global Test Setup
 * Configures MSW server and cleanup for all tests
 */

// Setup MSW server for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' });
});

// Cleanup after all tests
afterAll(() => {
  server.close();
});

// Reset state after each test for isolation
afterEach(() => {
  server.resetHandlers();
  resetMockData();
  cleanupTestState();
  cleanup();
});
