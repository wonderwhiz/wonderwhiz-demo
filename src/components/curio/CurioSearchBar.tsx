
import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getTopicSuggestions, extractTopicFromQuestion } from '@/components/content-blocks/utils/specialistUtils';
import { cn } from '@/lib/utils';

interface CurioSearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: (e: React.FormEvent) => void;
  suggestions?: string[];
  isActive?: boolean;
}

const CurioSearchBar: React.FC<CurioSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  suggestions = [],
  isActive = true
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (dynamicSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    setTimeout(() => setShowSuggestions(false), 200);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    // Submit the form programmatically when a suggestion is clicked
    const form = document.querySelector('form');
    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
  };
  
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(e);
    setShowSuggestions(false);
  };

  // Generate dynamic suggestions based on current search query
  useEffect(() => {
    if (searchQuery.length < 2) {
      setDynamicSuggestions(suggestions);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const topic = extractTopicFromQuestion(query);
    
    // Get suggestions based on the extracted topic
    const topicSuggestions = getTopicSuggestions(topic);
    
    // Create a more narrative/story-based approach to suggestions
    let narrativeSuggestions: string[] = [];
    
    // Add "beginning" narrative suggestions (basic facts)
    if (query.startsWith('what') || query.startsWith('how')) {
      narrativeSuggestions.push(
        `tell me the most fascinating fact about ${topic}`,
        `what's something surprising about ${topic} most people don't know?`
      );
    }
    
    // Add "middle" narrative suggestions (deeper exploration)
    if (query.length > 10) {
      narrativeSuggestions.push(
        `how does ${topic} affect our everyday lives?`,
        `what scientific discoveries changed our understanding of ${topic}?`
      );
    }
    
    // Add "end" narrative suggestions (reflective/connective)
    narrativeSuggestions.push(
      `how might ${topic} change in the future?`,
      `what connections exist between ${topic} and other subjects?`
    );
    
    // Deduplicate and limit suggestions
    const combinedSuggestions = [...topicSuggestions, ...narrativeSuggestions];
    const uniqueSuggestions = Array.from(new Set(combinedSuggestions));
    setDynamicSuggestions(uniqueSuggestions.slice(0, 5));
  }, [searchQuery, suggestions]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSubmitSearch} className="flex items-center gap-2">
        <div className={cn(
          "relative flex-grow group",
          isFocused ? "ring-2 ring-wonderwhiz-bright-pink/50 rounded-full" : "",
        )}>
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4",
            isFocused ? "text-wonderwhiz-bright-pink" : "text-white/40",
            "group-hover:text-white/60 transition-colors"
          )} />
          <Input
            type="text"
            placeholder="What would you like to explore next?"
            className={cn(
              "pl-9 rounded-full bg-white/10 border-wonderwhiz-bright-pink/20 text-white placeholder:text-white/40 font-inter",
              "transition-all duration-300 focus:bg-white/15 focus:border-wonderwhiz-bright-pink/30 focus:ring-wonderwhiz-bright-pink/20"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
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
            className={cn(
              "bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink",
              "text-wonderwhiz-deep-purple font-medium rounded-full px-5 shadow-glow-brand-pink"
            )}
          >
            <span className="mr-1">Explore</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </motion.div>
      </form>
      
      {/* Search suggestions with narrative structure - now optional */}
      <AnimatePresence>
        {showSuggestions && dynamicSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-md border border-wonderwhiz-bright-pink/20 rounded-lg shadow-lg z-10 overflow-hidden"
            variants={containerVariants}
          >
            <div className="p-2">
              {dynamicSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-white/10 text-white/90 hover:text-white flex items-center group transition-colors"
                  onClick={() => handleSuggestionClick(suggestion)}
                  variants={itemVariants}
                  whileHover={{ x: 3 }}
                >
                  <Sparkles className="h-3 w-3 mr-2 text-wonderwhiz-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                  {suggestion}
                </motion.button>
              ))}
              
              {/* Important: Option to use exactly what the user typed */}
              <motion.button
                className="w-full text-left px-3 py-2 mt-1 border-t border-white/10 rounded-md hover:bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink flex items-center group transition-colors"
                onClick={() => {
                  setShowSuggestions(false);
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                  }, 100);
                }}
                variants={itemVariants}
                whileHover={{ x: 3 }}
              >
                <ArrowRight className="h-3.5 w-3.5 mr-2 group-hover:translate-x-1 transition-transform" />
                {searchQuery ? `Search for "${searchQuery}"` : "Use your own search"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CurioSearchBar;
