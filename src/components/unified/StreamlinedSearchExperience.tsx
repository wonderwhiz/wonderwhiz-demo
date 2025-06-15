
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Sparkles, Rocket, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import QuickDiscoveryCards from './QuickDiscoveryCards';

interface StreamlinedSearchExperienceProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  childAge: number;
  recentTopics: any[];
}

const StreamlinedSearchExperience: React.FC<StreamlinedSearchExperienceProps> = ({
  onSearch,
  isLoading,
  childAge,
  recentTopics
}) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
      setQuery('');
      inputRef.current?.blur();
    }
  };

  const handleQuickSearch = (topic: string) => {
    onSearch(topic);
  };

  const isYoungChild = childAge <= 8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="space-y-8"
    >
      {/* Enhanced Search Bar */}
      <Card className="bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-xl border-2 border-white/30 p-2 shadow-2xl overflow-hidden relative">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <motion.div
            animate={{ 
              x: ['-100%', '100%'],
              opacity: [0, 0.5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent transform skew-x-12"
          />
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <motion.div
                animate={isFocused ? { 
                  boxShadow: [
                    "0 0 0 0 rgba(192, 0, 106, 0)",
                    "0 0 0 4px rgba(192, 0, 106, 0.3)",
                    "0 0 0 0 rgba(192, 0, 106, 0)"
                  ]
                } : {}}
                transition={{ duration: 2, repeat: isFocused ? Infinity : 0 }}
                className="relative"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/70 z-10" />
                <Input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={isYoungChild 
                    ? "What do you want to learn about? 🌟" 
                    : "What sparks your curiosity today? ✨"
                  }
                  className="pl-12 pr-4 py-4 bg-white/10 border-2 border-white/20 text-white text-lg placeholder:text-white/60 focus:border-wonderwhiz-bright-pink/60 focus:bg-white/15 rounded-2xl font-medium shadow-inner backdrop-blur-sm transition-all duration-300"
                  disabled={isLoading}
                />
              </motion.div>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="px-6 py-4 bg-gradient-to-r from-wonderwhiz-bright-pink via-purple-500 to-wonderwhiz-vibrant-yellow hover:from-wonderwhiz-bright-pink/90 hover:via-purple-500/90 hover:to-wonderwhiz-vibrant-yellow/90 text-white font-bold text-lg rounded-2xl shadow-xl border-2 border-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                size="lg"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="flex items-center gap-2"
                  >
                    <Sparkles className="h-5 w-5" />
                    <span>Creating...</span>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5" />
                    <span>Explore!</span>
                  </div>
                )}
              </Button>
            </motion.div>
          </div>
        </form>
      </Card>

      {/* Quick Start Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <Zap className="h-7 w-7 text-wonderwhiz-vibrant-yellow drop-shadow-lg" />
          </motion.div>
          <h3 className="text-2xl font-bold text-white drop-shadow">
            {isYoungChild ? "🚀 Quick Adventures" : "⚡ Quick Start"}
          </h3>
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Star className="h-6 w-6 text-wonderwhiz-bright-pink drop-shadow-lg" />
          </motion.div>
        </div>

        <QuickDiscoveryCards
          onCardSelect={handleQuickSearch}
          childAge={childAge}
          recentExplorations={recentTopics}
        />
      </motion.div>
    </motion.div>
  );
};

export default StreamlinedSearchExperience;
