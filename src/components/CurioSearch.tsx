
import React, { useRef, useEffect } from 'react';
import { Search, UploadCloud } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CurioSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (value: string) => void;
  clearSearch: () => void;
  isSearching: boolean;
  totalBlocksLoaded: number;
  onImageUpload?: (file: File) => void;
}

const CurioSearch: React.FC<CurioSearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  clearSearch,
  isSearching,
  totalBlocksLoaded,
  onImageUpload,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
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
            disabled={isSearching}
          >
            Search
          </Button>
        </div>
      </form>
      
      <div className="flex justify-between items-center mt-2">
        <div className="text-xs text-white/50">
          {searchQuery ? (
            isSearching ? 'Searching...' : 'Search results'
          ) : (
            `${totalBlocksLoaded} blocks loaded`
          )}
        </div>
        
        {onImageUpload && (
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*"
              className="hidden" 
            />
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              onClick={triggerFileUpload}
              className="h-8 bg-wonderwhiz-purple/20 border-wonderwhiz-purple/40 text-white hover:bg-wonderwhiz-purple/30"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurioSearch;
