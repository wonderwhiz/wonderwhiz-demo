
import React, { useRef, useEffect } from 'react';
import { Search, UploadCloud, X, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

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
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
      // Clear the input value so the same file can be selected again
      e.target.value = '';
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    clearSearch();
  };

  return (
    <div className="mb-5">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          {/* Animated glow effect */}
          <motion.div 
            className="absolute -inset-0.5 bg-gradient-to-r from-[#FF5BA3] to-[#4A6FFF] rounded-full opacity-50 blur-sm group-hover:opacity-75 transition duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            whileHover={{ opacity: 0.75 }}
          />
          
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search in this curio (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#2A1B5D]/70 border-white/10 text-white pl-10 pr-12 py-3 h-12 rounded-full relative font-inter"
            disabled={isSearching}
          />
        </div>
        
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#FF5BA3]" />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {searchQuery && (
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-white/70 hover:text-white hover:bg-[#3D2A7D]/50"
              onClick={handleClearSearch}
              disabled={isSearching}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
          <Button 
            type="submit" 
            size="sm" 
            className="h-8 px-3 bg-gradient-to-r from-[#FF5BA3] to-[#4A6FFF] hover:from-[#FF5BA3]/90 hover:to-[#4A6FFF]/90 text-white rounded-full border-none"
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="h-3 w-3 rounded-full border-2 border-t-transparent border-white animate-spin mr-1"></div>
                Searching...
              </div>
            ) : "Search"}
          </Button>
        </div>
      </form>
      
      <div className="flex justify-between items-center mt-3">
        <div className="text-sm text-white/60 font-inter italic">
          {searchQuery ? (
            isSearching ? 'Searching...' : 'Search results'
          ) : (
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3 w-3 mr-1.5 text-[#FFD54F]" />
              <span>{totalBlocksLoaded} wonders loaded</span>
            </motion.div>
          )}
        </div>
        
        {onImageUpload && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
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
              onClick={triggerFileUpload}
              className="h-10 bg-gradient-to-r from-[#00E2FF] to-[#00D68F] hover:from-[#00E2FF]/90 hover:to-[#00D68F]/90 text-[#2A1B5D] font-medium rounded-full shadow-[0_0_15px_rgba(0,226,255,0.2)] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,226,255,0.4)]"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Image
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CurioSearch;
