import { describe, it, expect } from 'vitest';

function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

function isValidCEP(cep: string): boolean {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
}

describe('CEP Utilities', () => {
  it('formats valid CEP', () => {
    expect(formatCEP('12345678')).toBe('12345-678');
  });

  it('keeps formatted CEP', () => {
    expect(formatCEP('12345-678')).toBe('12345-678');
  });

  it('validates correct CEP', () => {
    expect(isValidCEP('12345678')).toBe(true);
  });

  it('validates formatted CEP', () => {
    expect(isValidCEP('12345-678')).toBe(true);
  });

  it('rejects short CEP', () => {
    expect(isValidCEP('123')).toBe(false);
  });

  it('handles empty CEP', () => {
    expect(formatCEP('')).toBe('');
  });
});
