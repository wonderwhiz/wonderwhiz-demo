
import React, { useState, useEffect, useCallback } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface MagicalSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  placeholder?: string;
  recentQueries?: string[];
}

// BANNED_TOPICS list to prevent inappropriate suggestions
const BANNED_TOPICS = [
  'chicken',
  'butter',
  'food',
  'recipe',
  'test',
  'temporary',
  'standalone',
  'curio'
];

const MagicalSearchBar: React.FC<MagicalSearchBarProps> = ({
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  placeholder = "What would you like to learn about?",
  recentQueries = []
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Function to validate a suggestion's quality
  const isValidSuggestion = useCallback((suggestion: string): boolean => {
    if (!suggestion) return false;
    
    const lowercased = suggestion.toLowerCase();
    
    // Check against banned topics
    for (const banned of BANNED_TOPICS) {
      if (lowercased.includes(banned)) {
        return false;
      }
    }
    
    // Ensure it's likely a question or educational
    if (suggestion.length < 10) return false;
    
    // Check if it has educational value
    const educationalTerms = [
      'how', 'why', 'what', 'when', 'where', 'who', 'which',
      'learn', 'discover', 'explore', 'understand', 'science', 
      'history', 'animal', 'space', 'earth', 'work', 'function'
    ];
    
    const hasEducationalTerm = educationalTerms.some(term => 
      lowercased.includes(term)
    );
    
    return hasEducationalTerm;
  }, []);
  
  // Use useCallback to prevent regenerating this function on every render
  const generateSuggestions = useCallback((input: string): string[] => {
    const lowercaseInput = input.toLowerCase();
    
    // Simple but effective suggestion system
    if (lowercaseInput.includes('space')) {
      return ['How big is the universe?', 'Why is Mars red?', 'What are black holes?'];
    } else if (lowercaseInput.includes('animal')) {
      return ['Which animal sleeps the most?', 'How do animals communicate?', 'What are the fastest animals?'];
    } else if (lowercaseInput.includes('dinosaur')) {
      return ['When did dinosaurs live?', 'Why did dinosaurs go extinct?', 'Were there flying dinosaurs?'];
    } else if (lowercaseInput.includes('how')) {
      return [`How does ${lowercaseInput.replace('how', '').trim() || 'gravity'} work?`];
    } else if (lowercaseInput.includes('why')) {
      return [`Why do ${lowercaseInput.replace('why', '').trim() || 'rainbows'} exist?`];
    }
    
    return [];
  }, []);
  
  useEffect(() => {
    if (isFocused && query.length > 0) {
      // Filter recent queries that match the current input and are valid
      const matchingQueries = recentQueries
        .filter(q => 
          q.toLowerCase().includes(query.toLowerCase()) && isValidSuggestion(q)
        )
        .slice(0, 3);
      
      // Add intelligent suggestions based on the query
      const intelligentSuggestions = generateSuggestions(query)
        .filter(isValidSuggestion);
      
      // Combine both, remove duplicates, and take up to 5
      const allSuggestions = [...matchingQueries, ...intelligentSuggestions];
      
      // Create a Set to track lowercase suggestions we've already seen
      const seenSuggestions = new Set<string>();
      const uniqueSuggestions = allSuggestions
        .filter(suggestion => {
          const lowercased = suggestion.toLowerCase();
          if (seenSuggestions.has(lowercased) || !isValidSuggestion(suggestion)) return false;
          seenSuggestions.add(lowercased);
          return true;
        })
        .slice(0, 5);
        
      setSuggestions(uniqueSuggestions);
      setShowSuggestions(uniqueSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [query, isFocused, recentQueries, generateSuggestions, isValidSuggestion]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    if (!isGenerating) {
      setTimeout(() => handleSubmitQuery(), 100);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`
            relative flex items-center overflow-hidden transition-all duration-300
            ${isFocused ? 'bg-white/10 shadow-lg ring-2 ring-indigo-500/30' : 'bg-white/5 hover:bg-white/8'}
            rounded-full border border-white/10
          `}
        >
          <Search className="absolute left-4 text-white/60 h-5 w-5" />
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder={placeholder}
            className="h-14 w-full pl-12 pr-32 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-base sm:text-lg"
            disabled={isGenerating}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Button
              type="submit"
              className={`
                h-10 px-4 rounded-full text-white font-medium
                ${isGenerating 
                  ? 'bg-indigo-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'}
              `}
              disabled={isGenerating || !query.trim()}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Exploring...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Explore
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
      
      {/* Intelligent Suggestions */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 mt-2 bg-indigo-900/80 backdrop-blur-md rounded-lg shadow-xl border border-white/10 overflow-hidden z-20"
          >
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <motion.div
                  key={`search-suggestion-${index}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="px-4 py-2 hover:bg-white/10 cursor-pointer transition-colors text-white"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center">
                    <Search className="h-3.5 w-3.5 mr-2 opacity-50" />
                    <span>{suggestion}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MagicalSearchBar;
