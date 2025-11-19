/**
 * Visitor Storage Module
 * Handles localStorage persistence for visitor data
 */

import type { Visitor } from '@/types/visitor';
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

const STORAGE_KEY = 'sigeco_visitors';
const MAX_RECORDS = 100;

/**
 * Checks if a value is a valid Date object
 */
function isValidDate(date: unknown): date is Date {
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Storage error types for better error handling
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: 'SAVE_FAILED' | 'LOAD_FAILED' | 'UPDATE_FAILED' | 'QUOTA_EXCEEDED' | 'CORRUPTED',
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

/**
 * Serializes visitor data for storage
 * Converts Date objects to ISO strings
 * Throws error if Date objects are invalid
 */
function serializeVisitor(visitor: Visitor): string {
  // Validate entrada date
  if (!isValidDate(visitor.entrada)) {
    throw new Error(`Invalid entrada date for visitor ${visitor.id}: ${visitor.entrada}`);
  }
  
  // Validate saida date if present
  if (visitor.saida !== undefined && !isValidDate(visitor.saida)) {
    throw new Error(`Invalid saida date for visitor ${visitor.id}: ${visitor.saida}`);
  }
  
  const serialized = {
    ...visitor,
    entrada: visitor.entrada.toISOString(),
    saida: visitor.saida?.toISOString(),
  };
  return JSON.stringify(serialized);
}

/**
 * Deserializes visitor data from storage
 * Converts ISO strings back to Date objects
 * Returns null if deserialization fails or dates are invalid
 */
function deserializeVisitor(data: string): Visitor | null {
  try {
    const parsed = JSON.parse(data);
    
    // Create Date objects
    const entrada = new Date(parsed.entrada);
    const saida = parsed.saida ? new Date(parsed.saida) : undefined;
    
    // Validate entrada date (required)
    if (!isValidDate(entrada)) {
      console.warn('Invalid entrada date during deserialization:', parsed.entrada);
      return null;
    }
    
    // Validate saida date if present
    if (saida !== undefined && !isValidDate(saida)) {
      console.warn('Invalid saida date during deserialization:', parsed.saida);
      return null;
    }
    
    return {
      ...parsed,
      entrada,
      saida,
    };
  } catch (error) {
    console.warn('Failed to deserialize visitor:', error);
    return null;
  }
}

/**
 * Saves a visitor to localStorage with comprehensive error handling
 */
export function saveVisitor(visitor: Visitor): void {
  try {
    const visitors = loadVisitors();
    
    // Check if visitor already exists (update scenario)
    const existingIndex = visitors.findIndex(v => v.id === visitor.id);
    
    if (existingIndex >= 0) {
      visitors[existingIndex] = visitor;
    } else {
      visitors.push(visitor);
    }
    
    // Prune old records if exceeding limit
    const prunedVisitors = visitors.length > MAX_RECORDS 
      ? visitors.slice(-MAX_RECORDS) 
      : visitors;
    
    const serialized = prunedVisitors.map(v => serializeVisitor(v));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (storageError) {
      // Handle quota exceeded error
      if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
        // Try to free up space by keeping only half the records
        const reducedVisitors = prunedVisitors.slice(-Math.floor(MAX_RECORDS / 2));
        const reducedSerialized = reducedVisitors.map(v => serializeVisitor(v));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reducedSerialized));
        
        throw new StorageError(
          ERROR_MESSAGES.storage.quotaExceeded,
          'QUOTA_EXCEEDED',
          storageError
        );
      }
      throw storageError;
    }
  } catch (error) {
    console.error('Error saving visitor to localStorage:', error);
    
    if (error instanceof StorageError) {
      throw error;
    }
    
    throw new StorageError(
      ERROR_MESSAGES.storage.saveFailed,
      'SAVE_FAILED',
      error
    );
  }
}

/**
 * Loads all visitors from localStorage with comprehensive error handling
 * Returns empty array if storage is empty or corrupted
 */
export function loadVisitors(): Visitor[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      return [];
    }
    
    const parsed = JSON.parse(stored);
    
    if (!Array.isArray(parsed)) {
      console.warn('Invalid visitor data format in localStorage');
      // Clear corrupted data
      localStorage.removeItem(STORAGE_KEY);
      throw new StorageError(
        ERROR_MESSAGES.storage.corrupted,
        'CORRUPTED'
      );
    }
    
    // Validate and deserialize each visitor
    const visitors: Visitor[] = [];
    for (const item of parsed) {
      const visitor = deserializeVisitor(JSON.stringify(item));
      if (visitor !== null) {
        visitors.push(visitor);
      }
      // If visitor is null, it was already logged by deserializeVisitor
    }
    
    return visitors;
  } catch (error) {
    console.error('Error loading visitors from localStorage:', error);
    
    if (error instanceof StorageError) {
      throw error;
    }
    
    // Clear potentially corrupted data and return empty array
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (clearError) {
      console.error('Failed to clear corrupted storage:', clearError);
    }
    
    throw new StorageError(
      ERROR_MESSAGES.storage.loadFailed,
      'LOAD_FAILED',
      error
    );
  }
}

/**
 * Updates an existing visitor in localStorage with comprehensive error handling
 * Throws UPDATE_FAILED error if visitor not found (caller should handle by saving full visitor)
 */
export function updateVisitor(id: number, updates: Partial<Visitor>): void {
  try {
    const visitors = loadVisitors();
    const index = visitors.findIndex(v => v.id === id);
    
    if (index === -1) {
      // Visitor not found in storage - this can happen if:
      // 1. Storage was pruned and the visitor was removed
      // 2. Storage was cleared or corrupted
      // 3. State is out of sync with localStorage
      // Throw a specific error that the caller can handle
      throw new StorageError(
        ERROR_MESSAGES.checkout.notFound,
        'UPDATE_FAILED'
      );
    }
    
    visitors[index] = { ...visitors[index], ...updates };
    
    const serialized = visitors.map(v => serializeVisitor(v));
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (storageError) {
      // Handle quota exceeded error
      if (storageError instanceof Error && storageError.name === 'QuotaExceededError') {
        throw new StorageError(
          ERROR_MESSAGES.storage.quotaExceeded,
          'QUOTA_EXCEEDED',
          storageError
        );
      }
      throw storageError;
    }
  } catch (error) {
    console.error('Error updating visitor in localStorage:', error);
    
    if (error instanceof StorageError) {
      throw error;
    }
    
    throw new StorageError(
      ERROR_MESSAGES.storage.updateFailed,
      'UPDATE_FAILED',
      error
    );
  }
}

/**
 * Removes oldest records to maintain maximum limit
 * Keeps only the most recent MAX_RECORDS entries
 */
export function pruneOldRecords(): void {
  try {
    const visitors = loadVisitors();
    
    if (visitors.length <= MAX_RECORDS) {
      return;
    }
    
    // Sort by entry time (most recent first)
    const sorted = visitors.sort((a, b) => 
      b.entrada.getTime() - a.entrada.getTime()
    );
    
    // Keep only the most recent MAX_RECORDS
    const pruned = sorted.slice(0, MAX_RECORDS);
    
    const serialized = pruned.map(v => serializeVisitor(v));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch (error) {
    console.error('Error pruning old records:', error);
  }
}

/**
 * Clears all visitor data from localStorage
 */
export function clearStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

/**
 * Removes records older than specified days
 * @param daysOld - Number of days (default: 30)
 * @returns Number of records removed
 */
export function clearOldRecords(daysOld: number = 30): number {
  try {
    const visitors = loadVisitors();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    // Filter out old records
    const filteredVisitors = visitors.filter(v => {
      const entradaDate = new Date(v.entrada);
      return entradaDate >= cutoffDate;
    });
    
    const removedCount = visitors.length - filteredVisitors.length;
    
    if (removedCount > 0) {
      // Save filtered visitors back to storage
      const serialized = filteredVisitors.map(v => serializeVisitor(v));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    }
    
    return removedCount;
  } catch (error) {
    console.error('Error clearing old records:', error);
    return 0;
  }
}

/**
 * Gets the current number of stored visitors
 */
export function getStorageCount(): number {
  try {
    const visitors = loadVisitors();
    return visitors.length;
  } catch {
    return 0;
  }
}
