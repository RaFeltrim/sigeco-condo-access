/**
 * Tests for Document Formatting System
 */

import { describe, it, expect } from 'vitest';
import {
  formatCPF,
  formatRG,
  formatDocument,
  unformatDocument,
} from '../documentFormatter';

describe('Document Formatter', () => {
  describe('unformatDocument', () => {
    it('should remove all non-numeric characters', () => {
      expect(unformatDocument('111.444.777-35')).toBe('11144477735');
      expect(unformatDocument('12.345.678-9')).toBe('123456789');
      expect(unformatDocument('abc123def456')).toBe('123456');
    });
  });

  describe('formatCPF', () => {
    it('should format CPF with mask', () => {
      expect(formatCPF('11144477735')).toBe('111.444.777-35');
    });

    it('should format partial CPF progressively', () => {
      expect(formatCPF('111')).toBe('111');
      expect(formatCPF('1114')).toBe('111.4');
      expect(formatCPF('1114447')).toBe('111.444.7');
      expect(formatCPF('111444777')).toBe('111.444.777');
      expect(formatCPF('1114447773')).toBe('111.444.777-3');
    });

    it('should limit to 11 digits', () => {
      expect(formatCPF('111444777351234')).toBe('111.444.777-35');
    });
  });

  describe('formatRG', () => {
    it('should format RG with mask', () => {
      expect(formatRG('123456789')).toBe('12.345.678-9');
    });

    it('should format partial RG progressively', () => {
      expect(formatRG('12')).toBe('12');
      expect(formatRG('123')).toBe('12.3');
      expect(formatRG('12345')).toBe('12.345');
      expect(formatRG('123456')).toBe('12.345.6');
      expect(formatRG('12345678')).toBe('12.345.678');
      expect(formatRG('123456789')).toBe('12.345.678-9');
    });

    it('should limit to 9 digits', () => {
      expect(formatRG('1234567891234')).toBe('12.345.678-9');
    });
  });

  describe('formatDocument', () => {
    it('should format as CPF when type is specified', () => {
      expect(formatDocument('11144477735', 'CPF')).toBe('111.444.777-35');
    });

    it('should format as RG when type is specified', () => {
      expect(formatDocument('123456789', 'RG')).toBe('12.345.678-9');
    });

    it('should auto-detect and format RG for 9 digits or less', () => {
      expect(formatDocument('123456789')).toBe('12.345.678-9');
    });

    it('should auto-detect and format CPF for more than 9 digits', () => {
      expect(formatDocument('11144477735')).toBe('111.444.777-35');
    });
  });
});
