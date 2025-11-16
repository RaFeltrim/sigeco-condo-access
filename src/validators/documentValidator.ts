/**
 * Document Validation System
 * Validates CPF and RG documents with official algorithms
 */

import type { DocumentValidation } from '@/types/visitor';
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

export type { DocumentValidation };

/**
 * Remove all non-numeric characters from a string
 */
function cleanDocument(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Validate CPF using official Brazilian algorithm
 * CPF format: 000.000.000-00 (11 digits)
 */
export function validateCPF(cpf: string): boolean {
  const cleaned = cleanDocument(cpf);
  
  // Must have exactly 11 digits
  if (cleaned.length !== 11) {
    return false;
  }
  
  // Reject known invalid CPFs (all same digits)
  if (/^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }
  
  // Calculate first verification digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned.charAt(i)) * (10 - i);
  }
  let firstDigit = 11 - (sum % 11);
  if (firstDigit >= 10) firstDigit = 0;
  
  // Check first digit
  if (firstDigit !== parseInt(cleaned.charAt(9))) {
    return false;
  }
  
  // Calculate second verification digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned.charAt(i)) * (11 - i);
  }
  let secondDigit = 11 - (sum % 11);
  if (secondDigit >= 10) secondDigit = 0;
  
  // Check second digit
  return secondDigit === parseInt(cleaned.charAt(10));
}

/**
 * Validate RG with basic format check
 * RG format: 00.000.000-0 (9 digits)
 * Note: RG validation varies by state, this is a basic format check
 */
export function validateRG(rg: string): boolean {
  const cleaned = cleanDocument(rg);
  
  // Must have exactly 9 digits
  if (cleaned.length !== 9) {
    return false;
  }
  
  // Reject all same digits
  if (/^(\d)\1{8}$/.test(cleaned)) {
    return false;
  }
  
  return true;
}

/**
 * Automatically detect document type based on input
 * Returns UNKNOWN for incomplete or invalid formats
 */
export function detectDocumentType(value: string): 'CPF' | 'RG' | 'UNKNOWN' {
  const cleaned = cleanDocument(value);
  
  if (cleaned.length === 0) {
    return 'UNKNOWN';
  }
  
  // RG: exactly 9 digits
  if (cleaned.length === 9) {
    return 'RG';
  }
  
  // CPF: exactly 11 digits
  if (cleaned.length === 11) {
    return 'CPF';
  }
  
  // During typing, detect based on length (for real-time formatting)
  // But only if it's a reasonable partial input
  if (cleaned.length >= 7 && cleaned.length < 9) {
    return 'RG'; // Likely typing RG
  }
  
  if (cleaned.length === 10 || (cleaned.length > 9 && cleaned.length < 11)) {
    return 'CPF'; // Likely typing CPF
  }
  
  if (cleaned.length > 11) {
    return 'CPF'; // Assume CPF with extra digits
  }
  
  // Too short to determine (< 7 digits)
  return 'UNKNOWN';
}

/**
 * Main validation function that validates and returns complete result
 */
export function validateDocument(value: string): DocumentValidation {
  const cleaned = cleanDocument(value);
  const type = detectDocumentType(value);
  
  if (cleaned.length === 0) {
    return {
      isValid: false,
      type: 'UNKNOWN',
      formatted: '',
      error: ERROR_MESSAGES.documento.required,
    };
  }
  
  if (type === 'CPF') {
    const isValid = validateCPF(cleaned);
    return {
      isValid,
      type: 'CPF',
      formatted: value,
      error: isValid ? undefined : ERROR_MESSAGES.documento.invalidCPF,
    };
  }
  
  if (type === 'RG') {
    const isValid = validateRG(cleaned);
    return {
      isValid,
      type: 'RG',
      formatted: value,
      error: isValid ? undefined : ERROR_MESSAGES.documento.invalidRG,
    };
  }
  
  return {
    isValid: false,
    type: 'UNKNOWN',
    formatted: value,
    error: ERROR_MESSAGES.documento.invalidFormat,
  };
}
