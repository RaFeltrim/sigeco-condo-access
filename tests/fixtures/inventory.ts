/**
 * Mock Inventory Fixtures
 * Factory functions for generating test inventory data
 */

export interface InventoryItem {
  id: number;
  nome: string;
  categoria: 'chaves' | 'correspondencia' | 'encomendas' | 'outros';
  quantidade: number;
  unidade?: string;
  localizacao?: string;
  dataEntrada: Date;
  dataRetirada?: Date;
  status: 'disponivel' | 'retirado' | 'pendente';
  responsavel?: string;
  observacoes?: string;
}

/**
 * Base mock inventory items for testing
 */
export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    nome: 'Chave Apto 101',
    categoria: 'chaves',
    quantidade: 2,
    localizacao: 'Armário A - Prateleira 1',
    dataEntrada: new Date('2024-01-10T08:00:00'),
    status: 'disponivel',
    responsavel: 'José Porteiro',
    observacoes: 'Chaves reservas',
  },
  {
    id: 2,
    nome: 'Correspondência Apto 202',
    categoria: 'correspondencia',
    quantidade: 5,
    unidade: 'Apto 202',
    localizacao: 'Caixa de Correspondências',
    dataEntrada: new Date('2024-01-15T10:30:00'),
    dataRetirada: new Date('2024-01-15T18:00:00'),
    status: 'retirado',
    responsavel: 'Ana Santos',
  },
  {
    id: 3,
    nome: 'Encomenda - Mercado Livre',
    categoria: 'encomendas',
    quantidade: 1,
    unidade: 'Apto 303',
    localizacao: 'Depósito de Encomendas',
    dataEntrada: new Date('2024-01-16T14:00:00'),
    status: 'pendente',
    responsavel: 'José Porteiro',
    observacoes: 'Aguardando retirada',
  },
];

/**
 * Factory function to create a mock inventory item with custom properties
 * 
 * @param overrides - Optional properties to override defaults
 * @returns Mock inventory item object
 */
export function createMockInventoryItem(
  overrides?: Partial<InventoryItem>
): InventoryItem {
  return {
    id: Math.floor(Math.random() * 10000),
    nome: 'Item de Teste',
    categoria: 'outros',
    quantidade: 1,
    localizacao: 'Depósito',
    dataEntrada: new Date(),
    status: 'disponivel',
    responsavel: 'Sistema',
    ...overrides,
  };
}

/**
 * Create multiple mock inventory items
 * 
 * @param count - Number of items to create
 * @param categoria - Category for all items (optional)
 * @returns Array of mock inventory items
 */
export function createMockInventoryItems(
  count: number,
  categoria?: InventoryItem['categoria']
): InventoryItem[] {
  const itemNames = {
    chaves: ['Chave Apto', 'Chave Salão', 'Chave Garagem', 'Chave Portão'],
    correspondencia: ['Carta', 'Boleto', 'Revista', 'Catálogo'],
    encomendas: ['Encomenda Mercado Livre', 'Encomenda Amazon', 'Encomenda Correios', 'Encomenda Transportadora'],
    outros: ['Documento', 'Objeto Perdido', 'Material', 'Equipamento'],
  };

  return Array.from({ length: count }, (_, index) => {
    const cat = categoria || (['chaves', 'correspondencia', 'encomendas', 'outros'][index % 4] as InventoryItem['categoria']);
    const names = itemNames[cat];
    const statusOptions: InventoryItem['status'][] = ['disponivel', 'retirado', 'pendente'];

    return createMockInventoryItem({
      id: index + 1,
      nome: `${names[index % names.length]} ${index + 1}`,
      categoria: cat,
      quantidade: Math.floor(Math.random() * 5) + 1,
      unidade: `Apto ${(index % 4 + 1)}0${index % 3 + 1}`,
      localizacao: cat === 'chaves' ? 'Armário A' : cat === 'correspondencia' ? 'Caixa de Correspondências' : 'Depósito',
      status: statusOptions[index % 3],
      responsavel: index % 2 === 0 ? 'José Porteiro' : 'Admin Sistema',
    });
  });
}

/**
 * Get inventory items by category
 */
export function getInventoryByCategory(
  categoria: InventoryItem['categoria']
): InventoryItem[] {
  return mockInventoryItems.filter(item => item.categoria === categoria);
}

/**
 * Get inventory items by status
 */
export function getInventoryByStatus(
  status: InventoryItem['status']
): InventoryItem[] {
  return mockInventoryItems.filter(item => item.status === status);
}

/**
 * Get available inventory items
 */
export function getAvailableInventory(): InventoryItem[] {
  return mockInventoryItems.filter(item => item.status === 'disponivel');
}
