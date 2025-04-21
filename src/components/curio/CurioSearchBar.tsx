
import React, { FormEvent, useState } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface CurioSearchBarProps {
  placeholder?: string;
  searchQuery?: string;
  setSearchQuery?: React.Dispatch<React.SetStateAction<string>>;
  onSearch: (query: string) => void;
  onClear?: () => void;
  handleSearch?: (e: FormEvent) => void;
  childId?: string;
  disabled?: boolean;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({ 
  placeholder = "Search for content...",
  searchQuery = '',
  setSearchQuery,
  onSearch,
  onClear,
  handleSearch,
  childId,
  disabled = false
}) => {
  const [searchText, setSearchText] = useState(searchQuery || '');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchText.trim() && !disabled) {
      if (handleSearch) {
        handleSearch(e);
      } else {
        onSearch(searchText);
      }
      setIsTyping(false);
    }
  };

  const handleClear = () => {
    setSearchText('');
    if (setSearchQuery) {
      setSearchQuery('');
    }
    if (onClear) onClear();
    setIsTyping(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    setIsTyping(value.length > 0);
    
    if (setSearchQuery) {
      setSearchQuery(value);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchText.trim() && !disabled) {
      e.preventDefault();
      if (handleSearch) {
        handleSearch(e as unknown as FormEvent);
      } else {
        onSearch(searchText);
      }
      setIsTyping(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-4">
      <div className="relative">
        <input
          type="text"
          value={searchText}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
          {searchText && (
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled}
              className="text-white/60 hover:text-white/90 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          {isTyping && (
            <Button
              type="submit"
              size="sm"
              disabled={disabled}
              className="bg-indigo-600 hover:bg-indigo-700 rounded-full h-8 px-3 ml-1"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              <span className="text-xs">Explore</span>
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CurioSearchBar;
