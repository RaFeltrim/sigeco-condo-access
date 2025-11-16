/**
 * Dashboard Service
 * 
 * Handles all dashboard-related API calls
 */

import apiClient from './client';
import { Visit } from './visits.service';

export interface DashboardStats {
  visitsToday: number;
  activeVisitors: number;
  visitsWeek: number;
  pendingAppointments: number;
  totalResidents: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentVisits: Visit[];
}

export interface ReportFilters {
  startDate?: string;
  endDate?: string;
  type?: string;
}

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  async getStats(): Promise<DashboardData> {
    const response = await apiClient.get<DashboardData>('/dashboard/stats');
    return response.data;
  },

  /**
   * Get reports data
   */
  async getReports(filters?: ReportFilters): Promise<{ visits: Visit[]; type?: string }> {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.type) params.append('type', filters.type);

    const response = await apiClient.get<{ visits: Visit[]; type?: string }>(
      `/dashboard/reports?${params.toString()}`
    );
    return response.data;
  },
};
