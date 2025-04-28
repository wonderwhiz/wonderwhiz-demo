
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DynamicWonderSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
  childAge?: number;
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  suggestions,
  onSuggestionClick,
  isLoading,
  childAge = 10
}) => {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-wonderwhiz-gold animate-pulse-soft" />
        <h2 className="text-xl font-bold text-white">
          {childAge <= 8 ? "What should we explore?" : "Discover Something Amazing"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={`${suggestion}-${index}`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestionClick(suggestion)}
            className="relative group p-6 rounded-2xl text-left transition-all duration-300
                     bg-wonder-card hover:bg-wonder-hover border border-white/10 hover:border-white/20
                     backdrop-blur-sm shadow-lg hover:shadow-xl"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wonderwhiz-cyan/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <p className="text-white font-medium relative z-10">
              {suggestion}
            </p>
            
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkles className="h-4 w-4 text-wonderwhiz-gold animate-pulse-slow" />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DynamicWonderSuggestions;
