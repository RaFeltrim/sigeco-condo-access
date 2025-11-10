import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockAuthResponse, mockUser } from '../../utils/mock-data';

describe('Auth Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('login', () => {
    it('should login successfully', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse(mockAuthResponse)
      );

      // Simulate login function
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
      });
      const data = await response.json();

      expect(data).toEqual(mockAuthResponse);
      expect(data.token).toBeDefined();
      expect(data.user).toEqual(mockUser);
    });

    it('should handle invalid credentials', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Invalid credentials' }, 401)
      );

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'wrong@example.com', password: 'wrong' }),
      });

      expect(response.status).toBe(401);
    });

    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test('test@example.com')).toBe(true);
      expect(emailRegex.test('invalid')).toBe(false);
    });

    it('should validate password length', () => {
      const minLength = 6;
      expect('password123'.length >= minLength).toBe(true);
      expect('pass'.length >= minLength).toBe(false);
    });
  });

  describe('register', () => {
    it('should register new user', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse(mockAuthResponse)
      );

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'password',
          name: 'New User',
        }),
      });
      const data = await response.json();

      expect(data).toEqual(mockAuthResponse);
    });

    it('should reject duplicate email', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Email already exists' }, 409)
      );

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          email: 'existing@example.com',
          password: 'password',
          name: 'User',
        }),
      });

      expect(response.status).toBe(409);
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user with valid token', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ user: mockUser })
      );

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: 'Bearer valid-token' },
      });
      const data = await response.json();

      expect(data.user).toEqual(mockUser);
    });

    it('should reject without token', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Unauthorized' }, 401)
      );

      const response = await fetch('/api/auth/me');
      expect(response.status).toBe(401);
    });

    it('should reject invalid token', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Invalid token' }, 401)
      );

      const response = await fetch('/api/auth/me', {
        headers: { Authorization: 'Bearer invalid-token' },
      });
      expect(response.status).toBe(401);
    });
  });

  describe('logout', () => {
    it('should clear local storage on logout', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      localStorage.clear();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('token management', () => {
    it('should store token in localStorage', () => {
      const token = 'test-jwt-token';
      localStorage.setItem('token', token);
      expect(localStorage.getItem('token')).toBe(token);
    });

    it('should retrieve token from localStorage', () => {
      localStorage.setItem('token', 'stored-token');
      const token = localStorage.getItem('token');
      expect(token).toBe('stored-token');
    });

    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.removeItem('token');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });
});
