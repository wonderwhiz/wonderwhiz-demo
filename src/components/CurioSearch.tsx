
import React, { useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CurioSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  totalBlocksLoaded: number;
}

const CurioSearch: React.FC<CurioSearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch,
  isSearching,
  totalBlocksLoaded,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input with keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Command+K to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  return (
    <div className="mb-3 sm:mb-4">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={searchInputRef}
          type="text"
          placeholder="Search in this curio (Ctrl+K)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-black/40 border-white/10 text-white pl-9 pr-12 py-2 h-10"
        />
        <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-white/60" />
        
        <div className="absolute right-2 top-1.5 flex items-center gap-1">
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-white/60 hover:text-white"
              onClick={clearSearch}
            >
              Clear
            </Button>
          )}
          <Button 
            type="submit" 
            size="sm" 
            className="h-7 px-3 bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80"
          >
            Search
          </Button>
        </div>
      </form>
      <div className="text-xs text-white/50 mt-1 text-right">
        {searchQuery ? 'Searching for results...' : `${totalBlocksLoaded} blocks loaded`}
      </div>
    </div>
  );
};

export default CurioSearch;
