import { describe, it, expect } from 'vitest';

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function truncate(str: string, length: number): string {
  return str.length > length ? str.slice(0, length) + '...' : str;
}

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('lowercases rest', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('handles single char', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });
  });

  describe('truncate', () => {
    it('truncates long string', () => {
      expect(truncate('hello world', 5)).toBe('hello...');
    });

    it('keeps short string', () => {
      expect(truncate('hello', 10)).toBe('hello');
    });

    it('handles exact length', () => {
      expect(truncate('hello', 5)).toBe('hello');
    });
  });

  describe('slugify', () => {
    it('creates slug from text', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('removes special chars', () => {
      expect(slugify('Hello! World?')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Hello   World')).toBe('hello-world');
    });
  });
});
