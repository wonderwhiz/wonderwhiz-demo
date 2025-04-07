
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X, Search, Image } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CurioSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (query: string) => void;
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
  onImageUpload
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      handleSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    clearSearch();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
      e.target.value = ''; // Reset for future uploads
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative mb-4 md:mb-5">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isMobile ? "Search..." : "Search through your journey of curiosity..."}
            className={`pr-10 ${isFocused ? 'ring-2 ring-wonderwhiz-bright-pink' : ''} text-wonderwhiz-purple bg-white/20 border-white/20 placeholder:text-white/60`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          <AnimatePresence>
            {searchQuery && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={handleClear}
              >
                <X className="h-5 w-5 text-wonderwhiz-purple/80" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90 text-white w-full sm:w-auto"
            disabled={!searchQuery.trim() || isSearching}
          >
            <Search className="h-5 w-5 mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Search</span>
          </Button>
          
          {onImageUpload && (
            <>
              <Button 
                type="button" 
                className="bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/90 text-white w-full sm:w-auto"
                onClick={handleImageButtonClick}
              >
                <Image className="h-5 w-5 mr-0 sm:mr-2" />
                <span className="hidden sm:inline">Upload</span>
              </Button>
              <input 
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </>
          )}
        </div>
      </form>
      
      {totalBlocksLoaded > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xs text-white/60 mt-1 font-inter"
        >
          {searchQuery ? `Showing results in ${totalBlocksLoaded} blocks` : `${totalBlocksLoaded} blocks loaded`}
        </motion.div>
      )}
    </div>
  );
};

export default CurioSearch;
