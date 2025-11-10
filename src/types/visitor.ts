/**
 * Visitor Type Definitions
 * Core types for visitor management system
 */

export interface Visitor {
  id: number;
  nome: string;
  documento: string;
  documentoTipo?: 'CPF' | 'RG' | 'OUTRO';
  destino: string;
  motivo?: string;
  entrada: Date;
  saida?: Date;
  status: 'Ativo' | 'Saiu';
  hora: string; // Formatted time string for display
  duracao?: {
    hours: number;
    minutes: number;
    totalMinutes: number;
  };
}

export interface SearchResult {
  visitor: Visitor;
  matchType: 'name' | 'document' | 'destination';
  relevance: number;
}

export interface VisitorFormData {
  nome: string;
  documento: string;
  destino: string;
  motivo: string;
}

export interface VisitorFormErrors {
  nome?: string;
  documento?: string;
  destino?: string;
}

export interface VisitorFormState {
  data: VisitorFormData;
  errors: VisitorFormErrors;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * Document Validation Types
 */
export interface DocumentValidation {
  isValid: boolean;
  type: 'CPF' | 'RG' | 'UNKNOWN';
  formatted: string;
  error?: string;
}

/**
 * Name Validation Types
 */
export interface NameValidation {
  isValid: boolean;
  formatted: string;
  error?: string;
}

/**
 * Type Guards for Runtime Validation
 */

/**
 * Type guard to check if a value is a valid Visitor object
 */
export function isVisitor(value: unknown): value is Visitor {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const v = value as Record<string, unknown>;

  return (
    typeof v.id === 'number' &&
    typeof v.nome === 'string' &&
    typeof v.documento === 'string' &&
    typeof v.destino === 'string' &&
    v.entrada instanceof Date &&
    (v.status === 'Ativo' || v.status === 'Saiu') &&
    typeof v.hora === 'string' &&
    (v.motivo === undefined || typeof v.motivo === 'string') &&
    (v.saida === undefined || v.saida instanceof Date) &&
    (v.documentoTipo === undefined || 
     v.documentoTipo === 'CPF' || 
     v.documentoTipo === 'RG' || 
     v.documentoTipo === 'OUTRO')
  );
}

/**
 * Type guard to check if a value is a valid SearchResult object
 */
export function isSearchResult(value: unknown): value is SearchResult {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const sr = value as Record<string, unknown>;

  return (
    isVisitor(sr.visitor) &&
    (sr.matchType === 'name' || sr.matchType === 'document' || sr.matchType === 'destination') &&
    typeof sr.relevance === 'number'
  );
}

/**
 * Type guard to check if a value is a valid VisitorFormData object
 */
export function isVisitorFormData(value: unknown): value is VisitorFormData {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const vfd = value as Record<string, unknown>;

  return (
    typeof vfd.nome === 'string' &&
    typeof vfd.documento === 'string' &&
    typeof vfd.destino === 'string' &&
    typeof vfd.motivo === 'string'
  );
}

/**
 * Type guard to check if a value is a valid DocumentValidation object
 */
export function isDocumentValidation(value: unknown): value is DocumentValidation {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const dv = value as Record<string, unknown>;

  return (
    typeof dv.isValid === 'boolean' &&
    (dv.type === 'CPF' || dv.type === 'RG' || dv.type === 'UNKNOWN') &&
    typeof dv.formatted === 'string' &&
    (dv.error === undefined || typeof dv.error === 'string')
  );
}

/**
 * Type guard to check if a value is a valid NameValidation object
 */
export function isNameValidation(value: unknown): value is NameValidation {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const nv = value as Record<string, unknown>;

  return (
    typeof nv.isValid === 'boolean' &&
    typeof nv.formatted === 'string' &&
    (nv.error === undefined || typeof nv.error === 'string')
  );
}

/**
 * Helper to validate an array of visitors
 */
export function isVisitorArray(value: unknown): value is Visitor[] {
  return Array.isArray(value) && value.every(isVisitor);
}
