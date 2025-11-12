/**
 * useVisitorStorage Hook
 * Manages visitor state with automatic localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import type { Visitor } from '@/types/visitor';
import {
  loadVisitors,
  saveVisitor as saveVisitorToStorage,
  updateVisitor as updateVisitorInStorage,
  pruneOldRecords,
  clearOldRecords,
  StorageError,
} from '@/lib/storage/visitorStorage';
import { useToast } from '@/hooks/use-toast';
import { ERROR_MESSAGES } from '@/lib/constants/errorMessages';

export interface UseVisitorStorageReturn {
  visitors: Visitor[];
  addVisitor: (visitor: Omit<Visitor, 'id'>) => void;
  updateVisitor: (id: number, updates: Partial<Visitor>) => void;
  removeVisitor: (id: number) => void;
  clearOldVisitors: (daysOld?: number) => number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook for managing visitors with localStorage persistence
 */
export function useVisitorStorage(): UseVisitorStorageReturn {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load visitors from localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loadedVisitors = loadVisitors();
        setVisitors(loadedVisitors);
      } catch (err) {
        console.error('Failed to load visitors:', err);
        
        const errorMessage = err instanceof StorageError 
          ? err.message 
          : ERROR_MESSAGES.storage.loadFailed;
        
        setError(errorMessage);
        setVisitors([]);
        
        // Show error toast
        toast({
          title: 'Erro ao carregar dados',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [toast]);

  /**
   * Adds a new visitor and saves to localStorage
   */
  const addVisitor = useCallback((visitorData: Omit<Visitor, 'id'>) => {
    try {
      // Generate new ID based on existing visitors
      const newId = visitors.length > 0 
        ? Math.max(...visitors.map(v => v.id)) + 1 
        : 1;

      const newVisitor: Visitor = {
        ...visitorData,
        id: newId,
      };

      // Update state optimistically
      setVisitors(prev => [...prev, newVisitor]);

      // Save to localStorage
      try {
        saveVisitorToStorage(newVisitor);
        pruneOldRecords();
        setError(null);
      } catch (storageErr) {
        // Revert optimistic update on storage failure
        setVisitors(prev => prev.filter(v => v.id !== newId));
        
        const errorMessage = storageErr instanceof StorageError 
          ? storageErr.message 
          : ERROR_MESSAGES.storage.saveFailed;
        
        setError(errorMessage);
        
        // Show error toast
        toast({
          title: 'Erro ao salvar',
          description: errorMessage,
          variant: 'destructive',
        });
        
        throw storageErr;
      }
    } catch (err) {
      console.error('Failed to add visitor:', err);
      throw err;
    }
  }, [visitors, toast]);

  /**
   * Updates an existing visitor and saves to localStorage
   */
  const updateVisitor = useCallback((id: number, updates: Partial<Visitor>) => {
    // Store previous state for rollback
    const previousVisitors = visitors;
    
    try {
      // Find the visitor to update
      const visitorToUpdate = visitors.find(v => v.id === id);
      if (!visitorToUpdate) {
        throw new Error('Visitor not found in state');
      }

      // Create updated visitor object
      const updatedVisitor = { ...visitorToUpdate, ...updates };

      // Update state optimistically
      setVisitors(prev => 
        prev.map(visitor => 
          visitor.id === id 
            ? updatedVisitor 
            : visitor
        )
      );

      // Update in localStorage
      try {
        updateVisitorInStorage(id, updates);
        setError(null);
      } catch (storageErr) {
        let finalError = storageErr;
        
        // If visitor not found in storage, save the complete visitor object
        // This handles cases where storage was pruned or cleared
        if (storageErr instanceof StorageError && storageErr.code === 'UPDATE_FAILED') {
          try {
            saveVisitorToStorage(updatedVisitor);
            setError(null);
            return; // Successfully recovered from storage sync issue
          } catch (saveErr) {
            // If save also fails, use the save error for reporting
            finalError = saveErr;
          }
        }

        // Revert optimistic update on storage failure
        setVisitors(previousVisitors);
        
        const errorMessage = finalError instanceof StorageError 
          ? finalError.message 
          : ERROR_MESSAGES.storage.updateFailed;
        
        setError(errorMessage);
        
        // Show error toast
        toast({
          title: 'Erro ao atualizar',
          description: errorMessage,
          variant: 'destructive',
        });
        
        throw finalError;
      }
    } catch (err) {
      console.error('Failed to update visitor:', err);
      throw err;
    }
  }, [visitors, toast]);

  /**
   * Removes a visitor from state
   * Note: We keep the record in localStorage for history
   */
  const removeVisitor = useCallback((id: number) => {
    try {
      setVisitors(prev => prev.filter(visitor => visitor.id !== id));
      setError(null);
    } catch (err) {
      console.error('Failed to remove visitor:', err);
      
      const errorMessage = ERROR_MESSAGES.generic.unexpected;
      setError(errorMessage);
      
      toast({
        title: 'Erro ao remover',
        description: errorMessage,
        variant: 'destructive',
      });
      
      throw err;
    }
  }, [toast]);

  /**
   * Clears old visitor records from storage
   * @param daysOld - Number of days (default: 30)
   * @returns Number of records removed
   */
  const clearOldVisitors = useCallback((daysOld: number = 30): number => {
    try {
      const removedCount = clearOldRecords(daysOld);
      
      if (removedCount > 0) {
        // Reload visitors to update state
        const updatedVisitors = loadVisitors();
        setVisitors(updatedVisitors);
        
        toast({
          title: 'Registros antigos removidos',
          description: `${removedCount} ${removedCount === 1 ? 'registro removido' : 'registros removidos'} com sucesso.`,
        });
      } else {
        toast({
          title: 'Nenhum registro antigo',
          description: `Não há registros com mais de ${daysOld} dias.`,
        });
      }
      
      return removedCount;
    } catch (err) {
      console.error('Failed to clear old visitors:', err);
      
      const errorMessage = ERROR_MESSAGES.generic.unexpected;
      setError(errorMessage);
      
      toast({
        title: 'Erro ao limpar registros',
        description: errorMessage,
        variant: 'destructive',
      });
      
      return 0;
    }
  }, [toast]);

  return {
    visitors,
    addVisitor,
    updateVisitor,
    removeVisitor,
    clearOldVisitors,
    isLoading,
    error,
  };
}
