/**
 * Access Control Type Definitions
 * Types for access control and logging system
 */

export type AccessStatus = 'Autorizado' | 'Negado' | 'Pendente' | 'Expirado';
export type AccessType = 'Entrada' | 'Saida' | 'Permanencia';
export type UserRole = 'admin' | 'porteiro' | 'morador' | 'sindico';

export interface AccessRecord {
  id: number;
  timestamp: Date;
  userId: number;
  userName: string;
  userRole: UserRole;
  accessType: AccessType;
  status: AccessStatus;
  location: string;
  destino?: string;
  autorizadoPor?: string;
  motivo?: string;
  observacoes?: string;
  documento?: string;
  ip?: string;
  dispositivo?: string;
}

export interface AccessFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: number;
  status?: AccessStatus;
  accessType?: AccessType;
  location?: string;
  userRole?: UserRole;
}

export interface AccessStats {
  total: number;
  autorizados: number;
  negados: number;
  pendentes: number;
  porTipo: Record<AccessType, number>;
  porStatus: Record<AccessStatus, number>;
}

export interface AccessLogEntry {
  id: number;
  timestamp: Date;
  action: string;
  details: string;
  userId?: number;
  userName?: string;
}

/**
 * Type guard to check if a value is a valid AccessRecord
 */
export function isAccessRecord(value: unknown): value is AccessRecord {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const ar = value as Record<string, unknown>;

  return (
    typeof ar.id === 'number' &&
    ar.timestamp instanceof Date &&
    typeof ar.userId === 'number' &&
    typeof ar.userName === 'string' &&
    typeof ar.userRole === 'string' &&
    typeof ar.accessType === 'string' &&
    typeof ar.status === 'string' &&
    typeof ar.location === 'string'
  );
}

/**
 * Type guard to check if a value is an array of AccessRecords
 */
export function isAccessRecordArray(value: unknown): value is AccessRecord[] {
  return Array.isArray(value) && value.every(isAccessRecord);
}
