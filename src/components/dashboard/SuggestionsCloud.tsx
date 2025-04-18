
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SuggestionsCloudProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
}

const SuggestionsCloud: React.FC<SuggestionsCloudProps> = ({ 
  suggestions, 
  onSuggestionClick,
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <motion.div 
        className="flex justify-center items-center mt-6 h-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center text-white/60">
          <Sparkles className="animate-pulse h-4 w-4 mr-2" />
          <span>Gathering wonder...</span>
        </div>
      </motion.div>
    );
  }
  
  if (!suggestions || suggestions.length === 0) {
    return null;
  }
  
  // Different sizes for visual interest
  const getSizeClass = (index: number) => {
    const patterns = ['text-sm', 'text-base', 'text-lg'];
    return patterns[index % patterns.length];
  };
  
  // Different colors for visual interest
  const getColorClass = (index: number) => {
    const patterns = [
      'text-wonderwhiz-gold hover:text-wonderwhiz-gold/90',
      'text-wonderwhiz-bright-pink hover:text-wonderwhiz-bright-pink/90',
      'text-wonderwhiz-cyan hover:text-wonderwhiz-cyan/90',
      'text-indigo-400 hover:text-indigo-300'
    ];
    return patterns[index % patterns.length];
  };
  
  // Different animation delays
  const getDelay = (index: number) => {
    return index * 0.1;
  };
  
  // Calculate positions in a circular/cloud pattern
  const getPosition = (index: number, total: number) => {
    // This creates a somewhat random but balanced distribution
    const angle = (index / total) * Math.PI * 2;
    const radius = 100 + Math.random() * 50; // Varying radius for more natural look
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * (radius * 0.6); // Elliptical shape
    
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`,
      transform: 'translate(-50%, -50%)'
    };
  };

  return (
    <motion.div 
      className="relative h-48 mt-6 overflow-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      {/* Central sparkle */}
      <motion.div
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/40"
        initial={{ scale: 0.8 }}
        animate={{ 
          scale: [0.8, 1.1, 0.8],
          rotate: [0, 180, 360]
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <Sparkles className="h-8 w-8" />
      </motion.div>
      
      {/* Suggestions */}
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={`${suggestion}-${index}`}
          className={`absolute whitespace-nowrap rounded-full px-3 py-1 font-medium ${getSizeClass(index)} ${getColorClass(index)} bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors`}
          style={getPosition(index, suggestions.length)}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.4, 
            delay: getDelay(index) 
          }}
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
};

export default SuggestionsCloud;
