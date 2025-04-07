
import { useState } from 'react';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Any additional search logic can be added here
    console.log('Searching for:', searchQuery);
  };

  return { searchQuery, setSearchQuery, handleSearch };
}
