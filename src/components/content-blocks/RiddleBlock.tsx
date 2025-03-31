
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, Check, Lightbulb } from 'lucide-react';

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
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0 mt-1">
          <motion.div
            className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 flex items-center justify-center"
            animate={{ 
              rotate: [0, 15, -15, 0],
              scale: [1, 1.05, 0.95, 1]
            }}
            transition={{ duration: 5, repeat: Infinity, repeatDelay: 3 }}
          >
            <Lightbulb className="h-3.5 w-3.5 text-white" />
          </motion.div>
        </div>
        <motion.p 
          className="flex-1 text-white mb-2 sm:mb-3 text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content.riddle}
        </motion.p>
      </div>
      
      <div className="flex space-x-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            onClick={flipCard ? handleHideAnswer : handleRevealAnswer}
            variant="outline"
            size="sm"
            className={`text-white text-xs sm:text-sm h-8 sm:h-10 flex items-center rounded-full shadow-md ${
              flipCard 
                ? 'bg-white/20 border-white/30 hover:bg-white/30' 
                : 'bg-gradient-to-r from-purple-500/40 to-purple-700/40 border-purple-500/40 hover:from-purple-500/60 hover:to-purple-700/60'
            }`}
          >
            {flipCard ? (
              'Hide Answer'
            ) : (
              <>
                <HelpCircle className="h-3.5 w-3.5 mr-1.5" />
                Reveal Answer
              </>
            )}
          </Button>
        </motion.div>
      </div>
      
      <AnimatePresence>
        {flipCard && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg border border-purple-500/30"
          >
            <p className="text-white text-sm sm:text-base font-medium">{content.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {isRiddleSolved && (
        <motion.div
          className="absolute top-0 right-0 -mr-2 -mt-2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.3 }}
        >
          <motion.div 
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full p-1.5 shadow-lg"
            animate={{ rotate: [0, 15, 0, -15, 0] }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Check className="h-4 w-4" />
          </motion.div>
        </motion.div>
      )}
      
      {isRiddleSolved && (
        <motion.div
          className="mt-3 text-green-400 text-xs sm:text-sm flex items-center"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Check className="h-3.5 w-3.5 mr-1.5" />
          Riddle solved! You're a great thinker!
          <motion.span
            className="inline-block ml-1.5"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 0.8, 1] }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            🧠✨
          </motion.span>
        </motion.div>
      )}
    </div>
  );
};

export default RiddleBlock;
