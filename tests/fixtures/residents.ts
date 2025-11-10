/**
 * Mock Resident Fixtures
 * Factory functions for generating test resident data
 */

export interface Resident {
  id: number;
  nome: string;
  documento: string;
  unidade: string;
  telefone?: string;
  email?: string;
  tipo: 'proprietario' | 'inquilino';
  dataEntrada: Date;
  ativo: boolean;
}

/**
 * Base mock residents for testing
 */
export const mockResidents: Resident[] = [
  {
    id: 1,
    nome: 'Carlos Alberto Silva',
    documento: '111.222.333-44',
    unidade: 'Apto 101',
    telefone: '(11) 98765-4321',
    email: 'carlos.silva@email.com',
    tipo: 'proprietario',
    dataEntrada: new Date('2020-01-15'),
    ativo: true,
  },
  {
    id: 2,
    nome: 'Ana Paula Santos',
    documento: '222.333.444-55',
    unidade: 'Apto 202',
    telefone: '(11) 97654-3210',
    email: 'ana.santos@email.com',
    tipo: 'proprietario',
    dataEntrada: new Date('2019-06-20'),
    ativo: true,
  },
  {
    id: 3,
    nome: 'Roberto Oliveira',
    documento: '333.444.555-66',
    unidade: 'Apto 303',
    telefone: '(11) 96543-2109',
    email: 'roberto.oliveira@email.com',
    tipo: 'inquilino',
    dataEntrada: new Date('2023-03-10'),
    ativo: true,
  },
];

/**
 * Factory function to create a mock resident with custom properties
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock resident object
 */
export function createMockResident(overrides?: Partial<Resident>): Resident {
  return {
    id: Math.floor(Math.random() * 10000),
    nome: 'Morador Teste',
    documento: '000.000.000-00',
    unidade: 'Apto 100',
    telefone: '(11) 90000-0000',
    email: 'morador@email.com',
    tipo: 'proprietario',
    dataEntrada: new Date(),
    ativo: true,
    ...overrides,
  };
}

/**
 * Create multiple mock residents
 * 
 * @param count - Number of residents to create
 * @returns Array of mock residents
 */
export function createMockResidents(count: number): Resident[] {
  const names = [
    'Carlos Silva', 'Ana Santos', 'Roberto Oliveira', 'Mariana Costa',
    'Fernando Souza', 'Juliana Lima', 'Paulo Alves', 'Beatriz Rocha',
  ];

  return Array.from({ length: count }, (_, index) =>
    createMockResident({
      id: index + 1,
      nome: names[index % names.length],
      documento: `${String(index + 111).padStart(3, '0')}.${String(index + 222).padStart(3, '0')}.${String(index + 333).padStart(3, '0')}-${String(index % 100).padStart(2, '0')}`,
      unidade: `Apto ${(index % 4 + 1)}0${index % 3 + 1}`,
      telefone: `(11) 9${String(8000 + index).padStart(4, '0')}-${String(index).padStart(4, '0')}`,
      email: `morador${index + 1}@email.com`,
      tipo: index % 2 === 0 ? 'proprietario' : 'inquilino',
    })
  );
}
