import { describe, it, expect } from 'vitest';

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;
  
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
  let digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  if (digit !== parseInt(cleaned[9])) return false;
  
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
  digit = 11 - (sum % 11);
  if (digit >= 10) digit = 0;
  return digit === parseInt(cleaned[10]);
}

describe('CPF Validation', () => {
  it('validates correct CPF', () => {
    expect(validateCPF('12345678909')).toBe(true);
  });

  it('rejects invalid CPF', () => {
    expect(validateCPF('12345678900')).toBe(false);
  });

  it('rejects all same digits', () => {
    expect(validateCPF('11111111111')).toBe(false);
  });

  it('handles formatted CPF', () => {
    expect(validateCPF('123.456.789-09')).toBe(true);
  });

  it('rejects short CPF', () => {
    expect(validateCPF('123')).toBe(false);
  });

  it('rejects empty CPF', () => {
    expect(validateCPF('')).toBe(false);
  });

  it('rejects CPF with letters', () => {
    expect(validateCPF('abc')).toBe(false);
  });

  it('validates multiple valid CPFs', () => {
    expect(validateCPF('11144477735')).toBe(true);
  });
});
