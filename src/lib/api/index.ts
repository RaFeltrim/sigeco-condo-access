/**
 * API Services Index
 * 
 * Central export point for all API services
 */

export { default as apiClient, setAuthToken, getAuthToken, clearAuthToken, isAuthenticated } from './client';
export { authService } from './auth.service';
export { residentsService } from './residents.service';
export { appointmentsService } from './appointments.service';
export { visitsService } from './visits.service';
export { dashboardService } from './dashboard.service';

export type { LoginRequest, RegisterRequest, User, LoginResponse } from './auth.service';
export type { Resident, CreateResidentRequest, UpdateResidentRequest, ResidentFilters } from './residents.service';
export type { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, AppointmentFilters } from './appointments.service';
export type { Visit, CreateVisitRequest, VisitFilters } from './visits.service';
export type { DashboardStats, DashboardData, ReportFilters } from './dashboard.service';
