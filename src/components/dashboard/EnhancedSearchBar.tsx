
import React, { useState, useRef } from 'react';
import { Search, ArrowRight, X, Sparkles } from 'lucide-react';
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
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };

  const clearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleTopicClick = (topic: string) => {
    setQuery(`Tell me about ${topic}`);
    setTimeout(() => {
      handleSubmitQuery();
      setShowSuggestions(false);
    }, 100);
  };

  return (
    <div className="w-full">
      <div className="relative flex w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative flex w-full items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-wonderwhiz-bright-pink/70" />
            
            <Input
              ref={inputRef}
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
              placeholder="What would you like to learn about today?"
              className="h-12 pl-10 pr-10 w-full bg-white/10 border-wonderwhiz-bright-pink/20 text-white placeholder:text-white/50 focus:bg-white/15 focus:border-wonderwhiz-bright-pink/30 transition-all duration-300 rounded-2xl"
            />
            
            <AnimatePresence>
              {query && (
                <motion.button
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ duration: 0.2 }}
                  type="button"
                  onClick={clearInput}
                  className="absolute right-14 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  <X className="h-3 w-3 text-white" />
                </motion.button>
              )}
            </AnimatePresence>
            
            <Button 
              type="submit"
              disabled={!query.trim() || isGenerating}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white h-9 px-4 rounded-xl flex items-center gap-1.5 transition-all shadow-glow-brand-pink"
            >
              {isGenerating ? (
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="h-4 w-4" />
                </motion.div>
              ) : (
                <>
                  <span className="text-sm">Ask</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
      
      {/* Trending Topics */}
      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        {trendingTopics.map((topic, i) => (
          <motion.button
            key={topic}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleTopicClick(topic)}
            className="px-3 py-1 rounded-full bg-wonderwhiz-bright-pink/20 hover:bg-wonderwhiz-bright-pink/30 text-white/80 hover:text-white text-xs flex items-center gap-1 transition-all border border-wonderwhiz-bright-pink/30"
          >
            <span># {topic}</span>
          </motion.button>
        ))}
      </div>
      
      {/* Suggestions */}
      <AnimatePresence>
        {isFocused && showSuggestions && recentQueries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute z-10 left-0 right-0 mt-2 p-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-sm border border-wonderwhiz-bright-pink/20 rounded-xl shadow-lg"
          >
            <div className="text-xs text-white/60 px-2 mb-1.5">Recent questions</div>
            {recentQueries.map((queryText, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 2 }}
                className="px-3 py-2 hover:bg-wonderwhiz-bright-pink/20 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  setQuery(queryText);
                  setTimeout(() => {
                    handleSubmitQuery();
                    setShowSuggestions(false);
                  }, 100);
                }}
              >
                <div className="flex items-center">
                  <Search className="h-3 w-3 mr-2 text-white/50 group-hover:text-wonderwhiz-bright-pink transition-colors" />
                  <span className="text-sm text-white/90 group-hover:text-white">{queryText}</span>
                </div>
              </motion.div>
            ))}
            
            {/* Search with exactly what's typed option */}
            {query && (
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ x: 2 }}
                className="px-3 py-2 mt-1 border-t border-white/10 hover:bg-wonderwhiz-bright-pink/20 rounded-lg cursor-pointer transition-colors group"
                onClick={() => {
                  setTimeout(() => {
                    handleSubmitQuery();
                    setShowSuggestions(false);
                  }, 100);
                }}
              >
                <div className="flex items-center">
                  <ArrowRight className="h-3 w-3 mr-2 text-wonderwhiz-bright-pink group-hover:translate-x-1 transition-transform" />
                  <span className="text-sm text-wonderwhiz-bright-pink">Search for "{query}"</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
