import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createMockResponse } from '../../utils/test-helpers';
import { mockDashboardStats } from '../../utils/mock-data';

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
  });

  describe('getStats', () => {
    it('fetches dashboard statistics', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ stats: mockDashboardStats })
      );

      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      expect(data.stats).toEqual(mockDashboardStats);
    });

    it('includes all required metrics', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ stats: mockDashboardStats })
      );

      const response = await fetch('/api/dashboard/stats');
      const data = await response.json();

      expect(data.stats).toHaveProperty('totalResidents');
      expect(data.stats).toHaveProperty('activeVisits');
      expect(data.stats).toHaveProperty('todayAppointments');
      expect(data.stats).toHaveProperty('pendingAppointments');
    });
  });

  describe('getReports', () => {
    it('fetches reports with date range', async () => {
      const reports = {
        visits: [],
        appointments: [],
        period: { start: '2024-01-01', end: '2024-01-31' },
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        createMockResponse({ reports })
      );

      const response = await fetch('/api/dashboard/reports?start=2024-01-01&end=2024-01-31');
      const data = await response.json();

      expect(data.reports.period).toBeDefined();
    });
  });
});
