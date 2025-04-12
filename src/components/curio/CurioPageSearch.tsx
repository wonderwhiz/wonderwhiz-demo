
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
      className="sticky top-0 z-40 bg-gradient-to-r from-indigo-950/95 to-purple-950/95 backdrop-blur-sm py-3 px-4 border-b border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBackToDashboard}
          className="mr-2 sm:mr-4 bg-white/5 border-white/10 hover:bg-white/10 text-white w-fit"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="text-sm">Back</span>
        </Button>
        
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          <Input
            type="text"
            placeholder="Search within this exploration..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 py-2 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/30 focus:ring-1 focus:ring-purple-500/50 rounded-full"
          />
          
          {searchQuery && (
            <button 
              type="button" 
              className="absolute right-14 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button 
            type="submit" 
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-purple-600 hover:bg-purple-700 text-white h-8 px-3"
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
