
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
  };
}

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({ content }) => {
  const [flipCard, setFlipCard] = useState(false);
  
  return (
    <div 
      className="flip-card min-h-[120px] sm:min-h-[150px]"
      tabIndex={0}
      onClick={() => setFlipCard(!flipCard)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipCard(!flipCard)}
    >
      <motion.div 
        className={`flip-card-inner ${flipCard ? 'flipped' : ''}`}
        initial={{ rotateY: 0 }}
        animate={{ rotateY: flipCard ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flip-card-front p-4 sm:p-5 bg-gradient-to-br from-white/10 to-white/5 rounded-lg border border-white/10 flex flex-col items-center justify-center">
          <motion.p 
            className="text-white text-center text-sm sm:text-base font-medium"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {content.front}
          </motion.p>
        </div>
        <div className="flip-card-back p-4 sm:p-5 bg-gradient-to-br from-wonderwhiz-purple/30 to-wonderwhiz-purple/10 rounded-lg border border-wonderwhiz-purple/40 flex flex-col items-center justify-center">
          <motion.p 
            className="text-white text-center text-sm sm:text-base"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {content.back}
          </motion.p>
        </div>
      </motion.div>
      <div className="mt-2 text-center">
        <motion.div 
          className="inline-flex items-center justify-center space-x-1 px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <span className="animate-pulse">✨</span>
          <span>Click to flip</span>
        </motion.div>
      </div>
    </div>
  );
};

export default FlashcardBlock;
