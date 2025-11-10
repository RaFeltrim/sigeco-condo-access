/**
 * Residents Service
 * 
 * Handles all resident-related API calls
 */

import apiClient from './client';

export interface Resident {
  id: string;
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'PROPRIETARIO' | 'LOCATARIO' | 'DEPENDENTE';
  status: 'ATIVO' | 'INATIVO';
  unitId: string;
  registeredAt: string;
  updatedAt: string;
  unit: {
    id: string;
    number: string;
    block?: string;
    type: string;
    status: string;
  };
}

export interface CreateResidentRequest {
  name: string;
  email: string;
  phone: string;
  document: string;
  type: 'PROPRIETARIO' | 'LOCATARIO' | 'DEPENDENTE';
  unitId: string;
}

export interface UpdateResidentRequest {
  name?: string;
  email?: string;
  phone?: string;
  document?: string;
  type?: 'PROPRIETARIO' | 'LOCATARIO' | 'DEPENDENTE';
  status?: 'ATIVO' | 'INATIVO';
  unitId?: string;
}

export interface ResidentFilters {
  unitId?: string;
  status?: 'ATIVO' | 'INATIVO';
  search?: string;
}

export const residentsService = {
  /**
   * Get all residents
   */
  async getAll(filters?: ResidentFilters): Promise<{ residents: Resident[] }> {
    const params = new URLSearchParams();
    if (filters?.unitId) params.append('unitId', filters.unitId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);

    const response = await apiClient.get<{ residents: Resident[] }>(
      `/residents?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get resident by ID
   */
  async getById(id: string): Promise<{ resident: Resident }> {
    const response = await apiClient.get<{ resident: Resident }>(`/residents/${id}`);
    return response.data;
  },

  /**
   * Create new resident
   */
  async create(data: CreateResidentRequest): Promise<{ resident: Resident }> {
    const response = await apiClient.post<{ resident: Resident }>('/residents', data);
    return response.data;
  },

  /**
   * Update resident
   */
  async update(id: string, data: UpdateResidentRequest): Promise<{ resident: Resident }> {
    const response = await apiClient.put<{ resident: Resident }>(`/residents/${id}`, data);
    return response.data;
  },

  /**
   * Delete resident
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/residents/${id}`);
    return response.data;
  },
};
