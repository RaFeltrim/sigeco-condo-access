/**
 * Appointments Service
 * 
 * Handles all appointment-related API calls
 */

import apiClient from './client';

export interface Appointment {
  id: string;
  visitorName: string;
  visitorDoc: string;
  visitorPhone: string;
  destination: string;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observations?: string;
  residentId: string;
  unitId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentRequest {
  visitorName: string;
  visitorDoc: string;
  visitorPhone: string;
  destination: string;
  reason: string;
  scheduledDate: string;
  scheduledTime: string;
  observations?: string;
  residentId: string;
  unitId: string;
}

export interface UpdateAppointmentRequest {
  status?: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  observations?: string;
}

export interface AppointmentFilters {
  status?: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'CONCLUIDO';
  date?: string;
  residentId?: string;
}

export const appointmentsService = {
  /**
   * Get all appointments
   */
  async getAll(filters?: AppointmentFilters): Promise<{ appointments: Appointment[] }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.date) params.append('date', filters.date);
    if (filters?.residentId) params.append('residentId', filters.residentId);

    const response = await apiClient.get<{ appointments: Appointment[] }>(
      `/appointments?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Create new appointment
   */
  async create(data: CreateAppointmentRequest): Promise<{ appointment: Appointment }> {
    const response = await apiClient.post<{ appointment: Appointment }>('/appointments', data);
    return response.data;
  },

  /**
   * Update appointment
   */
  async update(
    id: string,
    data: UpdateAppointmentRequest
  ): Promise<{ appointment: Appointment }> {
    const response = await apiClient.put<{ appointment: Appointment }>(
      `/appointments/${id}`,
      data
    );
    return response.data;
  },

  /**
   * Delete appointment
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/appointments/${id}`);
    return response.data;
  },
};
