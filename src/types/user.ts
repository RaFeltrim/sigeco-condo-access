/**
 * User Management Type Definitions
 * Types for user management and authentication
 */

export type UserRole = 'admin' | 'porteiro' | 'morador' | 'sindico';
export type UserStatus = 'active' | 'inactive' | 'suspended';

export interface User {
  id: number;
  nome: string;
  email: string;
  documento: string;
  telefone?: string;
  role: UserRole;
  status: UserStatus;
  apartamento?: string;
  bloco?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface UserFormData {
  nome: string;
  email: string;
  documento: string;
  telefone: string;
  role: UserRole;
  status: UserStatus;
  apartamento?: string;
  bloco?: string;
  password?: string;
}

export interface UserFormErrors {
  nome?: string;
  email?: string;
  documento?: string;
  telefone?: string;
  password?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface UserFilter {
  role?: UserRole;
  status?: UserStatus;
  searchTerm?: string;
  apartamento?: string;
  bloco?: string;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

/**
 * Role permissions mapping
 */
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['*'], // Full access
  sindico: [
    'users.view',
    'users.create',
    'users.edit',
    'moradores.view',
    'moradores.create',
    'moradores.edit',
    'reports.view',
    'reports.export',
    'access.view',
    'appointments.view',
    'appointments.manage',
  ],
  porteiro: [
    'visitors.view',
    'visitors.create',
    'visitors.checkout',
    'access.view',
    'appointments.view',
  ],
  morador: [
    'visitors.view_own',
    'appointments.view_own',
    'appointments.create',
  ],
};

/**
 * Role display names
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  sindico: 'Síndico',
  porteiro: 'Porteiro',
  morador: 'Morador',
};

/**
 * Status display names
 */
export const STATUS_LABELS: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  suspended: 'Suspenso',
};

/**
 * Type guard to check if a value is a valid User
 */
export function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const u = value as Record<string, unknown>;

  return (
    typeof u.id === 'number' &&
    typeof u.nome === 'string' &&
    typeof u.email === 'string' &&
    typeof u.documento === 'string' &&
    typeof u.role === 'string' &&
    typeof u.status === 'string' &&
    u.createdAt instanceof Date &&
    u.updatedAt instanceof Date
  );
}

/**
 * Type guard for User array
 */
export function isUserArray(value: unknown): value is User[] {
  return Array.isArray(value) && value.every(isUser);
}

/**
 * Check if user has permission
 */
export function hasPermission(user: User, permission: string): boolean {
  const rolePermissions = ROLE_PERMISSIONS[user.role];
  
  // Admin has all permissions
  if (rolePermissions.includes('*')) {
    return true;
  }
  
  return rolePermissions.includes(permission);
}

/**
 * Check if user has any of the specified roles
 */
export function hasRole(user: User, roles: UserRole[]): boolean {
  return roles.includes(user.role);
}
