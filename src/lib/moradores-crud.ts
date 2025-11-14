/**
 * Moradores CRUD Business Logic
 * 
 * Pure functions for managing residents (moradores) state.
 * These are extracted from the UI component to enable mutation testing.
 */

// Type definition
export interface Morador {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  unidade: string;
  documento: string;
  tipo: string;
  status: string;
  dataCadastro: string;
}

/**
 * Creates a new morador object with auto-incremented ID
 */
export const createMorador = (
  moradores: Morador[],
  newMoradorData: Omit<Morador, 'id' | 'status' | 'dataCadastro'>
): Morador => {
  return {
    id: Math.max(...moradores.map(m => m.id), 0) + 1,
    nome: newMoradorData.nome,
    email: newMoradorData.email,
    telefone: newMoradorData.telefone,
    unidade: newMoradorData.unidade,
    documento: newMoradorData.documento,
    tipo: newMoradorData.tipo === 'proprietario' ? 'Proprietário' : 
          newMoradorData.tipo === 'locatario' ? 'Locatário' : 
          newMoradorData.tipo === 'familiar' ? 'Familiar' : newMoradorData.tipo,
    status: "Ativo",
    dataCadastro: new Date().toLocaleDateString('pt-BR')
  };
};

/**
 * Adds a new morador to the array (immutable)
 */
export const addMorador = (
  moradores: Morador[],
  newMorador: Morador
): Morador[] => {
  return [...moradores, newMorador];
};

/**
 * Updates an existing morador by ID (immutable)
 */
export const updateMorador = (
  moradores: Morador[],
  updatedMorador: Morador
): Morador[] => {
  return moradores.map(m => m.id === updatedMorador.id ? updatedMorador : m);
};

/**
 * Deletes a morador by ID (immutable)
 */
export const deleteMorador = (
  moradores: Morador[],
  moradorId: number
): Morador[] => {
  return moradores.filter(m => m.id !== moradorId);
};

/**
 * Calculates total number of moradores
 */
export const calculateTotalMoradores = (moradores: Morador[]): number => {
  return moradores.length;
};

/**
 * Calculates number of active moradores
 */
export const calculateMoradoresAtivos = (moradores: Morador[]): number => {
  return moradores.filter(m => m.status === "Ativo").length;
};

/**
 * Calculates number of moradores registered this month
 */
export const calculateCadastrosEsteMes = (moradores: Morador[]): number => {
  return moradores.filter(m => {
    const [dia, mes, ano] = m.dataCadastro.split('/');
    const cadastroDate = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    const hoje = new Date();
    return cadastroDate.getMonth() === hoje.getMonth() && 
           cadastroDate.getFullYear() === hoje.getFullYear();
  }).length;
};
