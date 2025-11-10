/**
 * Mock Visitor Fixtures
 * Factory functions for generating test visitor data
 */

import { Visitor, VisitorFormData } from '@/types/visitor';

/**
 * Base mock visitors for testing
 */
export const mockVisitors: Visitor[] = [
  {
    id: 1,
    nome: 'João Silva',
    documento: '123.456.789-00',
    documentoTipo: 'CPF',
    destino: 'Apto 101',
    motivo: 'Visita social',
    entrada: new Date('2024-01-15T10:00:00'),
    saida: undefined,
    status: 'Ativo',
    hora: '10:00',
    duracao: {
      hours: 2,
      minutes: 30,
      totalMinutes: 150,
    },
  },
  {
    id: 2,
    nome: 'Maria Santos',
    documento: '987.654.321-00',
    documentoTipo: 'CPF',
    destino: 'Apto 202',
    motivo: 'Entrega',
    entrada: new Date('2024-01-15T11:30:00'),
    saida: new Date('2024-01-15T12:00:00'),
    status: 'Saiu',
    hora: '11:30',
    duracao: {
      hours: 0,
      minutes: 30,
      totalMinutes: 30,
    },
  },
  {
    id: 3,
    nome: 'Pedro Oliveira',
    documento: '12.345.678-9',
    documentoTipo: 'RG',
    destino: 'Apto 303',
    motivo: 'Manutenção',
    entrada: new Date('2024-01-15T14:00:00'),
    saida: undefined,
    status: 'Ativo',
    hora: '14:00',
  },
];

/**
 * Factory function to create a mock visitor with custom properties
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock visitor object
 * 
 * @example
 * ```ts
 * const visitor = createMockVisitor({ nome: 'Ana Costa', destino: 'Apto 404' });
 * ```
 */
export function createMockVisitor(overrides?: Partial<Visitor>): Visitor {
  const defaultVisitor: Visitor = {
    id: Math.floor(Math.random() * 10000),
    nome: 'Visitante Teste',
    documento: '000.000.000-00',
    documentoTipo: 'CPF',
    destino: 'Apto 100',
    motivo: 'Visita',
    entrada: new Date(),
    saida: undefined,
    status: 'Ativo',
    hora: new Date().toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
  };

  return {
    ...defaultVisitor,
    ...overrides,
  };
}

/**
 * Create multiple mock visitors
 * 
 * @param count - Number of visitors to create
 * @param status - Status for all visitors (optional)
 * @returns Array of mock visitors
 */
export function createMockVisitors(
  count: number,
  status?: 'Ativo' | 'Saiu'
): Visitor[] {
  const names = [
    'João Silva', 'Maria Santos', 'Pedro Oliveira', 'Ana Costa',
    'Carlos Souza', 'Juliana Lima', 'Roberto Alves', 'Fernanda Rocha',
    'Lucas Martins', 'Beatriz Ferreira', 'Rafael Santos', 'Camila Dias',
  ];

  const destinations = [
    'Apto 101', 'Apto 102', 'Apto 201', 'Apto 202',
    'Apto 301', 'Apto 302', 'Apto 401', 'Apto 402',
  ];

  const motivos = [
    'Visita social', 'Entrega', 'Manutenção', 'Prestação de serviço',
    'Reunião', 'Visita familiar', 'Trabalho', 'Outros',
  ];

  return Array.from({ length: count }, (_, index) => {
    const entrada = new Date();
    entrada.setHours(entrada.getHours() - Math.floor(Math.random() * 8));
    
    const visitorStatus = status || (Math.random() > 0.5 ? 'Ativo' : 'Saiu');
    const saida = visitorStatus === 'Saiu' 
      ? new Date(entrada.getTime() + Math.random() * 4 * 60 * 60 * 1000)
      : undefined;

    return createMockVisitor({
      id: index + 1,
      nome: names[index % names.length],
      documento: `${String(index + 100).padStart(3, '0')}.${String(index + 200).padStart(3, '0')}.${String(index + 300).padStart(3, '0')}-${String(index % 100).padStart(2, '0')}`,
      destino: destinations[index % destinations.length],
      motivo: motivos[index % motivos.length],
      entrada,
      saida,
      status: visitorStatus,
    });
  });
}

/**
 * Create mock visitor form data
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock visitor form data
 */
export function createMockVisitorFormData(
  overrides?: Partial<VisitorFormData>
): VisitorFormData {
  return {
    nome: 'João Silva',
    documento: '123.456.789-00',
    destino: 'Apto 101',
    motivo: 'Visita social',
    ...overrides,
  };
}

/**
 * Get active visitors from mock data
 */
export function getActiveVisitors(): Visitor[] {
  return mockVisitors.filter(v => v.status === 'Ativo');
}

/**
 * Get visitors who have left from mock data
 */
export function getExitedVisitors(): Visitor[] {
  return mockVisitors.filter(v => v.status === 'Saiu');
}
