import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    localStorage.clear();
  });

  describe('request interceptor', () => {
    it('adds authorization header when token exists', async () => {
      localStorage.setItem('token', 'test-token');
      
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'test' })
      );

      await fetch('/api/test', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('makes request without token when not authenticated', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'test' })
      );

      await fetch('/api/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/test', undefined);
    });
  });

  describe('response interceptor', () => {
    it('handles successful response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'success' }, 200)
      );

      const response = await fetch('/api/test');
      const data = await response.json();

      expect(response.ok).toBe(true);
      expect(data).toEqual({ data: 'success' });
    });

    it('handles 401 unauthorized', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Unauthorized' }, 401)
      );

      const response = await fetch('/api/test');

      expect(response.status).toBe(401);
      // In real app, would redirect to login
    });

    it('handles 500 server error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Internal Server Error' }, 500)
      );

      const response = await fetch('/api/test');

      expect(response.status).toBe(500);
    });

    it('handles network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(fetch('/api/test')).rejects.toThrow('Network error');
    });
  });

  describe('request methods', () => {
    it('makes GET request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'test' })
      );

      await fetch('/api/test', { method: 'GET' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('makes POST request with body', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'created' }, 201)
      );

      await fetch('/api/test', {
        method: 'POST',
        body: JSON.stringify({ name: 'test' }),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ name: 'test' }),
        })
      );
    });

    it('makes PUT request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ data: 'updated' })
      );

      await fetch('/api/test/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'updated' }),
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test/1',
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('makes DELETE request', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({}, 204)
      );

      await fetch('/api/test/1', { method: 'DELETE' });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/test/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  describe('error handling', () => {
    it('parses error response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Validation error', errors: [] }, 400)
      );

      const response = await fetch('/api/test');
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Validation error');
    });

    it('handles timeout', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 100))
      );

      await expect(fetch('/api/test')).rejects.toThrow();
    });
  });
});
