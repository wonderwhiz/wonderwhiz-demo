
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { HelpCircle, Check } from 'lucide-react';

interface RiddleBlockProps {
  content: {
    riddle: string;
    answer: string;
  };
}

const RiddleBlock: React.FC<RiddleBlockProps> = ({ content }) => {
  const [flipCard, setFlipCard] = useState(false);
  const [isRiddleSolved, setIsRiddleSolved] = useState(false);
  
  const handleRevealAnswer = () => {
    setFlipCard(true);
    if (!isRiddleSolved) {
      setTimeout(() => {
        setIsRiddleSolved(true);
      }, 500);
    }
  };
  
  const handleHideAnswer = () => {
    setFlipCard(false);
  };
  
  return (
    <div className="relative">
      <motion.p 
        className="text-white mb-2 sm:mb-3 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.riddle}
      </motion.p>
      
      <div className="flex space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={flipCard ? handleHideAnswer : handleRevealAnswer}
            variant="outline"
            size="sm"
            className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm h-7 sm:h-9 flex items-center"
          >
            {flipCard ? 'Hide Answer' : (
              <>
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Reveal Answer
              </>
            )}
          </Button>
        </motion.div>
      </div>
      
      {flipCard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-2 sm:mt-3 p-2 sm:p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40"
        >
          <p className="text-white text-xs sm:text-sm">{content.answer}</p>
        </motion.div>
      )}
      
      {isRiddleSolved && (
        <motion.div
          className="absolute top-0 right-0 -mr-2 -mt-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
        >
          <motion.div 
            className="bg-green-500 text-white rounded-full p-1"
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Check className="h-4 w-4" />
          </motion.div>
        </motion.div>
      )}
      
      {isRiddleSolved && (
        <motion.div
          className="mt-2 text-green-400 text-xs sm:text-sm flex items-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Check className="h-3.5 w-3.5 mr-1.5" />
          Riddle solved! You're a great thinker!
        </motion.div>
      )}
    </div>
  );
};

export default RiddleBlock;
