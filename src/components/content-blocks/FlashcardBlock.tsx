
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, RefreshCw } from 'lucide-react';
import { blockVariants, contentVariants, getBlockStyle } from './utils/blockAnimations';
import { FlashcardBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({
  content,
  specialistId,
  updateHeight,
  childAge = 10
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { textSize, interactionStyle } = useAgeAdaptation(childAge);
  
  // Different button text based on age
  const getButtonText = () => {
    if (childAge <= 7) {
      return isFlipped ? "Show Question!" : "See Answer!";
    } else if (childAge <= 11) {
      return isFlipped ? "Flip to Question" : "Flip to Answer";
    } else {
      return isFlipped ? "Show Question" : "Reveal Answer";
    }
  };

  return (
    <motion.div
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`bg-gradient-to-br ${getBlockStyle('flashcard')} p-6 rounded-xl shadow-lg backdrop-blur-sm border border-white/10`}
    >
      <div className="flex items-start space-x-4">
        <div className="bg-wonderwhiz-vibrant-yellow/20 p-2 rounded-full">
          <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
        </div>
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={isFlipped ? 'back' : 'front'}
              initial={{ opacity: 0, rotateX: -90 }}
              animate={{ opacity: 1, rotateX: 0 }}
              exit={{ opacity: 0, rotateX: 90 }}
              transition={{ duration: 0.3 }}
              className="min-h-[120px]"
            >
              <div className={`bg-white/10 rounded-lg p-4 ${childAge <= 7 ? 'border-2 border-white/20' : ''}`}>
                <h3 className={`text-white/90 font-medium mb-2 ${textSize}`}>
                  {isFlipped ? 'Answer:' : 'Question:'}
                </h3>
                <p className={`text-white/80 ${textSize}`}>
                  {isFlipped ? content.back : content.front}
                </p>
                {content.hint && !isFlipped && childAge <= 11 && (
                  <div className="mt-3 text-white/60 text-sm italic">
                    <span className="font-medium">Hint:</span> {content.hint}
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsFlipped(!isFlipped)}
            className={`mt-4 w-full py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors ${
              childAge <= 7 ? 'text-lg border-2 border-white/10' : ''
            } ${interactionStyle}`}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            <span>{getButtonText()}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FlashcardBlock;
