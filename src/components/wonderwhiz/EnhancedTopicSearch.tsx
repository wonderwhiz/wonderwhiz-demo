
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2, BookOpen, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedTopicSearchProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  childAge: number;
}

const EnhancedTopicSearch: React.FC<EnhancedTopicSearchProps> = ({ onSearch, isLoading, childAge }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const ageAppropriatePrompts = {
    young: [
      'Why do animals have different colors?',
      'How do plants grow from tiny seeds?',
      'What makes the sky blue?',
      'Why do we need to sleep?',
      'How do birds fly in the sky?',
      'What are clouds made of?'
    ],
    middle: [
      'How do volcanoes erupt?',
      'Why do we have different seasons?',
      'How do computers work?',
      'What is gravity and how does it work?',
      'How do animals adapt to their environment?',
      'What causes earthquakes?'
    ],
    older: [
      'How does DNA determine our traits?',
      'What causes climate change?',
      'How do renewable energy sources work?',
      'What is artificial intelligence?',
      'How does the immune system fight diseases?',
      'What are black holes and how do they form?'
    ]
  };

  const getCurrentSuggestions = () => {
    if (childAge <= 7) return ageAppropriatePrompts.young;
    if (childAge <= 11) return ageAppropriatePrompts.middle;
    return ageAppropriatePrompts.older;
  };

  useEffect(() => {
    const saved = localStorage.getItem('wonderwhiz-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 3));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      // Save to recent searches
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 3);
      setRecentSearches(updated);
      localStorage.setItem('wonderwhiz-recent-searches', JSON.stringify(updated));
      
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <BookOpen className="h-10 w-10 text-wonderwhiz-bright-pink" />
          <h1 className="text-4xl font-bold text-white">Wonder Whiz Encyclopedia</h1>
          <Sparkles className="h-10 w-10 text-yellow-400" />
        </div>
        <p className="text-white/80 text-lg">
          Ask me anything! I'll create a personalized encyclopedia just for you! 📚✨
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-6 w-6" />
          <Input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length === 0);
            }}
            placeholder="What would you like to learn about today?"
            className="pl-14 pr-32 py-6 text-xl bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-3xl focus:border-wonderwhiz-bright-pink"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white rounded-2xl px-6 h-12"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Explore!
              </>
            )}
          </Button>
        </div>
      </form>

      <AnimatePresence>
        {showSuggestions && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Recent Explorations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(search)}
                      className="bg-white/5 border-white/20 text-white/80 hover:bg-white/10 hover:text-white text-sm"
                    >
                      {search}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-white/70 text-sm font-medium mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" />
                Perfect for Age {childAge}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getCurrentSuggestions().map((suggestion, index) => (
                  <motion.div
                    key={suggestion}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-all cursor-pointer group"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <p className="text-white/80 group-hover:text-white text-sm">
                        {suggestion}
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-4">
            <Loader2 className="h-6 w-6 animate-spin text-wonderwhiz-bright-pink" />
            <div className="text-left">
              <p className="text-white font-medium">Creating your encyclopedia...</p>
              <p className="text-white/60 text-sm">This might take a moment ✨</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedTopicSearch;
