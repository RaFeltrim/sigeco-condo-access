/**
 * Name Validation Module
 * Validates and formats visitor names according to business rules
 */

import type { NameValidation } from '@/types/visitor';
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

export type { NameValidation };

/**
 * Validates if a name contains only letters, spaces, and accented characters
 * Accepts: a-z, A-Z, spaces, á é í ó ú ã õ ç and other Portuguese accents
 * Rejects: numbers, special symbols
 */
export function validateName(name: string): NameValidation {
  // Trim the input
  const trimmed = name.trim();

  // Check minimum length
  if (trimmed.length < 3) {
    return {
      isValid: false,
      formatted: trimmed,
      error: ERROR_MESSAGES.nome.minLength,
    };
  }

  // Check maximum length
  if (trimmed.length > 100) {
    return {
      isValid: false,
      formatted: trimmed,
      error: ERROR_MESSAGES.nome.maxLength,
    };
  }

  // Check if contains only valid characters (letters, spaces, accents)
  // This regex allows: letters (a-z, A-Z), spaces, and common Portuguese accented characters
  const validCharsRegex = /^[a-zA-ZÀ-ÿ\s]+$/;
  
  if (!validCharsRegex.test(trimmed)) {
    return {
      isValid: false,
      formatted: trimmed,
      error: ERROR_MESSAGES.nome.invalidChars,
    };
  }

  // Normalize and capitalize the name
  const normalized = normalizeName(trimmed);
  const capitalized = capitalizeName(normalized);

  return {
    isValid: true,
    formatted: capitalized,
  };
}

/**
 * Capitalizes the first letter of each word in a name
 * Example: "joão silva" -> "João Silva"
 */
export function capitalizeName(name: string): string {
  return name
    .split(' ')
    .map(word => {
      if (word.length === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Removes extra spaces from a name
 * - Trims leading and trailing spaces
 * - Replaces multiple consecutive spaces with a single space
 */
export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

/**
 * Filters input to allow only valid name characters
 * Used for real-time input filtering
 */
export function filterNameInput(input: string): string {
  // Remove any character that is not a letter, space, or accented character
  return input.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
}
