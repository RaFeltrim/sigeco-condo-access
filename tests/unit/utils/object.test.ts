import { describe, it, expect } from 'vitest';

const omit = <T extends Record<string, unknown>>(obj: T, ...keys: string[]): Partial<T> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

const pick = <T extends Record<string, unknown>>(obj: T, ...keys: string[]): Partial<T> => {
  const result: Partial<T> = {};
  keys.forEach(key => {
    if (key in obj) result[key as keyof T] = obj[key];
  });
  return result;
};

describe('Object Utilities', () => {
  describe('omit', () => {
    it('omits specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, 'b')).toEqual({ a: 1, c: 3 });
    });

    it('omits multiple keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(omit(obj, 'a', 'c')).toEqual({ b: 2 });
    });
  });

  describe('pick', () => {
    it('picks specified keys', () => {
      const obj = { a: 1, b: 2, c: 3 };
      expect(pick(obj, 'a', 'c')).toEqual({ a: 1, c: 3 });
    });
  });
});
