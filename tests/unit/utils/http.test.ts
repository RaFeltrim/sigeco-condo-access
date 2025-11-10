import { describe, it, expect } from 'vitest';

const buildQueryString = (params: Record<string, unknown>): string => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value != null) query.append(key, String(value));
  });
  return query.toString();
};

describe('HTTP Utilities', () => {
  describe('buildQueryString', () => {
    it('builds query string', () => {
      const params = { page: 1, limit: 10 };
      expect(buildQueryString(params)).toBe('page=1&limit=10');
    });

    it('handles empty params', () => {
      expect(buildQueryString({})).toBe('');
    });

    it('skips null values', () => {
      const params = { a: 1, b: null, c: 3 };
      expect(buildQueryString(params)).toBe('a=1&c=3');
    });

    it('encodes special characters', () => {
      const params = { search: 'hello world' };
      expect(buildQueryString(params)).toContain('hello+world');
    });
  });
});
