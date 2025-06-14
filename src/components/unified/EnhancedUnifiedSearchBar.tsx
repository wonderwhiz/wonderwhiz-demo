
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, BookOpen, Mic, Camera, Loader2, Lightbulb, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

interface EnhancedUnifiedSearchBarProps {
  onSearch: (query: string, mode?: 'explore' | 'encyclopedia') => void;
  isLoading?: boolean;
  childAge: number;
  placeholder?: string;
}

const EnhancedUnifiedSearchBar: React.FC<EnhancedUnifiedSearchBarProps> = ({
  onSearch,
  isLoading = false,
  childAge,
  placeholder = "What do you want to learn about?"
}) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'explore' | 'encyclopedia'>('explore');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getSmartSuggestions = (input: string) => {
    const baseSuggestions = childAge <= 7 ? [
      "How do butterflies get their colors?",
      "Why do we need to sleep?",
      "What makes rainbows appear?",
      "How do plants grow so tall?",
      "Why is the ocean blue?"
    ] : childAge <= 11 ? [
      "How does gravity work in space?",
      "What happens inside a volcano?",
      "How do computers think?",
      "Why do some animals glow?",
      "How does electricity power our homes?"
    ] : [
      "How does CRISPR gene editing work?",
      "What are quantum computers?",
      "How do neural networks learn?",
      "What causes climate change?",
      "How does cryptocurrency work?"
    ];

    if (!input.trim()) return baseSuggestions.slice(0, 3);
    
    return baseSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase())
    ).slice(0, 5);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length > 1) {
        setSuggestions(getSmartSuggestions(query));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
      setIsTyping(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, childAge]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsTyping(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), mode);
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    onSearch(suggestion, mode);
    setQuery('');
  };

  const handleFocus = () => {
    if (query.length > 1) {
      setShowSuggestions(true);
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow clicking on them
    setTimeout(() => setShowSuggestions(false), 150);
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6"
      >
        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <Button
            variant={mode === 'explore' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('explore')}
            className={mode === 'explore' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
            }
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Quick Explore
          </Button>
          <Button
            variant={mode === 'encyclopedia' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setMode('encyclopedia')}
            className={mode === 'encyclopedia' 
              ? "bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90" 
              : "text-white/70 hover:text-white hover:bg-white/10"
            }
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Deep Dive
          </Button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={placeholder}
              className="pl-14 pr-32 py-6 text-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:border-wonderwhiz-bright-pink transition-all duration-300"
              disabled={isLoading}
            />
            
            {/* Typing indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute right-36 top-1/2 transform -translate-y-1/2"
                >
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-wonderwhiz-bright-pink rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-wonderwhiz-bright-pink rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-wonderwhiz-bright-pink rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Mic className="h-5 w-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                <Camera className="h-5 w-5" />
              </Button>
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white rounded-xl px-6 h-10 transition-all duration-200 hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    {mode === 'explore' ? <Sparkles className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                    {mode === 'explore' ? 'Explore!' : 'Learn!'}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Mode Description */}
        <div className="mt-3 text-center">
          <p className="text-white/60 text-sm">
            {mode === 'explore' 
              ? "✨ Quick exploration with interactive content blocks"
              : "📚 Deep encyclopedia with structured learning sections"
            }
          </p>
        </div>
      </motion.div>

      {/* Smart Suggestions */}
      <AnimatePresence>
        {showSuggestions && suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 z-50"
          >
            <Card className="bg-white/95 backdrop-blur-md border border-white/20 p-4 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-4 w-4 text-wonderwhiz-bright-pink" />
                <span className="text-sm font-medium text-wonderwhiz-purple">Smart Suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left p-3 rounded-lg hover:bg-wonderwhiz-purple/10 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-4 w-4 text-wonderwhiz-bright-pink opacity-60 group-hover:opacity-100 transition-opacity" />
                      <span className="text-wonderwhiz-purple group-hover:text-wonderwhiz-bright-pink transition-colors">
                        {suggestion}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedUnifiedSearchBar;
