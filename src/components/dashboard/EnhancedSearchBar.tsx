
import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Search, Lightbulb, Sparkles, BookOpen } from 'lucide-react';
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
  const [typingAnimation, setTypingAnimation] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  const getRandomInspiration = () => {
    const inspirations = [
      "How do butterflies fly?",
      "Why is the ocean salty?",
      "How do planes stay in the air?",
      "Why do we dream?",
      "How do computers work?",
      "Why do leaves change colors?",
      "How do bees make honey?"
    ];
    return inspirations[Math.floor(Math.random() * inspirations.length)];
  };

  const handleInspirationClick = () => {
    const inspiration = getRandomInspiration();
    setQuery(inspiration);
    
    // Give focus to the input and trigger typing animation
    if (inputRef.current) {
      inputRef.current.focus();
      setTypingAnimation(true);
      
      // Turn off typing animation after 1.5 seconds
      setTimeout(() => setTypingAnimation(false), 1500);
    }
  };

  return (
    <div className="my-2 sm:my-4">
      <div className="flex flex-col relative">
        <motion.div
          className="flex items-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <button 
            onClick={handleInspirationClick}
            className="flex items-center text-white/70 hover:text-wonderwhiz-gold text-sm transition-colors gap-1.5 p-1.5"
          >
            <Lightbulb className="h-4 w-4" />
            <span>Need inspiration?</span>
          </button>
          
          {!isMobile && (
            <span className="text-white/40 text-xs ml-auto">
              Press Enter to search
            </span>
          )}
        </motion.div>
      
        <div className="relative flex-grow">
          <Input 
            ref={inputRef}
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
            className={`
              py-3 sm:py-4 
              bg-white/10 
              border-white/20 
              text-white text-base 
              placeholder:text-white/70 
              focus:ring-2 
              focus:ring-wonderwhiz-bright-pink 
              focus:border-wonderwhiz-vibrant-yellow 
              px-[45px]
              transition-all
              ${typingAnimation ? 'animate-pulse' : ''}
              ${isFocused ? 'ring-2 ring-wonderwhiz-bright-pink border-wonderwhiz-vibrant-yellow' : ''}
            `}
          />
          
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className={`h-5 w-5 ${isFocused ? 'text-wonderwhiz-gold' : 'text-white/70'}`} />
          </div>
          
          <AnimatePresence>
            {query && !isGenerating && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute right-12 top-1/2 -translate-y-1/2"
              >
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 text-white/60 hover:text-white/90"
                  onClick={() => setQuery('')}
                >
                  ×
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          
          <Button 
            type="button" 
            size="icon" 
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 
              h-8 w-8 
              bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 
              text-white rounded-full 
              transition-all duration-300 
              ${!query.trim() || isGenerating ? 'opacity-70 scale-95' : 'scale-100 hover:scale-105'}
            `}
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
      </div>
      
      {/* Query suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && recentQueries.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 left-0 right-0 top-full mt-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-2 text-xs text-white/60 flex items-center border-b border-white/10">
              <BookOpen className="h-3 w-3 mr-1.5" />
              <span>Your recent questions</span>
            </div>
            <div className="py-1 max-h-[220px] overflow-y-auto">
              {recentQueries.map((suggestion, index) => (
                <motion.button
                  key={index}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  className="w-full px-4 py-2.5 text-left text-sm text-white flex items-center gap-2 transition-colors"
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                    // Focus the input again after selection
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                >
                  <Search className="h-3.5 w-3.5 text-white/50 flex-shrink-0" />
                  <span className="line-clamp-1">{suggestion}</span>
                </motion.button>
              ))}
            </div>
            <div className="p-2 border-t border-white/10 bg-white/5">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs text-white/70 hover:text-white/90 hover:bg-white/10"
                onClick={() => setShowSuggestions(false)}
              >
                <Sparkles className="h-3 w-3 mr-1.5" /> 
                <span>Try something new!</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedSearchBar;
