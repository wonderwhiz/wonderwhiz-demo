
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RiddleBlockProps {
  content: {
    riddle: string;
    answer: string;
  };
}

const RiddleBlock: React.FC<RiddleBlockProps> = ({ content }) => {
  const [flipCard, setFlipCard] = useState(false);
  
  return (
    <div>
      <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{content.riddle}</p>
      <Button 
        onClick={() => setFlipCard(!flipCard)}
        variant="outline"
        size="sm"
        className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm h-7 sm:h-9"
      >
        {flipCard ? 'Hide Answer' : 'Reveal Answer'}
      </Button>
      
      {flipCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 sm:mt-3 p-2 sm:p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40"
        >
          <p className="text-white text-xs sm:text-sm">{content.answer}</p>
        </motion.div>
      )}
    </div>
  );
};

export default RiddleBlock;
