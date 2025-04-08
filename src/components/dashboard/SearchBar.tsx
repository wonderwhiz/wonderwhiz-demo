
import React from 'react';
import EnhancedSearchBar from './EnhancedSearchBar';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  recentQueries?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  recentQueries = []
}) => {
  return (
    <EnhancedSearchBar
      query={query}
      setQuery={setQuery}
      handleSubmitQuery={handleSubmitQuery}
      isGenerating={isGenerating}
      recentQueries={recentQueries}
    />
  );
};

export default SearchBar;
