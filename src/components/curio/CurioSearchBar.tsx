
import React, { useState } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface CurioSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  suggestions?: string[];
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  suggestions = []
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Submit the form programmatically when a suggestion is clicked
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <div className="relative flex-grow group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
          <Input
            type="text"
            placeholder="What would you like to explore?"
            className="pl-9 rounded-full bg-white/10 border-white/20 text-white placeholder:text-white/40 font-inter transition-all duration-300 focus:bg-white/15 focus:border-white/30 focus:ring-white/20"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
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
            className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink text-wonderwhiz-deep-purple font-medium rounded-full px-5"
          >
            <span className="mr-1">Explore</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </form>
      
      {/* Search suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-10 overflow-hidden"
          >
            <div className="p-2">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-white/90 hover:text-white flex items-center group transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 3 }}
                >
                  <Sparkles className="h-3 w-3 mr-2 text-wonderwhiz-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurioSearchBar;
