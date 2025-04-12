
import React from 'react';
import { motion } from 'framer-motion';
import { Search, X, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CurioPageSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  handleBackToDashboard: () => void;
}

const CurioPageSearch: React.FC<CurioPageSearchProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  handleBackToDashboard
}) => {
  return (
    <motion.div
      className="sticky top-0 z-40 bg-gradient-to-b from-indigo-950/95 to-indigo-950/90 backdrop-blur-md py-3 px-4 border-b border-white/10 shadow-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToDashboard}
          className="bg-white/5 hover:bg-white/10 text-white rounded-full h-9 w-9 flex-shrink-0"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search within this exploration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-2 bg-white/5 hover:bg-white/8 focus:bg-white/10 border-white/10 focus:border-indigo-500/30 text-white placeholder:text-white/50 focus:ring-1 focus:ring-indigo-500/30 rounded-full h-9"
          />
          
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button 
            type="submit" 
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white h-7 w-7 p-0 flex items-center justify-center"
            size="sm"
            aria-label="Search"
          >
            <Search className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default CurioPageSearch;
