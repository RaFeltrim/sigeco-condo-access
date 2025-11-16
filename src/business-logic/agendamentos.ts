/**
 * Agendamentos (Appointments) CRUD Business Logic
 * 
 * Pure functions for managing appointment state.
 */

export interface Agendamento {
  id: number;
  visitante: string;
  documento: string;
  destino: string;
  motivo: string;
  data: string;
  horario: string;
  telefone: string;
  status: "Confirmado" | "Pendente" | "Cancelado";
  morador?: string;
  observacoes?: string;
}

/**
 * Creates a new agendamento with auto-incremented ID
 */
export const createAgendamento = (
  agendamentos: Agendamento[],
  newAgendamentoData: Omit<Agendamento, 'id' | 'status'>
): Agendamento => {
  return {
    id: Math.max(...agendamentos.map(a => a.id), 0) + 1,
    ...newAgendamentoData,
    status: "Pendente"
  };
};

/**
 * Adds a new agendamento (immutable)
 */
export const addAgendamento = (
  agendamentos: Agendamento[],
  newAgendamento: Agendamento
): Agendamento[] => {
  return [...agendamentos, newAgendamento];
};

/**
 * Updates an agendamento status (immutable)
 */
export const updateAgendamentoStatus = (
  agendamentos: Agendamento[],
  id: number,
  newStatus: "Confirmado" | "Pendente" | "Cancelado"
): Agendamento[] => {
  return agendamentos.map(a => 
    a.id === id ? { ...a, status: newStatus } : a
  );
};

/**
 * Deletes an agendamento (immutable)
 */
export const deleteAgendamento = (
  agendamentos: Agendamento[],
  id: number
): Agendamento[] => {
  return agendamentos.filter(a => a.id !== id);
};

/**
 * Checks for scheduling conflicts
 */
export const checkConflict = (
  agendamentos: Agendamento[],
  data: string,
  horario: string,
  destino: string,
  excludeId?: number
): boolean => {
  return agendamentos.some(ag => {
    if (ag.id === excludeId) return false;
    if (ag.status === "Cancelado") return false;
    
    const agDateTime = new Date(`${ag.data}T${ag.horario}`);
    const newDateTime = new Date(`${data}T${horario}`);
    
    if (ag.destino === destino) {
      const timeDiff = Math.abs(agDateTime.getTime() - newDateTime.getTime());
      const hoursDiff = timeDiff / (1000 * 60 * 60);
      return hoursDiff < 1;
    }
    
    return false;
  });
};

/**
 * Gets appointments for today
 */
export const getAgendamentosHoje = (agendamentos: Agendamento[]): Agendamento[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return agendamentos.filter(a => {
    const agDate = new Date(a.data);
    agDate.setHours(0, 0, 0, 0);
    return agDate.getTime() === today.getTime();
  });
};

/**
 * Gets upcoming appointments (not today, not cancelled)
 */
export const getProximosAgendamentos = (agendamentos: Agendamento[]): Agendamento[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return agendamentos
    .filter(a => {
      const agDate = new Date(a.data);
      return agDate > today && a.status !== "Cancelado";
    })
    .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
};

/**
 * Count appointments by status
 */
export const countByStatus = (
  agendamentos: Agendamento[],
  status: "Confirmado" | "Pendente" | "Cancelado"
): number => {
  return agendamentos.filter(a => a.status === status).length;
};

/**
 * Get appointments this week
 */
export const getAgendamentosEstaSemana = (agendamentos: Agendamento[]): Agendamento[] => {
  const today = new Date();
  const weekFromNow = new Date();
  weekFromNow.setDate(today.getDate() + 7);
  
  return agendamentos.filter(a => {
    const agDate = new Date(a.data);
    return agDate >= today && agDate <= weekFromNow;
  });
};
