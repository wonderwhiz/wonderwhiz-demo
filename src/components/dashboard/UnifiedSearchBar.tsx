
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Clock, ArrowRight, Lightbulb, X } from 'lucide-react';
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { cn } from '@/lib/utils';

interface UnifiedSearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: (e?: React.FormEvent) => void;
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
  recentQueries = [],
  childId,
  childProfile
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showCommandDialog, setShowCommandDialog] = useState(false);
  const [activeTimeOfDay, setActiveTimeOfDay] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const {
    recentlyViewedTopics,
    strongestTopics,
    getPersonalizedSuggestions,
    isLoading
  } = useChildLearningHistory(childId);
  
  // Get time-appropriate suggestions
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setActiveTimeOfDay('morning');
    else if (hour < 18) setActiveTimeOfDay('afternoon');
    else setActiveTimeOfDay('evening');
  }, []);
  
  // Intelligent suggestions based on learning history, time of day, and interests
  const getIntelligentSuggestions = () => {
    // Start with personalized suggestions from learning history
    const suggestions = getPersonalizedSuggestions();
    
    // Add time of day context
    const timeBasedSuggestions = [];
    if (activeTimeOfDay === 'morning') {
      timeBasedSuggestions.push("What's something new I could learn today?");
    } else if (activeTimeOfDay === 'afternoon') {
      timeBasedSuggestions.push("What's the most fascinating discovery in science recently?");
    } else {
      timeBasedSuggestions.push("What mysteries of space are scientists still trying to solve?");
    }
    
    // Add interest-based suggestions if available
    const interests = childProfile?.interests || [];
    const interestSuggestions = interests.slice(0, 2).map(interest => 
      `Tell me something amazing about ${interest.toLowerCase()}`
    );
    
    // Combine all suggestions and remove duplicates
    const allSuggestions = [...suggestions, ...timeBasedSuggestions, ...interestSuggestions];
    const uniqueSuggestions = Array.from(new Set(allSuggestions));
    
    return uniqueSuggestions.slice(0, 5);
  };
  
  const intelligentSuggestions = getIntelligentSuggestions();
  
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
    }
  };

  const clearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setTimeout(() => handleSubmit(), 100);
    setShowCommandDialog(false);
  };
  
  // Popular topics based on strongest topics and interests
  const popularTopics = strongestTopics.map(item => item.topic).concat(
    (childProfile?.interests || []).map((interest: string) => interest.toLowerCase())
  ).slice(0, 5);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full max-w-3xl mx-auto mb-8"
    >
      <form onSubmit={(e) => handleSubmit(e)} className="relative">
        <div className="relative z-10">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-white/60" />
          </div>
          
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              setShowCommandDialog(true);
            }}
            placeholder={`What are you curious about${childProfile?.name ? ', ' + childProfile.name : ''}?`}
            className={cn(
              "h-14 pl-12 pr-24 w-full text-lg rounded-2xl border-white/20 backdrop-blur-lg",
              "bg-white/10 text-white placeholder:text-white/50",
              "focus:ring-2 focus:ring-white/30 focus:bg-white/15 transition-all duration-300",
              "shadow-lg shadow-purple-900/20"
            )}
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
                className="absolute right-20 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="h-3.5 w-3.5 text-white" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <Button 
            type="submit"
            disabled={!query.trim() || isGenerating}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 h-10 px-4 rounded-xl flex items-center gap-1.5",
              "bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink",
              "text-wonderwhiz-deep-purple font-medium transition-all"
            )}
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
                <span className="text-sm font-medium">Explore</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>
        </div>
        
        {/* Intelligent search suggestions - directly below search without dialog */}
        <AnimatePresence>
          {isFocused && !showCommandDialog && recentQueries.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute z-20 left-0 right-0 mt-2 p-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg"
            >
              {recentQueries.slice(0, 3).map((recentQuery, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 2 }}
                  className="px-3 py-2 hover:bg-white/10 rounded-lg cursor-pointer transition-colors group"
                  onClick={() => handleSuggestionClick(recentQuery)}
                >
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-2 text-white/50 group-hover:text-wonderwhiz-gold transition-colors" />
                    <span className="text-sm text-white/90 group-hover:text-white">{recentQuery}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
      
      {/* Enhanced search dialog */}
      <CommandDialog open={showCommandDialog} onOpenChange={setShowCommandDialog}>
        <Command className="rounded-lg border-none">
          <CommandInput placeholder={`Discover something amazing${childProfile?.name ? ', ' + childProfile.name : ''}...`} />
          <CommandList>
            <CommandEmpty>No results found. Try something else?</CommandEmpty>
            
            <CommandGroup heading="Personalized for You">
              {intelligentSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={`smart-${index}`}
                  onSelect={() => {
                    handleSuggestionClick(suggestion);
                  }}
                >
                  <Sparkles className="mr-2 h-4 w-4 text-wonderwhiz-gold" />
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandGroup heading="Your Interests">
              {popularTopics.map((topic) => (
                <CommandItem
                  key={topic}
                  onSelect={() => {
                    handleSuggestionClick(`Tell me about ${topic}`);
                  }}
                >
                  <Lightbulb className="mr-2 h-4 w-4 text-wonderwhiz-pink" />
                  {topic}
                </CommandItem>
              ))}
            </CommandGroup>
            
            {recentQueries.length > 0 && (
              <CommandGroup heading="Recent Wonders">
                {recentQueries.slice(0, 3).map((query, index) => (
                  <CommandItem
                    key={`recent-${index}`}
                    onSelect={() => {
                      handleSuggestionClick(query);
                    }}
                  >
                    <Clock className="mr-2 h-4 w-4 text-white/70" />
                    {query}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </motion.div>
  );
};

export default UnifiedSearchBar;
