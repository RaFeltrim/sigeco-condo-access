import { describe, it, expect } from 'vitest';

// Validation utilities
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return false;
  if (/^(\d)\1+$/.test(cleaned)) return false;
  
  // Validate first digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * (10 - i);
  }
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned[9])) return false;
  
  // Validate second digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cleaned[i]) * (11 - i);
  }
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cleaned[10]);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

function isRequired(value: unknown): boolean {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value != null;
}

function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}

describe('isValidEmail', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
  });

  it('should validate email with subdomain', () => {
    expect(isValidEmail('test@mail.example.com')).toBe(true);
  });

  it('should reject email without @', () => {
    expect(isValidEmail('testexample.com')).toBe(false);
  });

  it('should reject email without domain', () => {
    expect(isValidEmail('test@')).toBe(false);
  });

  it('should reject email without TLD', () => {
    expect(isValidEmail('test@example')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidEmail('')).toBe(false);
  });

  it('should reject email with spaces', () => {
    expect(isValidEmail('test @example.com')).toBe(false);
  });
});

describe('isValidCPF', () => {
  it('should validate correct CPF', () => {
    expect(isValidCPF('12345678909')).toBe(true);
  });

  it('should validate formatted CPF', () => {
    expect(isValidCPF('123.456.789-09')).toBe(true);
  });

  it('should reject CPF with invalid length', () => {
    expect(isValidCPF('123')).toBe(false);
  });

  it('should reject CPF with all same digits', () => {
    expect(isValidCPF('11111111111')).toBe(false);
  });

  it('should reject CPF with invalid check digits', () => {
    expect(isValidCPF('12345678900')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidCPF('')).toBe(false);
  });
});

describe('isValidPhone', () => {
  it('should validate 11-digit mobile', () => {
    expect(isValidPhone('11999999999')).toBe(true);
  });

  it('should validate 10-digit landline', () => {
    expect(isValidPhone('1133334444')).toBe(true);
  });

  it('should validate formatted phone', () => {
    expect(isValidPhone('(11) 99999-9999')).toBe(true);
  });

  it('should reject phone with invalid length', () => {
    expect(isValidPhone('123')).toBe(false);
  });

  it('should reject empty string', () => {
    expect(isValidPhone('')).toBe(false);
  });
});

describe('isRequired', () => {
  it('should validate non-empty string', () => {
    expect(isRequired('test')).toBe(true);
  });

  it('should reject empty string', () => {
    expect(isRequired('')).toBe(false);
  });

  it('should reject whitespace-only string', () => {
    expect(isRequired('   ')).toBe(false);
  });

  it('should validate number', () => {
    expect(isRequired(0)).toBe(true);
  });

  it('should reject null', () => {
    expect(isRequired(null)).toBe(false);
  });

  it('should reject undefined', () => {
    expect(isRequired(undefined)).toBe(false);
  });
});

describe('minLength', () => {
  it('should validate string meeting minimum', () => {
    expect(minLength('test', 4)).toBe(true);
  });

  it('should validate string exceeding minimum', () => {
    expect(minLength('testing', 4)).toBe(true);
  });

  it('should reject string below minimum', () => {
    expect(minLength('tes', 4)).toBe(false);
  });

  it('should handle empty string', () => {
    expect(minLength('', 1)).toBe(false);
  });
});

describe('maxLength', () => {
  it('should validate string meeting maximum', () => {
    expect(maxLength('test', 4)).toBe(true);
  });

  it('should validate string below maximum', () => {
    expect(maxLength('tes', 4)).toBe(true);
  });

  it('should reject string exceeding maximum', () => {
    expect(maxLength('testing', 4)).toBe(false);
  });

  it('should handle empty string', () => {
    expect(maxLength('', 10)).toBe(true);
  });
});
