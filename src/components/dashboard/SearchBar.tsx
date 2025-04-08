
import React, { useState, useEffect } from 'react';
import EnhancedSearchBar from './EnhancedSearchBar';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, TrendingUp } from 'lucide-react';

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

  return (
    <div className="relative">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center">
          <Lightbulb className="h-4 w-4 text-wonderwhiz-gold mr-1.5" />
          <span className="text-white/80 text-sm font-medium">Ask me anything!</span>
        </div>
        
        <div className="flex items-center">
          <TrendingUp className="h-3.5 w-3.5 text-white/50 mr-1.5" />
          <span className="text-white/50 text-xs">Trending:</span>
          <div className="flex ml-1.5 space-x-1.5">
            {getTrendingTopics().map(topic => (
              <button 
                key={topic}
                className="text-white/60 hover:text-wonderwhiz-gold text-xs transition-colors"
                onClick={() => {
                  setQuery(`Tell me about ${topic}`);
                  setTimeout(() => handleSubmitQuery(), 300);
                }}
              >
                #{topic}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <EnhancedSearchBar
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={handleSubmitQuery}
        isGenerating={isGenerating}
        recentQueries={recentQueries}
      />
      
      <AnimatePresence>
        {showTip && !query && !isGenerating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3 }}
            className="mt-3 px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center"
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
