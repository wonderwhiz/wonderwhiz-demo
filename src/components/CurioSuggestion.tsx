
import React from 'react';
import { motion } from 'framer-motion';
import MagicalBorder from './MagicalBorder';

interface CurioSuggestionProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  index: number;
  directGenerate?: boolean;
}

const COLOR_VARIANTS = [
  'rainbow', 'gold', 'purple', 'blue'
];

const CurioSuggestion: React.FC<CurioSuggestionProps> = ({ 
  suggestion, 
  onClick,
  index,
  directGenerate = true 
}) => {
  const colorVariant = COLOR_VARIANTS[index % COLOR_VARIANTS.length];
  
  const handleClick = () => {
    onClick(suggestion);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + (index * 0.1) }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <MagicalBorder 
        active={true} 
        type={colorVariant as 'rainbow' | 'gold' | 'purple' | 'blue'} 
        className="rounded-2xl h-full"
      >
        <button
          onClick={handleClick}
          className="w-full h-full p-4 bg-white/10 text-white text-left rounded-2xl border-white/20 hover:bg-white/20 transition-colors"
        >
          <span className="block font-medium line-clamp-2">{suggestion}</span>
        </button>
      </MagicalBorder>
    </motion.div>
  );
};

export default CurioSuggestion;
