import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockAppointment, generateMockAppointments } from '../../utils/mock-data';

describe('Appointments Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getAll', () => {
    it('fetches all appointments', async () => {
      const appointments = generateMockAppointments(5);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ appointments, total: 5 })
      );

      const response = await fetch('/api/appointments');
      const data = await response.json();

      expect(data.appointments).toHaveLength(5);
    });

    it('filters by status', async () => {
      const appointments = generateMockAppointments(3);
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ appointments })
      );

      const response = await fetch('/api/appointments?status=PENDENTE');
      const data = await response.json();

      expect(data.appointments).toHaveLength(3);
    });

    it('filters by date', async () => {
      const appointments = [mockAppointment];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ appointments })
      );

      const response = await fetch('/api/appointments?date=2024-12-01');
      const data = await response.json();

      expect(data.appointments).toHaveLength(1);
    });
  });

  describe('create', () => {
    it('creates new appointment', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ appointment: mockAppointment }, 201)
      );

      const response = await fetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify(mockAppointment),
      });

      expect(response.status).toBe(201);
    });

    it('validates required fields', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Visitor name required' }, 400)
      );

      const response = await fetch('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ date: new Date() }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('update', () => {
    it('updates appointment status', async () => {
      const updated = { ...mockAppointment, status: 'CONFIRMADO' };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ appointment: updated })
      );

      const response = await fetch('/api/appointments/1', {
        method: 'PUT',
        body: JSON.stringify({ status: 'CONFIRMADO' }),
      });
      const data = await response.json();

      expect(data.appointment.status).toBe('CONFIRMADO');
    });
  });

  describe('delete', () => {
    it('cancels appointment', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({}, 204)
      );

      const response = await fetch('/api/appointments/1', {
        method: 'DELETE',
      });

      expect(response.status).toBe(204);
    });
  });
});
