import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

/**
 * MSW Worker for Browser Environment
 * Used in E2E tests and development
 * 
 * To use in development, add this to your main.tsx:
 * ```ts
 * if (import.meta.env.DEV) {
 *   const { worker } = await import('./tests/mocks/browser');
 *   worker.start();
 * }
 * ```
 * 
 * @example
 * ```ts
 * // In E2E test setup
 * await worker.start();
 * ```
 */
export const worker = setupWorker(...handlers);
