/**
 * Visits Service
 * 
 * Handles all visit/access-related API calls
 */

import apiClient from './client';

export interface Visit {
  id: string;
  visitorName: string;
  document: string;
  unitId: string;
  purpose: string;
  entryTime: string;
  exitTime?: string;
  status: 'ATIVO' | 'SAIU';
  photo?: string;
  createdAt: string;
  updatedAt: string;
  unit: {
    id: string;
    number: string;
    block?: string;
  };
}

export interface CreateVisitRequest {
  visitorName: string;
  document: string;
  unitId: string;
  purpose: string;
  photo?: string;
}

export interface VisitFilters {
  status?: 'ATIVO' | 'SAIU';
  unitId?: string;
  date?: string;
}

export const visitsService = {
  /**
   * Get all visits
   */
  async getAll(filters?: VisitFilters): Promise<{ visits: Visit[] }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.unitId) params.append('unitId', filters.unitId);
    if (filters?.date) params.append('date', filters.date);

    const response = await apiClient.get<{ visits: Visit[] }>(`/visits?${params.toString()}`);
    return response.data;
  },

  /**
   * Register new visit
   */
  async create(data: CreateVisitRequest): Promise<{ visit: Visit }> {
    const response = await apiClient.post<{ visit: Visit }>('/visits', data);
    return response.data;
  },

  /**
   * Checkout visitor
   */
  async checkout(id: string): Promise<{ visit: Visit }> {
    const response = await apiClient.put<{ visit: Visit }>(`/visits/${id}/checkout`);
    return response.data;
  },
};
