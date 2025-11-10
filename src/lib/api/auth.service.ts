/**
 * Authentication Service
 * 
 * Handles all authentication-related API calls
 */

import apiClient, { setAuthToken, clearAuthToken } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  role?: 'ADMIN' | 'SINDICO' | 'PORTEIRO';
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'SINDICO' | 'PORTEIRO';
}

export interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    
    // Save token to localStorage
    if (response.data.token) {
      setAuthToken(response.data.token);
    }
    
    return response.data;
  },

  /**
   * Register new user
   */
  async register(data: RegisterRequest): Promise<{ user: User }> {
    const response = await apiClient.post<{ user: User }>('/auth/register', data);
    return response.data;
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>('/auth/me');
    return response.data;
  },

  /**
   * Logout user
   */
  logout(): void {
    clearAuthToken();
    window.location.href = '/';
  },
};
