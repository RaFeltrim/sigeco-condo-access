import { setupServer } from 'msw/node';
import { handlers, errorHandlers, resetMockData } from './handlers';

/**
 * MSW Server for Node Environment
 * Used in unit and integration tests
 * 
 * @example
 * ```ts
 * // In test setup
 * beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
 * afterAll(() => server.close());
 * afterEach(() => server.resetHandlers());
 * ```
 */
export const server = setupServer(...handlers);

/**
 * Helper function to use error handlers in tests
 * 
 * @example
 * ```ts
 * test('handles server error', () => {
 *   server.use(errorHandlers.serverError);
 *   // Your test code
 * });
 * ```
 */
export { errorHandlers, resetMockData };
