/**
 * Unit Tests: Agendamentos CRUD Logic
 */

import { describe, it, expect } from 'vitest';
import {
  type Agendamento,
  createAgendamento,
  addAgendamento,
  updateAgendamentoStatus,
  deleteAgendamento,
  checkConflict,
  getAgendamentosHoje,
  getProximosAgendamentos,
  countByStatus,
  getAgendamentosEstaSemana
} from '@/lib/agendamentos-crud';

describe('Agendamentos CRUD Logic', () => {
  const mockAgendamentos: Agendamento[] = [
    {
      id: 1,
      visitante: "Dr. Carlos Mendes",
      documento: "123.456.789-00",
      destino: "Apto 205",
      motivo: "Consulta médica domiciliar",
      data: "2024-09-18",
      horario: "14:00",
      telefone: "(11) 99999-1234",
      status: "Confirmado",
      morador: "Maria Santos"
    },
    {
      id: 2,
      visitante: "Ana Limpeza",
      documento: "987.654.321-00",
      destino: "Apto 101",
      motivo: "Serviço de limpeza",
      data: "2024-09-18",
      horario: "09:00",
      telefone: "(11) 98888-5678",
      status: "Pendente",
      morador: "João Silva"
    }
  ];

  describe('createAgendamento', () => {
    it('should create agendamento with auto-incremented ID', () => {
      const result = createAgendamento(mockAgendamentos, {
        visitante: "Test User",
        documento: "111.222.333-44",
        destino: "Apto 303",
        motivo: "Test",
        data: "2024-09-20",
        horario: "10:00",
        telefone: "(11) 98765-4321"
      });

      expect(result.id).toBe(3);
      expect(result.visitante).toBe("Test User");
      expect(result.status).toBe("Pendente");
    });

    it('should start ID at 1 for empty array', () => {
      const result = createAgendamento([], {
        visitante: "First",
        documento: "111",
        destino: "Apto 101",
        motivo: "Test",
        data: "2024-09-20",
        horario: "10:00",
        telefone: "(11) 11111-1111"
      });

      expect(result.id).toBe(1);
    });
  });

  describe('addAgendamento', () => {
    it('should add agendamento without mutation', () => {
      const newAg: Agendamento = {
        id: 3,
        visitante: "New",
        documento: "111",
        destino: "Apto 103",
        motivo: "Test",
        data: "2024-09-20",
        horario: "10:00",
        telefone: "(11) 11111-1111",
        status: "Pendente"
      };

      const result = addAgendamento(mockAgendamentos, newAg);

      expect(result).toHaveLength(3);
      expect(result[2]).toEqual(newAg);
      expect(mockAgendamentos).toHaveLength(2);
    });
  });

  describe('updateAgendamentoStatus', () => {
    it('should update status by ID', () => {
      const result = updateAgendamentoStatus(mockAgendamentos, 1, "Cancelado");

      expect(result[0].status).toBe("Cancelado");
      expect(result[0].visitante).toBe("Dr. Carlos Mendes");
      expect(result[1].status).toBe("Pendente");
    });

    it('should not mutate original array', () => {
      const result = updateAgendamentoStatus(mockAgendamentos, 1, "Cancelado");

      expect(result).not.toBe(mockAgendamentos);
      expect(mockAgendamentos[0].status).toBe("Confirmado");
    });

    it('should return unchanged if ID not found', () => {
      const result = updateAgendamentoStatus(mockAgendamentos, 999, "Cancelado");

      expect(result).toEqual(mockAgendamentos);
    });
  });

  describe('deleteAgendamento', () => {
    it('should delete by ID', () => {
      const result = deleteAgendamento(mockAgendamentos, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('should not mutate original', () => {
      deleteAgendamento(mockAgendamentos, 1);
      expect(mockAgendamentos).toHaveLength(2);
    });
  });

  describe('checkConflict', () => {
    it('should detect time conflict for same destino', () => {
      const hasConflict = checkConflict(
        mockAgendamentos,
        "2024-09-18",
        "14:30", // 30 min after 14:00
        "Apto 205"
      );

      expect(hasConflict).toBe(true);
    });

    it('should not conflict if > 1 hour apart', () => {
      const hasConflict = checkConflict(
        mockAgendamentos,
        "2024-09-18",
        "16:00", // 2 hours after 14:00
        "Apto 205"
      );

      expect(hasConflict).toBe(false);
    });

    it('should not conflict for different destino', () => {
      const hasConflict = checkConflict(
        mockAgendamentos,
        "2024-09-18",
        "14:00",
        "Apto 999"
      );

      expect(hasConflict).toBe(false);
    });

    it('should exclude specific ID from conflict check', () => {
      const hasConflict = checkConflict(
        mockAgendamentos,
        "2024-09-18",
        "14:00",
        "Apto 205",
        1 // Exclude the conflicting appointment itself
      );

      expect(hasConflict).toBe(false);
    });
  });

  describe('getAgendamentosHoje', () => {
    it('should return appointments for today', () => {
      const today = new Date().toISOString().split('T')[0];
      const todayAgendamentos = [
        { ...mockAgendamentos[0], data: today },
        { ...mockAgendamentos[1], data: "2024-09-20" }
      ];

      const result = getAgendamentosHoje(todayAgendamentos);

      expect(result).toHaveLength(1);
      expect(result[0].data).toBe(today);
    });

    it('should return empty for no appointments today', () => {
      const result = getAgendamentosHoje(mockAgendamentos);
      // Mock data is from 2024-09-18, not today
      expect(result).toHaveLength(0);
    });
  });

  describe('getProximosAgendamentos', () => {
    it('should return future non-cancelled appointments sorted', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);

      const futureAgendamentos = [
        { ...mockAgendamentos[0], data: dayAfter.toISOString().split('T')[0], status: "Confirmado" as const },
        { ...mockAgendamentos[1], data: tomorrow.toISOString().split('T')[0], status: "Pendente" as const }
      ];

      const result = getProximosAgendamentos(futureAgendamentos);

      expect(result).toHaveLength(2);
      expect(new Date(result[0].data) < new Date(result[1].data)).toBe(true);
    });

    it('should exclude cancelled appointments', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const agendamentos = [
        { ...mockAgendamentos[0], data: tomorrow.toISOString().split('T')[0], status: "Cancelado" as const }
      ];

      const result = getProximosAgendamentos(agendamentos);
      expect(result).toHaveLength(0);
    });
  });

  describe('countByStatus', () => {
    it('should count confirmed appointments', () => {
      const count = countByStatus(mockAgendamentos, "Confirmado");
      expect(count).toBe(1);
    });

    it('should count pending appointments', () => {
      const count = countByStatus(mockAgendamentos, "Pendente");
      expect(count).toBe(1);
    });

    it('should return 0 for no matches', () => {
      const count = countByStatus(mockAgendamentos, "Cancelado");
      expect(count).toBe(0);
    });
  });

  describe('getAgendamentosEstaSemana', () => {
    it('should return appointments within next 7 days', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 8);

      const agendamentos = [
        { ...mockAgendamentos[0], data: tomorrow.toISOString().split('T')[0] },
        { ...mockAgendamentos[1], data: nextWeek.toISOString().split('T')[0] }
      ];

      const result = getAgendamentosEstaSemana(agendamentos);
      expect(result).toHaveLength(1);
    });
  });
});
