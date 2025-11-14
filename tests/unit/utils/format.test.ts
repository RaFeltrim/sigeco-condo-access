import { describe, it, expect } from 'vitest';

/**
 * Format utilities for testing
 */

// CPF formatting
function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

// Phone formatting
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

// CEP formatting
function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, '');
  if (cleaned.length !== 8) return cep;
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
}

// Currency formatting
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

// Date formatting
function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR');
}

describe('formatCPF', () => {
  it('should format valid CPF', () => {
    expect(formatCPF('12345678900')).toBe('123.456.789-00');
  });

  it('should handle already formatted CPF', () => {
    expect(formatCPF('123.456.789-00')).toBe('123.456.789-00');
  });

  it('should return original if invalid length', () => {
    expect(formatCPF('123')).toBe('123');
  });

  it('should handle empty string', () => {
    expect(formatCPF('')).toBe('');
  });

  it('should remove non-digit characters before formatting', () => {
    expect(formatCPF('123-456-789-00')).toBe('123.456.789-00');
  });
});

describe('formatPhone', () => {
  it('should format 11-digit mobile phone', () => {
    expect(formatPhone('11999999999')).toBe('(11) 99999-9999');
  });

  it('should format 10-digit landline', () => {
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444');
  });

  it('should return original if invalid length', () => {
    expect(formatPhone('123')).toBe('123');
  });

  it('should handle already formatted phone', () => {
    expect(formatPhone('(11) 99999-9999')).toBe('(11) 99999-9999');
  });

  it('should handle empty string', () => {
    expect(formatPhone('')).toBe('');
  });
});

describe('formatCEP', () => {
  it('should format valid CEP', () => {
    expect(formatCEP('12345678')).toBe('12345-678');
  });

  it('should handle already formatted CEP', () => {
    expect(formatCEP('12345-678')).toBe('12345-678');
  });

  it('should return original if invalid length', () => {
    expect(formatCEP('123')).toBe('123');
  });

  it('should handle empty string', () => {
    expect(formatCEP('')).toBe('');
  });
});

describe('formatCurrency', () => {
  it('should format positive values', () => {
    const result = formatCurrency(1000);
    expect(result).toMatch(/R\$\s*1\.000,00/);
  });

  it('should format negative values', () => {
    const result = formatCurrency(-500);
    expect(result).toMatch(/-R\$\s*500,00/);
  });

  it('should format zero', () => {
    const result = formatCurrency(0);
    expect(result).toMatch(/R\$\s*0,00/);
  });

  it('should handle decimal values', () => {
    const result = formatCurrency(99.99);
    expect(result).toMatch(/R\$\s*99,99/);
  });
});

describe('formatDate', () => {
  it('should format Date object', () => {
    const date = new Date(2024, 0, 15); // Jan 15, 2024 (month is 0-indexed)
    expect(formatDate(date)).toMatch(/15\/01\/2024/);
  });

  it('should format date string', () => {
    const result = formatDate('2024-01-15');
    // Date string parsing can vary by timezone, just check format
    expect(result).toMatch(/\d{2}\/\d{2}\/2024/);
  });

  it('should handle current date', () => {
    const result = formatDate(new Date());
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
