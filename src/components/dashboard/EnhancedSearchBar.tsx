
import React, { useState, KeyboardEvent, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface EnhancedSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  recentQueries?: string[];
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({ 
  query, 
  setQuery, 
  handleSubmitQuery, 
  isGenerating,
  recentQueries = []
}) => {
  const isMobile = useIsMobile();
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const placeholders = [
    "How do stars twinkle?",
    "Why is the sky blue?",
    "Can animals talk to each other?",
    "How do volcanoes work?",
    "What makes rainbows appear?",
    "Why do cats purr?"
  ];
  
  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder(prev => (prev + 1) % placeholders.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };

  return (
    <div className="my-2 sm:my-4">
      <div className="relative">
        <Input 
          placeholder={isMobile ? "Ask me anything!" : placeholders[currentPlaceholder]} 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (recentQueries.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          disabled={isGenerating} 
          className="py-3 sm:py-4 bg-white/10 border-white/20 text-white text-base placeholder:text-white/70 focus:ring-2 focus:ring-wonderwhiz-bright-pink focus:border-wonderwhiz-vibrant-yellow px-[40px]" 
        />
        
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Search className="h-5 w-5 text-white/70" />
        </div>
        
        <Button 
          type="button" 
          size="icon" 
          className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white rounded-full transition-all duration-300" 
          disabled={!query.trim() || isGenerating}
          onClick={() => {
            handleSubmitQuery();
            setShowSuggestions(false);
          }}
          aria-label="Submit question"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Query suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && recentQueries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 left-0 right-0 top-full mt-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="py-2 max-h-[200px] overflow-y-auto">
              {recentQueries.map((suggestion, index) => (
                <button
                  key={index}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
