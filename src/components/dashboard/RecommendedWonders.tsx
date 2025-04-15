
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecommendedWondersProps {
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onRefresh: () => void;
}

const RecommendedWonders: React.FC<RecommendedWondersProps> = ({
  suggestions,
  isLoading,
  onSuggestionClick,
  onRefresh
}) => {
  const cardVariants = [
    "from-indigo-500/20 to-purple-600/30 border-indigo-500/30 hover:border-indigo-400/50",
    "from-emerald-500/20 to-teal-600/30 border-emerald-500/30 hover:border-emerald-400/50",
    "from-pink-500/20 to-rose-600/30 border-pink-500/30 hover:border-pink-400/50",
    "from-amber-500/20 to-orange-600/30 border-amber-500/30 hover:border-amber-400/50",
    "from-blue-500/20 to-cyan-600/30 border-blue-500/30 hover:border-blue-400/50",
    "from-violet-500/20 to-purple-600/30 border-violet-500/30 hover:border-violet-400/50"
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-light-purple/20 border border-wonderwhiz-bright-pink/20">
            <Compass className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          <h3 className="text-lg font-semibold text-white font-nunito">Wonder Journeys</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {isLoading ? (
          // Loading placeholders
          Array.from({ length: 3 }).map((_, index) => (
            <motion.div
              key={`loading-${index}`}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/20 border border-white/10 h-24 rounded-xl backdrop-blur-sm flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow animate-pulse" />
              </div>
            </motion.div>
          ))
        ) : (
          suggestions.slice(0, 3).map((suggestion, index) => (
            <motion.div
              key={`suggestion-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
              onClick={() => onSuggestionClick(suggestion)}
              className="cursor-pointer"
            >
              <div
                className={cn(
                  "bg-gradient-to-br border backdrop-blur-sm shadow-lg p-4 rounded-xl",
                  "hover:shadow-xl transition-all group overflow-hidden",
                  cardVariants[index % cardVariants.length]
                )}
              >
                <div className="flex flex-col h-full justify-between">
                  <p className="text-white group-hover:text-white font-medium line-clamp-2">{suggestion}</p>
                  <div className="flex items-center mt-2 text-xs text-white/70">
                    <Sparkles className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow" />
                    <span className="flex-1">New wonder awaits</span>
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedWonders;
