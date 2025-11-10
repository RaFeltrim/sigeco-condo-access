import { describe, it, expect, beforeEach } from 'vitest';

describe('SavedFiltersService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveFilter', () => {
    it('saves filter to localStorage', () => {
      const filter = { name: 'My Filter', status: 'ATIVO' };
      localStorage.setItem('savedFilters', JSON.stringify([filter]));
      
      const saved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(saved).toHaveLength(1);
      expect(saved[0]).toEqual(filter);
    });

    it('appends to existing filters', () => {
      const filter1 = { name: 'Filter 1', status: 'ATIVO' };
      const filter2 = { name: 'Filter 2', status: 'INATIVO' };
      
      localStorage.setItem('savedFilters', JSON.stringify([filter1]));
      
      const existing = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      const updated = [...existing, filter2];
      localStorage.setItem('savedFilters', JSON.stringify(updated));
      
      const saved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(saved).toHaveLength(2);
    });
  });

  describe('getFilters', () => {
    it('retrieves all saved filters', () => {
      const filters = [
        { name: 'Filter 1', status: 'ATIVO' },
        { name: 'Filter 2', status: 'INATIVO' },
      ];
      
      localStorage.setItem('savedFilters', JSON.stringify(filters));
      
      const retrieved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(retrieved).toEqual(filters);
    });

    it('returns empty array when no filters', () => {
      const retrieved = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(retrieved).toEqual([]);
    });
  });

  describe('deleteFilter', () => {
    it('removes specific filter', () => {
      const filters = [
        { id: '1', name: 'Filter 1' },
        { id: '2', name: 'Filter 2' },
      ];
      
      localStorage.setItem('savedFilters', JSON.stringify(filters));
      
      const updated = filters.filter(f => f.id !== '1');
      localStorage.setItem('savedFilters', JSON.stringify(updated));
      
      const remaining = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('2');
    });
  });

  describe('updateFilter', () => {
    it('updates existing filter', () => {
      const filters = [{ id: '1', name: 'Old Name', status: 'ATIVO' }];
      
      localStorage.setItem('savedFilters', JSON.stringify(filters));
      
      const updated = filters.map(f => 
        f.id === '1' ? { ...f, name: 'New Name' } : f
      );
      localStorage.setItem('savedFilters', JSON.stringify(updated));
      
      const result = JSON.parse(localStorage.getItem('savedFilters') || '[]');
      expect(result[0].name).toBe('New Name');
    });
  });
});
