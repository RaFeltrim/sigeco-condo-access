/**
 * Visitor Storage Module
 * Handles localStorage persistence for visitor data
 */

import type { Visitor } from '@/types/visitor';
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

const STORAGE_KEY = 'sigeco_visitors';
const MAX_RECORDS = 100;

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
 */
function serializeVisitor(visitor: Visitor): string {
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
 */
function deserializeVisitor(data: string): Visitor {
  const parsed = JSON.parse(data);
  return {
    ...parsed,
    entrada: new Date(parsed.entrada),
    saida: parsed.saida ? new Date(parsed.saida) : undefined,
  };
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
      try {
        const visitor = deserializeVisitor(JSON.stringify(item));
        visitors.push(visitor);
      } catch (deserializeError) {
        console.warn('Failed to deserialize visitor:', item, deserializeError);
        // Skip corrupted individual records but continue loading others
      }
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
 */
export function updateVisitor(id: number, updates: Partial<Visitor>): void {
  try {
    const visitors = loadVisitors();
    const index = visitors.findIndex(v => v.id === id);
    
    if (index === -1) {
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
