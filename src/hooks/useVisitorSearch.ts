/**
 * Custom Hook for Visitor Search
 * Implements multi-field search with relevance scoring
 */

import { useState, useMemo, useCallback } from 'react';
import type { Visitor, SearchResult } from '@/types/visitor';

export interface UseVisitorSearchReturn {
  query: string;
  results: SearchResult[];
  isSearching: boolean;
  setQuery: (query: string) => void;
  clearSearch: () => void;
}

/**
 * Normalizes text for comparison (lowercase, removes accents)
 */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics
}

/**
 * Calculates relevance score for a match
 * - Exact match: 100
 * - Starts with: 80
 * - Contains: 60
 */
function calculateRelevance(text: string, query: string): number {
  const normalizedText = normalizeText(text);
  const normalizedQuery = normalizeText(query);
  
  if (normalizedText === normalizedQuery) {
    return 100;
  }
  
  if (normalizedText.startsWith(normalizedQuery)) {
    return 80;
  }
  
  if (normalizedText.includes(normalizedQuery)) {
    return 60;
  }
  
  return 0;
}

/**
 * Searches for visitors across multiple fields
 */
function searchVisitors(visitors: Visitor[], query: string): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const normalizedQuery = normalizeText(query.trim());
  const results: SearchResult[] = [];
  
  for (const visitor of visitors) {
    let bestMatch: SearchResult | null = null;
    
    // Search by name (fuzzy match)
    const nameRelevance = calculateRelevance(visitor.nome, normalizedQuery);
    if (nameRelevance > 0) {
      bestMatch = {
        visitor,
        matchType: 'name',
        relevance: nameRelevance,
      };
    }
    
    // Search by document (exact match - higher priority)
    const documentRelevance = calculateRelevance(visitor.documento, normalizedQuery);
    if (documentRelevance > 0 && (!bestMatch || documentRelevance > bestMatch.relevance)) {
      bestMatch = {
        visitor,
        matchType: 'document',
        relevance: documentRelevance + 10, // Boost document matches
      };
    }
    
    // Search by destination (partial match)
    const destinationRelevance = calculateRelevance(visitor.destino, normalizedQuery);
    if (destinationRelevance > 0 && (!bestMatch || destinationRelevance > bestMatch.relevance)) {
      bestMatch = {
        visitor,
        matchType: 'destination',
        relevance: destinationRelevance,
      };
    }
    
    if (bestMatch) {
      results.push(bestMatch);
    }
  }
  
  // Sort by relevance (highest first)
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Return top 10 results
  return results.slice(0, 10);
}

/**
 * Hook for visitor search functionality
 */
export function useVisitorSearch(visitors: Visitor[]): UseVisitorSearchReturn {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Memoize search results
  const results = useMemo(() => {
    if (!query || query.trim().length === 0) {
      return [];
    }
    
    setIsSearching(true);
    const searchResults = searchVisitors(visitors, query);
    setIsSearching(false);
    
    return searchResults;
  }, [visitors, query]);
  
  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);
  
  return {
    query,
    results,
    isSearching,
    setQuery,
    clearSearch,
  };
}
