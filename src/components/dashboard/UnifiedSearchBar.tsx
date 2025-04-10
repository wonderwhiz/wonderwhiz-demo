
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Sparkles, History, TrendingUp } from 'lucide-react';
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

  // Sample trending topics - in a real implementation, these would come from an API
  const trendingTopics = [
    "Why is the sky blue?",
    "How do planes fly?",
    "What makes rainbows?",
    "How do volcanoes work?",
    "Why do seasons change?"
  ];

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
    if (query.length === 0 && (recentQueries.length > 0 || trendingTopics.length > 0)) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => {
      setFocused(false);
      setShowSuggestions(false);
    }, 200);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowSuggestions(value.length === 0 && (recentQueries.length > 0 || trendingTopics.length > 0));
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
            className={`pl-12 pr-32 py-7 w-full rounded-xl backdrop-blur-sm border 
              ${focused 
                ? "border-wonderwhiz-bright-pink/60 bg-white/10 shadow-glow-sm shadow-wonderwhiz-bright-pink/20" 
                : "border-white/20 bg-white/5"} 
              text-white placeholder:text-white/50 transition-all duration-300`}
            value={query}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          
          {query && (
            <button
              type="button"
              className="absolute right-24 inset-y-0 flex items-center text-white/60 hover:text-white/80 pr-2"
              onClick={() => setQuery('')}
            >
              <X className="h-5 w-5" />
            </button>
          )}
          
          <div className="absolute right-3 inset-y-0 flex items-center">
            <Button 
              type="submit" 
              disabled={isGenerating || !query.trim()}
              className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-medium"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-wonderwhiz-deep-purple border-t-transparent rounded-full"></div>
                  <span>Exploring...</span>
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span>Explore</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.form>
      
      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && (focused || showSuggestions) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute mt-2 w-full bg-wonderwhiz-deep-purple/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg overflow-hidden z-50"
          >
            {recentQueries.length > 0 && (
              <div className="p-3">
                <div className="flex items-center mb-2 text-white/60 text-xs">
                  <History className="h-3.5 w-3.5 mr-1.5" />
                  <span>Recent Searches</span>
                </div>
                <div className="space-y-1">
                  {recentQueries.map((item, index) => (
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
            )}
            
            {trendingTopics.length > 0 && (
              <div className="p-3 border-t border-white/10">
                <div className="flex items-center mb-2 text-white/60 text-xs">
                  <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
                  <span>Trending Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {trendingTopics.map((topic, index) => (
                    <button
                      key={`trend-${index}`}
                      className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white text-xs"
                      onClick={() => handleSuggestionClick(topic)}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UnifiedSearchBar;
