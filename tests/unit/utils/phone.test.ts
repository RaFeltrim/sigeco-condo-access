import { describe, it, expect } from 'vitest';

function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || cleaned.length === 11;
}

describe('Phone Formatting', () => {
  it('formats mobile phone', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('formats landline', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('keeps already formatted', () => {
    expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
  });

  it('handles invalid length', () => {
    expect(formatPhone('123')).toBe('123');
  });

  it('validates mobile', () => {
    expect(isValidPhone('11999999999')).toBe(true);
  });

  it('validates landline', () => {
    expect(isValidPhone('1133334444')).toBe(true);
  });

  it('rejects short phone', () => {
    expect(isValidPhone('123')).toBe(false);
  });

  it('accepts formatted phone', () => {
    expect(isValidPhone('(11) 99999-9999')).toBe(true);
  });
});
