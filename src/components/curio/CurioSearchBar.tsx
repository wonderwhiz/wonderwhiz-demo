
import React, { useState } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface CurioSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  backToDashboard?: () => void;
  isSearching?: boolean;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  query,
  setQuery,
  onSearch,
  backToDashboard,
  isSearching = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isSearching) {
      onSearch();
    }
  };
  
  return (
    <motion.div 
      className="relative z-10 w-full"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        {backToDashboard && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={backToDashboard}
            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-10 w-10 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div 
          className={`
            relative flex flex-1 items-center overflow-hidden transition-all duration-300
            ${isFocused ? 'bg-white/10 shadow-lg ring-1 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/8'}
            rounded-full border border-white/10
          `}
        >
          <Search className="absolute left-3 text-white/60 h-4 w-4" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 100)}
            placeholder="Search in this exploration..."
            className="h-10 w-full pl-10 pr-12 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-sm"
            disabled={isSearching}
          />
          
          {query && (
            <button
              type="button"
              className="absolute right-10 text-white/50 hover:text-white/80 transition-colors"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            type="submit"
            className={`
              absolute right-2 h-6 w-6 flex items-center justify-center rounded-full
              ${isSearching 
                ? 'bg-indigo-600/50 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500'}
              text-white transition-colors
            `}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (
              <div className="h-3 w-3 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <Search className="h-3 w-3" />
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CurioSearchBar;
