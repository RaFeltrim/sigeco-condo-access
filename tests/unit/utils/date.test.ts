/**
 * Unit Tests: Date Utilities
 * 
 * Testing Pyramid Layer: Unit Tests (Base)
 * Purpose: Test pure date manipulation functions
 */

import { describe, it, expect } from 'vitest';

// Mock date utility functions (to be implemented)
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const diffInDays = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

describe('Date Utilities', () => {
  describe('formatDate', () => {
    it('should format date in Brazilian format', () => {
      const date = new Date('2024-11-10');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/\d{1,2}\/\d{1,2}\/\d{4}/);
    });

    it('should handle different date inputs', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        new Date('2024-06-15'),
      ];
      
      dates.forEach(date => {
        expect(formatDate(date)).toBeTruthy();
      });
    });
  });

  describe('parseDate', () => {
    it('should parse ISO date string', () => {
      const result = parseDate('2024-11-10');
      expect(result).toBeInstanceOf(Date);
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(10); // November (0-indexed)
    });

    it('should handle invalid date strings', () => {
      const result = parseDate('invalid');
      expect(result.toString()).toBe('Invalid Date');
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date(2024, 10, 10); // Nov 10, 2024 (month is 0-indexed)
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(15);
      expect(result.getMonth()).toBe(10);
    });

    it('should handle negative days', () => {
      const date = new Date(2024, 10, 10); // Nov 10, 2024
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(5);
      expect(result.getMonth()).toBe(10);
    });

    it('should handle month transitions', () => {
      const date = new Date(2024, 10, 28); // Nov 28, 2024
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(3);
    });
  });

  describe('diffInDays', () => {
    it('should calculate difference between dates', () => {
      const date1 = new Date('2024-11-10');
      const date2 = new Date('2024-11-15');
      expect(diffInDays(date1, date2)).toBe(5);
    });

    it('should handle reversed dates', () => {
      const date1 = new Date('2024-11-15');
      const date2 = new Date('2024-11-10');
      expect(diffInDays(date1, date2)).toBe(5);
    });

    it('should return 0 for same date', () => {
      const date = new Date('2024-11-10');
      expect(diffInDays(date, date)).toBe(0);
    });
  });
});
