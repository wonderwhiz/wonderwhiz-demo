
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Star } from 'lucide-react';

interface SuggestionsCloudProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
}

const SuggestionsCloud: React.FC<SuggestionsCloudProps> = ({ suggestions, onSuggestionClick }) => {
  // Icons to randomly assign to suggestions
  const icons = [
    <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow" />,
    <Zap className="h-3 w-3 text-wonderwhiz-bright-pink" />,
    <Brain className="h-3 w-3 text-wonderwhiz-cyan" />,
    <Star className="h-3 w-3 text-wonderwhiz-gold" />
  ];
  
  // Positions for floating suggestions
  const getRandomPosition = (index: number) => {
    // Create a semi-circle layout
    const total = suggestions.length;
    const angle = (Math.PI / (total - 1)) * index;
    const radius = 150;
    
    return {
      left: `calc(50% + ${Math.sin(angle) * radius}px)`,
      top: `calc(50% - ${Math.cos(angle) * radius}px)`,
      scale: 0.85 + Math.random() * 0.3,
      rotate: -10 + Math.random() * 20
    };
  };

  return (
    <motion.div 
      className="relative w-full h-60 mt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {suggestions.map((suggestion, index) => {
        const position = getRandomPosition(index);
        
        return (
          <motion.div
            key={`suggestion-${index}`}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: position.left,
              top: position.top,
            }}
            initial={{ 
              opacity: 0,
              scale: 0.5,
              rotate: position.rotate 
            }}
            animate={{ 
              opacity: 1, 
              scale: position.scale,
              rotate: position.rotate,
              y: [0, -5, 0, 5, 0],
            }}
            transition={{
              opacity: { duration: 0.5, delay: 0.1 * index },
              scale: { duration: 0.5, delay: 0.1 * index },
              y: { 
                repeat: Infinity, 
                duration: 4 + Math.random() * 2, 
                ease: "easeInOut",
                delay: index * 0.2 
              }
            }}
            whileHover={{ scale: position.scale * 1.1 }}
            whileTap={{ scale: position.scale * 0.95 }}
          >
            <motion.button
              onClick={() => onSuggestionClick(suggestion)}
              className="text-sm bg-white/10 backdrop-blur-sm hover:bg-white/20 px-4 py-2 rounded-full border border-white/20 text-white shadow-glow-sm flex items-center whitespace-nowrap"
            >
              <span className="mr-1.5">
                {icons[index % icons.length]}
              </span>
              {suggestion}
            </motion.button>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default SuggestionsCloud;
