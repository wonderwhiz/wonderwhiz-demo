
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CurioSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  placeholder?: string;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  placeholder = "Search within this exploration..."
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  return (
    <form 
      onSubmit={handleSearch} 
      className="relative w-full mb-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative rounded-full overflow-hidden transition-all ${
          isFocused ? 'ring-2 ring-purple-500/30' : ''
        }`}
      >
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-20 py-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center">
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mr-1 text-white/50 hover:text-white/80 p-1"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button
            type="submit"
            size="sm"
            className="rounded-full bg-purple-600 hover:bg-purple-700 px-3 py-1"
            disabled={!searchQuery.trim()}
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>
    </form>
  );
};

export default CurioSearchBar;
