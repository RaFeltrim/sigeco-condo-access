/**
 * Mock User Fixtures
 * Factory functions for generating test user data
 */

import { MockUser } from '../utils/test-utils';

/**
 * Base mock users for different roles
 */
export const mockUsers: Record<string, MockUser> = {
  porteiro: {
    id: '1',
    username: 'porteiro',
    role: 'porteiro',
    nome: 'José Porteiro',
    email: 'jose.porteiro@sigeco.com',
  },
  admin: {
    id: '2',
    username: 'admin',
    role: 'admin',
    nome: 'Admin Sistema',
    email: 'admin@sigeco.com',
  },
  morador: {
    id: '3',
    username: 'morador',
    role: 'morador',
    nome: 'Carlos Morador',
    email: 'carlos.morador@sigeco.com',
  },
};

/**
 * Factory function to create a mock user with custom properties
 * 
 * @param role - User role (porteiro, admin, or morador)
 * @param overrides - Optional properties to override defaults
 * @returns Mock user object
 * 
 * @example
 * ```ts
 * const user = createMockUser('porteiro', { nome: 'João Silva' });
 * ```
 */
export function createMockUser(
  role: 'porteiro' | 'admin' | 'morador' = 'porteiro',
  overrides?: Partial<MockUser>
): MockUser {
  const baseUser = mockUsers[role];
  return {
    ...baseUser,
    ...overrides,
  };
}

/**
 * Create multiple mock users
 * 
 * @param count - Number of users to create
 * @param role - Role for all users
 * @returns Array of mock users
 */
export function createMockUsers(
  count: number,
  role: 'porteiro' | 'admin' | 'morador' = 'porteiro'
): MockUser[] {
  return Array.from({ length: count }, (_, index) =>
    createMockUser(role, {
      id: `${role}-${index + 1}`,
      username: `${role}${index + 1}`,
      nome: `${role.charAt(0).toUpperCase() + role.slice(1)} ${index + 1}`,
      email: `${role}${index + 1}@sigeco.com`,
    })
  );
}
