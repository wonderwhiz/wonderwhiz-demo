
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, History } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UnifiedSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  recentQueries: string[];
  childId: string;
  childProfile: any;
}

const UnifiedSearchBar: React.FC<UnifiedSearchBarProps> = ({
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  recentQueries,
  childId,
  childProfile
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };

  // Handle input focus
  const handleFocus = () => {
    setFocused(true);
    if (query.length === 0 && recentQueries.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setTimeout(() => {
      handleSubmitQuery();
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div className="relative z-10">
      <motion.form
        className="relative"
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative">
          <div className="absolute left-0 inset-y-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-white/40" />
          </div>
          
          <Input
            type="text"
            placeholder="What are you curious about today?"
            className={`pl-12 pr-28 py-6 w-full rounded-full backdrop-blur-sm border 
              ${focused 
                ? "border-wonderwhiz-bright-pink/40 bg-white/5 shadow-sm" 
                : "border-white/10 bg-white/5"} 
              text-white placeholder:text-white/50 transition-all duration-300`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {query && (
            <button
              type="button"
              className="absolute right-24 inset-y-0 flex items-center text-white/40 hover:text-white/60 pr-2"
              onClick={() => setQuery('')}
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <div className="absolute right-3 inset-y-0 flex items-center">
            <Button 
              type="submit" 
              disabled={isGenerating || !query.trim()}
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white font-medium rounded-full px-4 py-1.5 h-auto text-sm"
            >
              {isGenerating ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Explore"
              )}
            </Button>
          </div>
        </div>
      </motion.form>
      
      {/* Simplified suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && focused && recentQueries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-wonderwhiz-deep-purple/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-50"
          >
            <div className="p-3">
              <div className="flex items-center mb-2 text-white/60 text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" />
                <span>Recent</span>
              </div>
              <div className="space-y-1">
                {recentQueries.slice(0, 3).map((item, index) => (
                  <button
                    key={`recent-${index}`}
                    className="w-full text-left px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors text-sm"
                    onClick={() => handleSuggestionClick(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedSearchBar;
