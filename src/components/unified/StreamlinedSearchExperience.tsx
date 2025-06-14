
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Zap, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StreamlinedSearchExperienceProps {
  onSearch: (query: string, mode?: 'explore' | 'encyclopedia') => void;
  isLoading?: boolean;
  childAge: number;
  recentTopics?: string[];
  popularTopics?: string[];
}

const StreamlinedSearchExperience: React.FC<StreamlinedSearchExperienceProps> = ({
  onSearch,
  isLoading = false,
  childAge,
  recentTopics = [],
  popularTopics = []
}) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [selectedMode, setSelectedMode] = useState<'explore' | 'encyclopedia'>('explore');
  const inputRef = useRef<HTMLInputElement>(null);

  const quickTopics = childAge <= 7 ? [
    "🦕 Dinosaurs", "🌈 Rainbows", "🐛 Butterflies", "🌙 Moon", "🐠 Ocean Animals"
  ] : childAge <= 11 ? [
    "🚀 Space", "🌋 Volcanoes", "🤖 Robots", "⚡ Electricity", "🧬 DNA"
  ] : [
    "🔬 Quantum Physics", "🧠 Brain Science", "🌍 Climate Change", "💻 AI Technology", "🔬 CRISPR"
  ];

  const handleQuickTopic = (topic: string) => {
    const cleanTopic = topic.replace(/^[^\s]+\s/, ''); // Remove emoji
    setQuery(cleanTopic);
    onSearch(cleanTopic, selectedMode);
    setShowSuggestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), selectedMode);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowSuggestions(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Main Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onFocus={() => !query && setShowSuggestions(true)}
              placeholder="What sparks your curiosity?"
              className="pl-12 pr-32 py-4 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-2xl focus:border-wonderwhiz-bright-pink transition-all duration-300 focus:ring-2 focus:ring-wonderwhiz-bright-pink/20"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedMode(selectedMode === 'explore' ? 'encyclopedia' : 'explore')}
                className={`text-xs px-3 py-1 h-8 rounded-full transition-all ${
                  selectedMode === 'explore' 
                    ? 'bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink' 
                    : 'bg-wonderwhiz-purple/20 text-white/70'
                }`}
              >
                {selectedMode === 'explore' ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Quick
                  </>
                ) : (
                  <>
                    <Zap className="h-3 w-3 mr-1" />
                    Deep
                  </>
                )}
              </Button>
              
              <Button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white rounded-xl px-4 h-8 transition-all duration-200 hover:scale-105 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Quick Discovery */}
      <AnimatePresence>
        {showSuggestions && !query && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 space-y-4"
          >
            {/* Recent Topics */}
            {recentTopics.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">Continue exploring</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentTopics.slice(0, 3).map((topic, index) => (
                    <motion.button
                      key={topic}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleQuickTopic(topic)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-full transition-all duration-200 hover:scale-105"
                    >
                      {topic}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Topics */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-wonderwhiz-bright-pink" />
                <span className="text-sm text-white/80">Quick start</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {quickTopics.map((topic, index) => (
                  <motion.button
                    key={topic}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuickTopic(topic)}
                    className="p-3 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white text-sm rounded-xl transition-all duration-200 hover:scale-105 text-center border border-white/10 hover:border-white/20"
                  >
                    {topic}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamlinedSearchExperience;
