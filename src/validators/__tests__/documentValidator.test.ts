/**
 * Tests for Document Validation System
 */

import { describe, it, expect } from 'vitest';
import {
  validateCPF,
  validateRG,
  detectDocumentType,
  validateDocument,
} from '../documentValidator';

describe('Document Validator', () => {
  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('111.444.777-35')).toBe(true);
      expect(validateCPF('11144477735')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('111.444.777-36')).toBe(false);
      expect(validateCPF('123.456.789-00')).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validateCPF('111.111.111-11')).toBe(false);
      expect(validateCPF('000.000.000-00')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validateCPF('123.456.789')).toBe(false);
      expect(validateCPF('123.456.789-001')).toBe(false);
    });
  });

  describe('validateRG', () => {
    it('should validate correct RG format', () => {
      expect(validateRG('12.345.678-9')).toBe(true);
      expect(validateRG('123456789')).toBe(true);
    });

    it('should reject RG with all same digits', () => {
      expect(validateRG('111.111.111-1')).toBe(false);
    });

    it('should reject RG with wrong length', () => {
      expect(validateRG('12.345.678')).toBe(false);
      expect(validateRG('12.345.678-90')).toBe(false);
    });
  });

  describe('detectDocumentType', () => {
    it('should detect CPF', () => {
      expect(detectDocumentType('111.444.777-35')).toBe('CPF');
      expect(detectDocumentType('11144477735')).toBe('CPF');
    });

    it('should detect RG', () => {
      expect(detectDocumentType('12.345.678-9')).toBe('RG');
      expect(detectDocumentType('123456789')).toBe('RG');
    });

    it('should return UNKNOWN for empty input', () => {
      expect(detectDocumentType('')).toBe('UNKNOWN');
    });
  });

  describe('validateDocument', () => {
    it('should validate CPF and return correct result', () => {
      const result = validateDocument('111.444.777-35');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('CPF');
      expect(result.error).toBeUndefined();
    });

    it('should validate RG and return correct result', () => {
      const result = validateDocument('12.345.678-9');
      expect(result.isValid).toBe(true);
      expect(result.type).toBe('RG');
      expect(result.error).toBeUndefined();
    });

    it('should return error for invalid CPF', () => {
      const result = validateDocument('111.444.777-36');
      expect(result.isValid).toBe(false);
      expect(result.type).toBe('CPF');
      expect(result.error).toBe('CPF inválido');
    });

    it('should return error for empty input', () => {
      const result = validateDocument('');
      expect(result.isValid).toBe(false);
      expect(result.type).toBe('UNKNOWN');
      expect(result.error).toBe('Documento é obrigatório');
    });
  });
});
