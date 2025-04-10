
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  recentQueries?: string[];
  trendingTopics?: string[];
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  recentQueries = [],
  trendingTopics = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setTimeout(() => {
      handleSubmitQuery();
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative flex w-full items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
          
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => {
              setIsFocused(false);
              setShowSuggestions(false);
            }, 200)}
            placeholder="What are you curious about today?"
            className="h-12 pl-10 pr-16 w-full bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-wonderwhiz-bright-pink/30 transition-all duration-300 rounded-full"
          />
          
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-14 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <Button 
            type="submit"
            disabled={!query.trim() || isGenerating}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white h-8 px-4 rounded-full"
          >
            {isGenerating ? (
              <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              "Ask"
            )}
          </Button>
        </div>
      </form>
      
      {/* Trending Topics - Simplified to just a few curated options */}
      {trendingTopics.length > 0 && !isFocused && (
        <div className="mt-3 flex flex-wrap gap-2 justify-center">
          {trendingTopics.slice(0, 3).map((topic, i) => (
            <motion.button
              key={topic}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleTopicClick(topic)}
              className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs transition-all border border-white/10"
            >
              {topic}
            </motion.button>
          ))}
        </div>
      )}
      
      {/* Recent Queries - Simplified dropdown */}
      <AnimatePresence>
        {isFocused && showSuggestions && recentQueries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 left-0 right-0 mt-2 p-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg"
          >
            <div className="text-xs text-white/50 px-2 mb-1">Recent questions</div>
            {recentQueries.slice(0, 3).map((queryText, index) => (
              <motion.div
                key={index}
                className="px-3 py-2 hover:bg-white/5 rounded-lg cursor-pointer transition-colors"
                onClick={() => {
                  setQuery(queryText);
                  setTimeout(() => handleSubmitQuery(), 100);
                }}
              >
                <div className="flex items-center">
                  <Search className="h-3 w-3 mr-2 text-white/30" />
                  <span className="text-sm text-white/80">{queryText}</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
