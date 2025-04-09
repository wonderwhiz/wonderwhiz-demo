
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CurioSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch
}) => {
  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <div className="relative flex-grow group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
        <Input
          type="text"
          placeholder="Search within this exploration..."
          className="pl-9 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15 focus:border-white/30 focus:ring-white/20"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <AnimatePresence>
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white/90"
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          type="submit" 
          className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple font-medium rounded-full"
        >
          Search
        </Button>
      </motion.div>
    </form>
  );
};

export default CurioSearchBar;
