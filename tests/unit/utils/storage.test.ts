import { describe, it, expect, beforeEach } from 'vitest';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('localStorage', () => {
    it('stores and retrieves string', () => {
      localStorage.setItem('key', 'value');
      expect(localStorage.getItem('key')).toBe('value');
    });

    it('stores and retrieves JSON', () => {
      const obj = { a: 1, b: 2 };
      localStorage.setItem('obj', JSON.stringify(obj));
      const retrieved = JSON.parse(localStorage.getItem('obj') || '{}');
      expect(retrieved).toEqual(obj);
    });

    it('removes item', () => {
      localStorage.setItem('key', 'value');
      localStorage.removeItem('key');
      expect(localStorage.getItem('key')).toBeNull();
    });

    it('clears all items', () => {
      localStorage.setItem('key1', 'value1');
      localStorage.setItem('key2', 'value2');
      localStorage.clear();
      expect(localStorage.length).toBe(0);
    });
  });
});
