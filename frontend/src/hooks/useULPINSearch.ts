import { useState, useEffect, useCallback } from 'react';
import { ulpinApi } from '../api/ulpin';
import { ULPINSearchResult } from '../types';

export const useULPINSearch = (debounceMs: number = 500) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ULPINSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await ulpinApi.searchULPIN(searchQuery);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching search results');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      executeSearch(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, executeSearch]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    executeSearch: () => executeSearch(query)
  };
};
