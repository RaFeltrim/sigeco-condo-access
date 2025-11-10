import { describe, it, expect } from 'vitest';

const unique = <T>(arr: T[]): T[] => [...new Set(arr)];
const chunk = <T>(arr: T[], size: number): T[][] => {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
const flatten = <T>(arr: T[][]): T[] => arr.flat();

describe('Array Utilities', () => {
  describe('unique', () => {
    it('removes duplicates', () => {
      expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
    });

    it('handles empty array', () => {
      expect(unique([])).toEqual([]);
    });

    it('handles strings', () => {
      expect(unique(['a', 'b', 'a'])).toEqual(['a', 'b']);
    });
  });

  describe('chunk', () => {
    it('chunks array', () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('handles exact chunks', () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('flatten', () => {
    it('flattens nested array', () => {
      expect(flatten([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4]);
    });
  });
});
