
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { motion } from 'framer-motion';
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <form onSubmit={handleSearch} className="relative">
        <div className={`
          relative overflow-hidden transition-colors duration-200 rounded-full
          ${isFocused ? 'bg-white/10 ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/8'}
          border border-white/10
        `}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="bg-transparent border-0 pl-10 pr-10 py-2 h-10 text-white placeholder:text-white/50 focus:ring-0"
          />
          
          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setSearchQuery('')}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 text-white/50 hover:text-white/80 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default CurioSearchBar;
