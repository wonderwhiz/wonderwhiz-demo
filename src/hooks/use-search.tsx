
import { useState, useCallback } from 'react';

export interface UseSearchOptions {
  onSearch?: (query: string) => void;
  initialQuery?: string;
  debounceTime?: number;
  minQueryLength?: number;
}

export function useSearch({
  onSearch,
  initialQuery = '',
  debounceTime = 300,
  minQueryLength = 2
}: UseSearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback((e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (searchQuery.trim().length >= minQueryLength && onSearch) {
      setIsSearching(true);
      onSearch(searchQuery.trim());
    }
  }, [searchQuery, onSearch, minQueryLength]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Auto-search with debounce if query meets minimum length
    if (value.trim().length >= minQueryLength && onSearch) {
      const timeout = setTimeout(() => {
        onSearch(value.trim());
        setIsSearching(true);
      }, debounceTime);
      
      setSearchTimeout(timeout);
    } else {
      setIsSearching(false);
    }
  }, [onSearch, debounceTime, minQueryLength, searchTimeout]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setIsSearching(false);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
  }, [searchTimeout]);

  return { 
    searchQuery, 
    setSearchQuery: handleSearchChange, 
    handleSearch, 
    isSearching, 
    clearSearch 
  };
}
