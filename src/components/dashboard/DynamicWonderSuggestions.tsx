
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface DynamicWonderSuggestionsProps {
  suggestions?: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
  childAge?: number;
  childId?: string;
  childInterests?: string[];
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  suggestions = [],
  onSuggestionClick,
  isLoading,
  childAge = 10,
  childId,
  childInterests
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
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />
          <div className="absolute inset-0 bg-wonderwhiz-gold/20 blur-lg -z-10" />
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent font-nunito">
          {childAge <= 8 ? "What should we explore today?" : "Discover Something Amazing"}
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
                     bg-gradient-to-br from-wonderwhiz-deep-purple/80 via-wonderwhiz-deep-purple/60 to-wonderwhiz-deep-purple/40
                     hover:from-wonderwhiz-purple/80 hover:via-wonderwhiz-purple/60 hover:to-wonderwhiz-purple/40
                     border border-white/10 hover:border-white/20 backdrop-blur-md
                     shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.3)]"
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wonderwhiz-cyan/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <p className="text-lg font-medium text-white/90 relative z-10 font-nunito">
              {suggestion}
            </p>
            
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
              <Sparkles className="h-5 w-5 text-wonderwhiz-gold" />
            </div>
            
            {childAge <= 8 && (
              <div className="absolute top-3 right-3 opacity-30 group-hover:opacity-100 transition-opacity">
                <div className="text-2xl">✨</div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default DynamicWonderSuggestions;
