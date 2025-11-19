/**
 * Tests for visitor storage with invalid date handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { saveVisitor, loadVisitors, updateVisitor, clearStorage, StorageError } from '../visitorStorage';
import type { Visitor } from '@/types/visitor';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('visitorStorage - Invalid Date Handling', () => {
  beforeEach(() => {
    clearStorage();
    vi.clearAllMocks();
  });

  it('should save and load a visitor with valid dates', () => {
    const visitor: Visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Ativo',
      entrada: new Date('2024-01-15T14:30:00'),
    };

    saveVisitor(visitor);
    const loaded = loadVisitors();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].nome).toBe('João Silva');
    expect(loaded[0].entrada).toBeInstanceOf(Date);
    expect(loaded[0].entrada.getTime()).toBe(visitor.entrada.getTime());
  });

  it('should save and load a visitor with saida date', () => {
    const visitor: Visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Saiu',
      entrada: new Date('2024-01-15T14:30:00'),
      saida: new Date('2024-01-15T16:45:00'),
    };

    saveVisitor(visitor);
    const loaded = loadVisitors();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].saida).toBeInstanceOf(Date);
    expect(loaded[0].saida?.getTime()).toBe(visitor.saida.getTime());
  });

  it('should throw error when trying to save visitor with invalid entrada date', () => {
    const visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Ativo',
      entrada: new Date('invalid'),
    } as Visitor;

    expect(() => saveVisitor(visitor)).toThrow();
  });

  it('should throw error when trying to save visitor with invalid saida date', () => {
    const visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Saiu',
      entrada: new Date('2024-01-15T14:30:00'),
      saida: new Date('invalid'),
    } as Visitor;

    expect(() => saveVisitor(visitor)).toThrow();
  });

  it('should filter out visitors with invalid dates during load', () => {
    // Manually corrupt the storage with an invalid date
    const corruptedData = [
      {
        id: 1,
        nome: 'Valid Visitor',
        documento: '111.111.111-11',
        destino: 'Apto 101',
        hora: '14:30',
        status: 'Ativo',
        entrada: '2024-01-15T14:30:00.000Z',
      },
      {
        id: 2,
        nome: 'Invalid Visitor',
        documento: '222.222.222-22',
        destino: 'Apto 102',
        hora: '15:00',
        status: 'Ativo',
        entrada: 'invalid-date',
      },
      {
        id: 3,
        nome: 'Another Valid Visitor',
        documento: '333.333.333-33',
        destino: 'Apto 103',
        hora: '15:30',
        status: 'Ativo',
        entrada: '2024-01-15T15:30:00.000Z',
      },
    ];

    localStorage.setItem('sigeco_visitors', JSON.stringify(corruptedData));

    const loaded = loadVisitors();

    // Should only load the 2 valid visitors, filtering out the one with invalid date
    expect(loaded).toHaveLength(2);
    expect(loaded[0].nome).toBe('Valid Visitor');
    expect(loaded[1].nome).toBe('Another Valid Visitor');
  });

  it('should filter out visitors with invalid saida dates during load', () => {
    const corruptedData = [
      {
        id: 1,
        nome: 'Valid Visitor',
        documento: '111.111.111-11',
        destino: 'Apto 101',
        hora: '14:30',
        status: 'Saiu',
        entrada: '2024-01-15T14:30:00.000Z',
        saida: '2024-01-15T16:00:00.000Z',
      },
      {
        id: 2,
        nome: 'Invalid Saida',
        documento: '222.222.222-22',
        destino: 'Apto 102',
        hora: '15:00',
        status: 'Saiu',
        entrada: '2024-01-15T15:00:00.000Z',
        saida: 'invalid-date',
      },
    ];

    localStorage.setItem('sigeco_visitors', JSON.stringify(corruptedData));

    const loaded = loadVisitors();

    // Should only load the visitor with valid dates
    expect(loaded).toHaveLength(1);
    expect(loaded[0].nome).toBe('Valid Visitor');
  });

  it('should handle undefined saida date correctly', () => {
    const visitor: Visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Ativo',
      entrada: new Date('2024-01-15T14:30:00'),
      saida: undefined,
    };

    saveVisitor(visitor);
    const loaded = loadVisitors();

    expect(loaded).toHaveLength(1);
    expect(loaded[0].saida).toBeUndefined();
  });

  it('should update visitor and handle date validation', () => {
    const visitor: Visitor = {
      id: 1,
      nome: 'João Silva',
      documento: '123.456.789-00',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Ativo',
      entrada: new Date('2024-01-15T14:30:00'),
    };

    saveVisitor(visitor);

    // Update with valid saida date
    const saida = new Date('2024-01-15T16:45:00');
    updateVisitor(1, { status: 'Saiu', saida });

    const loaded = loadVisitors();
    expect(loaded[0].status).toBe('Saiu');
    expect(loaded[0].saida).toBeInstanceOf(Date);
    expect(loaded[0].saida?.getTime()).toBe(saida.getTime());
  });

  it('should handle saving multiple visitors when one in storage has invalid date', () => {
    // First, save a valid visitor
    const visitor1: Visitor = {
      id: 1,
      nome: 'Valid Visitor',
      documento: '111.111.111-11',
      destino: 'Apto 101',
      hora: '14:30',
      status: 'Ativo',
      entrada: new Date('2024-01-15T14:30:00'),
    };
    saveVisitor(visitor1);

    // Manually corrupt one visitor in storage
    const stored = localStorage.getItem('sigeco_visitors');
    const parsed = JSON.parse(stored || '[]');
    parsed.push({
      id: 2,
      nome: 'Corrupted',
      documento: '222.222.222-22',
      destino: 'Apto 102',
      hora: '15:00',
      status: 'Ativo',
      entrada: 'invalid-date',
    });
    localStorage.setItem('sigeco_visitors', JSON.stringify(parsed));

    // Try to save another valid visitor
    const visitor3: Visitor = {
      id: 3,
      nome: 'Another Valid',
      documento: '333.333.333-33',
      destino: 'Apto 103',
      hora: '15:30',
      status: 'Ativo',
      entrada: new Date('2024-01-15T15:30:00'),
    };

    // This should succeed - corrupted visitor is filtered out during load
    saveVisitor(visitor3);

    const loaded = loadVisitors();
    // Should have the 2 valid visitors (corrupted one filtered out)
    expect(loaded).toHaveLength(2);
    expect(loaded.find(v => v.id === 1)).toBeDefined();
    expect(loaded.find(v => v.id === 3)).toBeDefined();
    expect(loaded.find(v => v.id === 2)).toBeUndefined();
  });
});
