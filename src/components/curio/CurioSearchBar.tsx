
import React, { FormEvent } from 'react';
import { Search, X } from 'lucide-react';

export interface CurioSearchBarProps {
  placeholder?: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (query: string) => void;
  onClear?: () => void;
  handleSearch?: (e: FormEvent) => void;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({ 
  placeholder = "Search for content...",
  searchQuery = '',
  setSearchQuery,
  onSearch,
  onClear,
  handleSearch
}) => {
  const [searchText, setSearchText] = React.useState(searchQuery || '');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (handleSearch) {
      handleSearch(e);
    } else {
      onSearch(searchText);
    }
  };

  const handleClear = () => {
    setSearchText('');
    if (setSearchQuery) {
      setSearchQuery('');
    }
    if (onClear) onClear();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    if (setSearchQuery) {
      setSearchQuery(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
        {searchText && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/90 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default CurioSearchBar;
