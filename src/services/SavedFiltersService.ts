/**
 * SavedFiltersService
 * REL-003: Service to manage saved report filters
 */

import type { ReportFilter } from './ReportService';

const STORAGE_KEY = 'sigeco_saved_filters';

export interface SavedFilter {
  id: string;
  name: string;
  filters: ReportFilter;
  createdAt: Date;
  lastUsed?: Date;
}

class SavedFiltersServiceClass {
  /**
   * Loads all saved filters from localStorage
   */
  loadFilters(): SavedFilter[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return [];
      }

      // Deserialize dates
      return parsed.map(filter => ({
        ...filter,
        createdAt: new Date(filter.createdAt),
        lastUsed: filter.lastUsed ? new Date(filter.lastUsed) : undefined
      }));
    } catch (error) {
      console.error('Error loading saved filters:', error);
      return [];
    }
  }

  /**
   * Saves a new filter
   */
  saveFilter(name: string, filters: ReportFilter): SavedFilter {
    try {
      const existingFilters = this.loadFilters();
      
      const newFilter: SavedFilter = {
        id: this.generateId(),
        name,
        filters,
        createdAt: new Date()
      };

      const updatedFilters = [...existingFilters, newFilter];
      this.persistFilters(updatedFilters);

      return newFilter;
    } catch (error) {
      console.error('Error saving filter:', error);
      throw new Error('Falha ao salvar filtro');
    }
  }

  /**
   * Updates an existing filter
   */
  updateFilter(id: string, name: string, filters: ReportFilter): SavedFilter | null {
    try {
      const existingFilters = this.loadFilters();
      const index = existingFilters.findIndex(f => f.id === id);

      if (index === -1) {
        return null;
      }

      existingFilters[index] = {
        ...existingFilters[index],
        name,
        filters
      };

      this.persistFilters(existingFilters);
      return existingFilters[index];
    } catch (error) {
      console.error('Error updating filter:', error);
      throw new Error('Falha ao atualizar filtro');
    }
  }

  /**
   * Deletes a saved filter
   */
  deleteFilter(id: string): boolean {
    try {
      const existingFilters = this.loadFilters();
      const filtered = existingFilters.filter(f => f.id !== id);

      if (filtered.length === existingFilters.length) {
        return false; // Filter not found
      }

      this.persistFilters(filtered);
      return true;
    } catch (error) {
      console.error('Error deleting filter:', error);
      throw new Error('Falha ao excluir filtro');
    }
  }

  /**
   * Marks a filter as recently used
   */
  markAsUsed(id: string): void {
    try {
      const existingFilters = this.loadFilters();
      const index = existingFilters.findIndex(f => f.id === id);

      if (index !== -1) {
        existingFilters[index].lastUsed = new Date();
        this.persistFilters(existingFilters);
      }
    } catch (error) {
      console.error('Error marking filter as used:', error);
    }
  }

  /**
   * Gets a filter by ID
   */
  getFilter(id: string): SavedFilter | null {
    const filters = this.loadFilters();
    return filters.find(f => f.id === id) || null;
  }

  /**
   * Persists filters to localStorage
   */
  private persistFilters(filters: SavedFilter[]): void {
    try {
      // Serialize dates
      const serialized = filters.map(filter => ({
        ...filter,
        createdAt: filter.createdAt.toISOString(),
        lastUsed: filter.lastUsed?.toISOString()
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.error('Error persisting filters:', error);
      throw new Error('Falha ao salvar filtros no armazenamento local');
    }
  }

  /**
   * Generates a unique ID for a filter
   */
  private generateId(): string {
    return `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

// Export singleton instance
export const SavedFiltersService = new SavedFiltersServiceClass();
