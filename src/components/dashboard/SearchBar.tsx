
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Hash, Search, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  recentQueries?: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  recentQueries = []
}) => {
  const [showTip, setShowTip] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const tips = [
    "Try asking 'Why is the sky blue?' for a fun explanation!",
    "Ask about animals, space, or dinosaurs to learn cool facts!",
    "You can ask 'How do things work?' for interesting answers!",
    "The more you ask, the more sparks you'll earn!"
  ];
  
  useEffect(() => {
    // Show tip when user hasn't typed anything after a while
    if (!query && !isGenerating) {
      const timer = setTimeout(() => {
        setShowTip(true);
      }, 5000);
      
      return () => clearTimeout(timer);
    } else {
      setShowTip(false);
    }
  }, [query, isGenerating]);
  
  useEffect(() => {
    // Rotate through tips
    const interval = setInterval(() => {
      if (showTip) {
        setTipIndex(prev => (prev + 1) % tips.length);
      }
    }, 8000);
    
    return () => clearInterval(interval);
  }, [showTip, tips.length]);
  
  const getTrendingTopics = () => {
    // This would ideally be fetched from a backend
    return ["dinosaurs", "space", "animals", "robots", "planets"];
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };

  return (
    <div className="relative">
      {/* Trending topics */}
      <div className="flex flex-wrap gap-2 mb-3">
        {getTrendingTopics().map((topic, index) => (
          <motion.button
            key={topic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setQuery(`Tell me about ${topic}`)}
            className="flex items-center text-xs px-3 py-1 rounded-full bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink border border-wonderwhiz-bright-pink/30 hover:bg-wonderwhiz-bright-pink/30 transition-colors"
          >
            <Hash className="h-3 w-3 mr-1" />
            {topic}
          </motion.button>
        ))}
      </div>
      
      {/* Search input */}
      <form onSubmit={handleFormSubmit}>
        <div 
          className={cn(
            "relative bg-white/10 backdrop-blur-md border border-wonderwhiz-bright-pink/20 rounded-full transition-all duration-300 overflow-hidden",
            isSearchFocused ? "ring-2 ring-wonderwhiz-bright-pink/50 border-wonderwhiz-bright-pink/30" : "hover:bg-white/15"
          )}
        >
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you curious about today?"
            disabled={isGenerating}
            className="pr-12 pl-5 py-7 text-base sm:text-lg rounded-full bg-transparent border-0 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
            onFocus={() => {
              setIsSearchFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => {
                setIsSearchFocused(false);
                setShowSuggestions(false);
              }, 200);
            }}
          />
          <motion.button
            type="submit"
            disabled={isGenerating || !query.trim()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink text-wonderwhiz-deep-purple p-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-brand-pink"
          >
            <Search className="h-5 w-5" />
          </motion.button>
        </div>
      </form>
      
      {/* Recent queries */}
      <AnimatePresence>
        {showSuggestions && recentQueries.length > 0 && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-10 left-0 right-0 mt-2 p-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-sm border border-wonderwhiz-bright-pink/20 rounded-xl shadow-lg"
          >
            <div className="text-xs text-white/60 px-2 mb-1.5">Recent questions</div>
            {recentQueries.slice(0, 3).map((recentQuery, index) => (
              <motion.div
                key={`recent-${index}`}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
                className="px-3 py-2 hover:bg-wonderwhiz-bright-pink/20 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  setQuery(recentQuery);
                  setTimeout(() => {
                    handleSubmitQuery();
                    setShowSuggestions(false);
                  }, 100);
                }}
              >
                <div className="flex items-center">
                  <Lightbulb className="h-3 w-3 mr-2 text-white/50 group-hover:text-wonderwhiz-bright-pink transition-colors" />
                  <span className="text-sm text-white/90 group-hover:text-white">
                    {recentQuery.length > 25 ? recentQuery.substring(0, 22) + '...' : recentQuery}
                  </span>
                </div>
              </motion.div>
            ))}
            
            {/* Option to use exactly what was typed */}
            {query && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-2 mt-1 border-t border-white/10 hover:bg-wonderwhiz-bright-pink/20 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  setTimeout(() => {
                    handleSubmitQuery();
                    setShowSuggestions(false);
                  }, 100);
                }}
              >
                <div className="flex items-center">
                  <ArrowRight className="h-3.5 w-3.5 mr-2 text-wonderwhiz-bright-pink group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm text-wonderwhiz-bright-pink">Search for "{query}"</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showTip && !query && !isGenerating && !showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            className="mt-3 px-3.5 py-2.5 bg-wonderwhiz-bright-pink/20 border border-wonderwhiz-bright-pink/30 rounded-lg flex items-center"
          >
            <div className="h-7 w-7 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3 flex-shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-bright-pink" />
            </div>
            <div>
              <p className="text-white/80 text-sm">{tips[tipIndex]}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
