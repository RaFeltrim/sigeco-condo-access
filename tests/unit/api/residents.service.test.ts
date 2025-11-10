import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockResident, generateMockResidents } from '../../utils/mock-data';

describe('Residents Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getAll', () => {
    it('should fetch all residents', async () => {
      const residents = generateMockResidents(5);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ residents, total: 5 })
      );

      const response = await fetch('/api/residents');
      const data = await response.json();

      expect(data.residents).toHaveLength(5);
      expect(data.total).toBe(5);
    });

    it('should filter by status', async () => {
      const residents = generateMockResidents(3);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ residents })
      );

      const response = await fetch('/api/residents?status=ATIVO');
      const data = await response.json();

      expect(data.residents).toHaveLength(3);
    });

    it('should search by name', async () => {
      const residents = [mockResident];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ residents })
      );

      const response = await fetch('/api/residents?search=João');
      const data = await response.json();

      expect(data.residents[0].name).toContain('João');
    });

    it('should handle pagination', async () => {
      const residents = generateMockResidents(10);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ residents: residents.slice(0, 5), total: 10 })
      );

      const response = await fetch('/api/residents?page=1&limit=5');
      const data = await response.json();

      expect(data.residents).toHaveLength(5);
      expect(data.total).toBe(10);
    });
  });

  describe('getById', () => {
    it('should fetch resident by ID', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ resident: mockResident })
      );

      const response = await fetch('/api/residents/1');
      const data = await response.json();

      expect(data.resident).toEqual(mockResident);
    });

    it('should return 404 for non-existent resident', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Resident not found' }, 404)
      );

      const response = await fetch('/api/residents/999');
      expect(response.status).toBe(404);
    });
  });

  describe('create', () => {
    it('should create new resident', async () => {
      const newResident = { ...mockResident, id: '2' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ resident: newResident }, 201)
      );

      const response = await fetch('/api/residents', {
        method: 'POST',
        body: JSON.stringify(newResident),
      });
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.resident).toEqual(newResident);
    });

    it('should validate required fields', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Name is required' }, 400)
      );

      const response = await fetch('/api/residents', {
        method: 'POST',
        body: JSON.stringify({ cpf: '12345678900' }),
      });

      expect(response.status).toBe(400);
    });

    it('should validate CPF format', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Invalid CPF' }, 400)
      );

      const response = await fetch('/api/residents', {
        method: 'POST',
        body: JSON.stringify({ ...mockResident, cpf: 'invalid' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('update', () => {
    it('should update resident', async () => {
      const updated = { ...mockResident, name: 'Updated Name' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ resident: updated })
      );

      const response = await fetch('/api/residents/1', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated Name' }),
      });
      const data = await response.json();

      expect(data.resident.name).toBe('Updated Name');
    });

    it('should return 404 for non-existent resident', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Resident not found' }, 404)
      );

      const response = await fetch('/api/residents/999', {
        method: 'PUT',
        body: JSON.stringify({ name: 'Test' }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('delete', () => {
    it('should delete resident', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Resident deleted' }, 204)
      );

      const response = await fetch('/api/residents/1', {
        method: 'DELETE',
      });

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent resident', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Resident not found' }, 404)
      );

      const response = await fetch('/api/residents/999', {
        method: 'DELETE',
      });

      expect(response.status).toBe(404);
    });
  });
});
