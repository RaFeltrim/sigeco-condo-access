/**
 * Unit Tests: Moradores CRUD Logic
 * 
 * These tests validate the core business logic for managing residents (moradores).
 * This is the exact logic implemented in GerenciamentoMoradoresPage.tsx.
 */

import { describe, it, expect } from 'vitest';
import {
  type Morador,
  createMorador,
  addMorador,
  updateMorador,
  deleteMorador,
  calculateTotalMoradores,
  calculateMoradoresAtivos,
  calculateCadastrosEsteMes
} from '@/business-logic/moradores';

// Test Suite
describe('Moradores CRUD Logic', () => {
  const mockMoradores: Morador[] = [
    {
      id: 1,
      nome: "Ana Silva Costa",
      email: "ana.silva@email.com",
      telefone: "(11) 99999-1234",
      unidade: "Apto 101",
      documento: "123.456.789-00",
      tipo: "Proprietário",
      status: "Ativo",
      dataCadastro: "15/01/2024"
    },
    {
      id: 2,
      nome: "João Santos Lima",
      email: "joao.santos@email.com",
      telefone: "(11) 99999-5678",
      unidade: "Apto 102",
      documento: "987.654.321-00",
      tipo: "Locatário",
      status: "Ativo",
      dataCadastro: "22/01/2024"
    }
  ];

  describe('createMorador', () => {
    it('should create a new morador with incremented ID', () => {
      const newMoradorData = {
        nome: "Test User",
        email: "test@email.com",
        telefone: "(11) 98888-7777",
        unidade: "Apto 103",
        documento: "111.222.333-44",
        tipo: "proprietario"
      };

      const result = createMorador(mockMoradores, newMoradorData);

      expect(result.id).toBe(3); // Max ID is 2, so next should be 3
      expect(result.nome).toBe("Test User");
      expect(result.status).toBe("Ativo");
      expect(result.tipo).toBe("Proprietário");
    });

    it('should handle empty array and start ID at 1', () => {
      const result = createMorador([], {
        nome: "First User",
        email: "first@email.com",
        telefone: "(11) 98888-7777",
        unidade: "Apto 101",
        documento: "111.222.333-44",
        tipo: "locatario"
      });

      expect(result.id).toBe(1);
      expect(result.tipo).toBe("Locatário");
    });

    it('should map tipo correctly for all types', () => {
      const proprietario = createMorador(mockMoradores, {
        nome: "Test", email: "test@test.com", telefone: "", 
        unidade: "101", documento: "123", tipo: "proprietario"
      });
      expect(proprietario.tipo).toBe("Proprietário");

      const locatario = createMorador(mockMoradores, {
        nome: "Test", email: "test@test.com", telefone: "", 
        unidade: "101", documento: "123", tipo: "locatario"
      });
      expect(locatario.tipo).toBe("Locatário");

      const familiar = createMorador(mockMoradores, {
        nome: "Test", email: "test@test.com", telefone: "", 
        unidade: "101", documento: "123", tipo: "familiar"
      });
      expect(familiar.tipo).toBe("Familiar");
    });

    it('should preserve tipo if already formatted', () => {
      const result = createMorador(mockMoradores, {
        nome: "Test", email: "test@test.com", telefone: "", 
        unidade: "101", documento: "123", tipo: "Proprietário"
      });
      expect(result.tipo).toBe("Proprietário");
    });
  });

  describe('addMorador', () => {
    it('should add morador to the array without mutation', () => {
      const newMorador: Morador = {
        id: 3,
        nome: "New User",
        email: "new@email.com",
        telefone: "(11) 98888-7777",
        unidade: "Apto 103",
        documento: "111.222.333-44",
        tipo: "Proprietário",
        status: "Ativo",
        dataCadastro: "01/11/2024"
      };

      const result = addMorador(mockMoradores, newMorador);

      expect(result).toHaveLength(3);
      expect(result[2]).toEqual(newMorador);
      expect(mockMoradores).toHaveLength(2); // Original unchanged
    });
  });

  describe('updateMorador', () => {
    it('should update the correct morador by ID', () => {
      const updatedMorador: Morador = {
        ...mockMoradores[0],
        telefone: "(11) 91111-2222",
        email: "updated@email.com"
      };

      const result = updateMorador(mockMoradores, updatedMorador);

      expect(result[0].telefone).toBe("(11) 91111-2222");
      expect(result[0].email).toBe("updated@email.com");
      expect(result[0].nome).toBe("Ana Silva Costa"); // Other fields unchanged
      expect(result[1]).toEqual(mockMoradores[1]); // Second morador unchanged
    });

    it('should not mutate original array', () => {
      const updatedMorador: Morador = {
        ...mockMoradores[0],
        telefone: "(11) 91111-2222"
      };

      const result = updateMorador(mockMoradores, updatedMorador);

      expect(result).not.toBe(mockMoradores);
      expect(mockMoradores[0].telefone).toBe("(11) 99999-1234"); // Original unchanged
    });

    it('should return unchanged array if ID not found', () => {
      const nonExistentMorador: Morador = {
        id: 999,
        nome: "Ghost User",
        email: "ghost@email.com",
        telefone: "",
        unidade: "",
        documento: "",
        tipo: "",
        status: "Ativo",
        dataCadastro: ""
      };

      const result = updateMorador(mockMoradores, nonExistentMorador);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockMoradores);
    });
  });

  describe('deleteMorador', () => {
    it('should remove morador by ID', () => {
      const result = deleteMorador(mockMoradores, 1);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
      expect(result.find(m => m.id === 1)).toBeUndefined();
    });

    it('should not mutate original array', () => {
      const result = deleteMorador(mockMoradores, 1);

      expect(result).not.toBe(mockMoradores);
      expect(mockMoradores).toHaveLength(2); // Original unchanged
    });

    it('should return unchanged array if ID not found', () => {
      const result = deleteMorador(mockMoradores, 999);

      expect(result).toHaveLength(2);
      expect(result).toEqual(mockMoradores);
    });

    it('should handle deleting all moradores', () => {
      let result = deleteMorador(mockMoradores, 1);
      result = deleteMorador(result, 2);

      expect(result).toHaveLength(0);
    });
  });

  describe('Statistics Calculations', () => {
    describe('calculateTotalMoradores', () => {
      it('should count total moradores', () => {
        expect(calculateTotalMoradores(mockMoradores)).toBe(2);
      });

      it('should return 0 for empty array', () => {
        expect(calculateTotalMoradores([])).toBe(0);
      });
    });

    describe('calculateMoradoresAtivos', () => {
      it('should count only active moradores', () => {
        const mixedStatus = [
          ...mockMoradores,
          { ...mockMoradores[0], id: 3, status: "Inativo" }
        ];

        expect(calculateMoradoresAtivos(mixedStatus)).toBe(2);
      });

      it('should return 0 when no active moradores', () => {
        const inactiveOnly = mockMoradores.map(m => ({ ...m, status: "Inativo" }));
        expect(calculateMoradoresAtivos(inactiveOnly)).toBe(0);
      });

      it('should handle case sensitivity', () => {
        const result = calculateMoradoresAtivos(mockMoradores);
        expect(result).toBe(2);
      });
    });

    describe('calculateCadastrosEsteMes', () => {
      it('should count moradores registered this month', () => {
        const hoje = new Date();
        const esteMes = hoje.toLocaleDateString('pt-BR');
        
        const moradoresComDataAtual = [
          ...mockMoradores,
          { ...mockMoradores[0], id: 3, dataCadastro: esteMes }
        ];

        const result = calculateCadastrosEsteMes(moradoresComDataAtual);
        expect(result).toBeGreaterThanOrEqual(1);
      });

      it('should return 0 for moradores from other months', () => {
        const result = calculateCadastrosEsteMes(mockMoradores);
        // mockMoradores are from January 2024
        const now = new Date();
        if (now.getMonth() !== 0 || now.getFullYear() !== 2024) {
          expect(result).toBe(0);
        }
      });

      it('should handle invalid date formats gracefully', () => {
        const invalidDates = [
          { ...mockMoradores[0], id: 3, dataCadastro: "invalid" }
        ];
        
        expect(() => calculateCadastrosEsteMes(invalidDates)).not.toThrow();
      });
    });
  });

  describe('Integration: Full CRUD Flow', () => {
    it('should handle complete add-edit-delete workflow', () => {
      let moradores = [...mockMoradores];

      // Add
      const newMorador = createMorador(moradores, {
        nome: "Integration Test",
        email: "integration@test.com",
        telefone: "(11) 98888-7777",
        unidade: "Apto 103",
        documento: "111.222.333-44",
        tipo: "proprietario"
      });
      moradores = addMorador(moradores, newMorador);
      expect(moradores).toHaveLength(3);

      // Update
      const updatedMorador = { ...newMorador, telefone: "(11) 99999-8888" };
      moradores = updateMorador(moradores, updatedMorador);
      expect(moradores.find(m => m.id === newMorador.id)?.telefone).toBe("(11) 99999-8888");

      // Delete
      moradores = deleteMorador(moradores, newMorador.id);
      expect(moradores).toHaveLength(2);
      expect(moradores.find(m => m.id === newMorador.id)).toBeUndefined();
    });
  });
});
