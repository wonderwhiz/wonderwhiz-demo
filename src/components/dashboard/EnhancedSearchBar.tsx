
import React, { useState, KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Lightbulb, Star } from 'lucide-react';
import MagicalBorder from '@/components/MagicalBorder';
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
  
  React.useEffect(() => {
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
    <div className="my-2 sm:my-4 md:my-6 relative">
      <MagicalBorder active={true} type="rainbow" className="rounded-2xl overflow-hidden shadow-lg">
        <div className="relative">
          <motion.div 
            className="absolute -top-1 -left-1 w-10 h-10"
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Star className="h-4 w-4 text-wonderwhiz-gold opacity-70" />
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-1 -right-1 w-10 h-10"
            animate={{ rotate: [0, -15, 15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
          >
            <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow opacity-70" />
          </motion.div>
          
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
            className="py-3 sm:py-4 md:py-6 bg-white/10 border-white/20 text-white text-base sm:text-lg placeholder:text-white/70 placeholder:text-center focus:ring-2 focus:ring-wonderwhiz-bright-pink focus:border-wonderwhiz-vibrant-yellow px-[40px] my-0 font-inter transition-all duration-300" 
          />
          
          <motion.div 
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2"
            animate={
              isGenerating 
              ? { rotate: 360, scale: [1, 1.2, 1] } 
              : { rotate: [0, 15, -15, 0] }
            } 
            transition={
              isGenerating 
              ? { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
              : { repeat: Infinity, duration: 3, ease: "easeInOut" }
            }
          >
            <Lightbulb className={`h-5 w-5 sm:h-6 sm:w-6 ${isGenerating ? 'text-wonderwhiz-bright-pink' : 'text-wonderwhiz-vibrant-yellow'}`} />
          </motion.div>
          
          <Button 
            type="button" 
            size="icon" 
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-white hover:opacity-90 rounded-full shadow-glow-brand-yellow transition-all duration-300" 
            disabled={!query.trim() || isGenerating}
            onClick={() => {
              handleSubmitQuery();
              setShowSuggestions(false);
            }}
            aria-label="Submit question"
          >
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.div>
          </Button>
        </div>
      </MagicalBorder>
      
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
                <motion.button
                  key={index}
                  className="w-full px-4 py-2 text-left text-sm text-white hover:bg-white/10 transition-colors"
                  whileHover={{ x: 6 }}
                  onClick={() => {
                    setQuery(suggestion);
                    setShowSuggestions(false);
                  }}
                >
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

export default EnhancedSearchBar;
