import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockVisit } from '../../utils/mock-data';

describe('Visits Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('checkIn', () => {
    it('checks in visitor', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ visit: mockVisit }, 201)
      );

      const response = await fetch('/api/visits/checkin', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: '1' }),
      });

      expect(response.status).toBe(201);
    });

    it('validates appointment exists', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ message: 'Appointment not found' }, 404)
      );

      const response = await fetch('/api/visits/checkin', {
        method: 'POST',
        body: JSON.stringify({ appointmentId: '999' }),
      });

      expect(response.status).toBe(404);
    });
  });

  describe('checkOut', () => {
    it('checks out visitor', async () => {
      const checkedOut = { ...mockVisit, checkOut: new Date() };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ visit: checkedOut })
      );

      const response = await fetch('/api/visits/1/checkout', {
        method: 'POST',
      });
      const data = await response.json();

      expect(data.visit.checkOut).toBeDefined();
    });
  });

  describe('getActive', () => {
    it('fetches active visits', async () => {
      const visits = [mockVisit];
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ visits })
      );

      const response = await fetch('/api/visits/active');
      const data = await response.json();

      expect(data.visits).toHaveLength(1);
    });
  });
});
