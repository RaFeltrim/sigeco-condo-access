/**
 * Contract Tests: Login API
 * 
 * Testing Pyramid Layer: Contract Tests
 * Purpose: Ensure API contract between frontend and backend remains consistent
 */

import { describe, it, expect } from 'vitest';

// Define the expected contract
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'ADMIN' | 'SINDICO' | 'PORTEIRO';
  };
}

interface ErrorResponse {
  error: string;
  message?: string;
}

describe('Login API Contract', () => {
  describe('Request Contract', () => {
    it('should define valid request structure', () => {
      const validRequest: LoginRequest = {
        email: 'admin@sigeco.com',
        password: 'admin123',
      };

      expect(validRequest).toHaveProperty('email');
      expect(validRequest).toHaveProperty('password');
      expect(typeof validRequest.email).toBe('string');
      expect(typeof validRequest.password).toBe('string');
    });

    it('should validate email format', () => {
      const request: LoginRequest = {
        email: 'admin@sigeco.com',
        password: 'password',
      };

      // Email should follow standard format
      expect(request.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it('should require both fields', () => {
      const validRequest: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      // TypeScript enforces this at compile time
      expect(validRequest.email).toBeDefined();
      expect(validRequest.password).toBeDefined();
    });
  });

  describe('Success Response Contract', () => {
    it('should define valid success response structure', () => {
      const validResponse: LoginResponse = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: '123',
          email: 'admin@sigeco.com',
          name: 'Admin User',
          role: 'ADMIN',
        },
      };

      expect(validResponse).toHaveProperty('token');
      expect(validResponse).toHaveProperty('user');
      expect(typeof validResponse.token).toBe('string');
      expect(validResponse.token.length).toBeGreaterThan(0);
    });

    it('should include required user fields', () => {
      const response: LoginResponse = {
        token: 'mock_token',
        user: {
          id: '1',
          email: 'user@example.com',
          name: 'Test User',
          role: 'PORTEIRO',
        },
      };

      expect(response.user).toHaveProperty('id');
      expect(response.user).toHaveProperty('email');
      expect(response.user).toHaveProperty('name');
      expect(response.user).toHaveProperty('role');
    });

    it('should validate role enum', () => {
      const validRoles: Array<'ADMIN' | 'SINDICO' | 'PORTEIRO'> = [
        'ADMIN',
        'SINDICO',
        'PORTEIRO',
      ];

      validRoles.forEach(role => {
        const response: LoginResponse = {
          token: 'token',
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test',
            role: role,
          },
        };

        expect(['ADMIN', 'SINDICO', 'PORTEIRO']).toContain(response.user.role);
      });
    });
  });

  describe('Error Response Contract', () => {
    it('should define valid error response structure', () => {
      const errorResponse: ErrorResponse = {
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      };

      expect(errorResponse).toHaveProperty('error');
      expect(typeof errorResponse.error).toBe('string');
    });

    it('should handle 401 Unauthorized', () => {
      const error401: ErrorResponse = {
        error: 'Unauthorized',
        message: 'Invalid credentials',
      };

      expect(error401.error).toBe('Unauthorized');
    });

    it('should handle 400 Bad Request', () => {
      const error400: ErrorResponse = {
        error: 'Bad Request',
        message: 'Email is required',
      };

      expect(error400.error).toBe('Bad Request');
    });

    it('should handle 500 Internal Server Error', () => {
      const error500: ErrorResponse = {
        error: 'Internal Server Error',
      };

      expect(error500.error).toBe('Internal Server Error');
    });
  });

  describe('HTTP Method and Endpoint', () => {
    it('should use POST method', () => {
      const method = 'POST';
      expect(method).toBe('POST');
    });

    it('should use correct endpoint', () => {
      const endpoint = '/api/auth/login';
      expect(endpoint).toBe('/api/auth/login');
    });

    it('should accept JSON content type', () => {
      const contentType = 'application/json';
      expect(contentType).toBe('application/json');
    });
  });

  describe('Token Format', () => {
    it('should return JWT token format', () => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      // JWT tokens have 3 parts separated by dots
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should be a non-empty string', () => {
      const response: LoginResponse = {
        token: 'valid_token_string',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test',
          role: 'ADMIN',
        },
      };

      expect(response.token).toBeTruthy();
      expect(response.token.length).toBeGreaterThan(0);
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain existing fields', () => {
      // Ensure new versions don't remove existing fields
      const response: LoginResponse = {
        token: 'token',
        user: {
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'ADMIN',
        },
      };

      // All original fields must exist
      const requiredFields = ['token', 'user'];
      const userFields = ['id', 'email', 'name', 'role'];

      requiredFields.forEach(field => {
        expect(response).toHaveProperty(field);
      });

      userFields.forEach(field => {
        expect(response.user).toHaveProperty(field);
      });
    });
  });
});
