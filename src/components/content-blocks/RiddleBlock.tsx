
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Lightbulb } from 'lucide-react';
import { blockVariants, contentVariants, getBlockStyle } from './utils/blockAnimations';

interface RiddleBlockProps {
  content: {
    riddle: string;
    answer: string;
    question: string;
    hint: string;
  };
  specialistId: string;
  updateHeight?: (height: number) => void;
  childAge?: number;
}

const RiddleBlock: React.FC<RiddleBlockProps> = ({
  content,
  specialistId,
  updateHeight,
  childAge = 10
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Get age-appropriate button and text styling
  const getButtonStyle = () => {
    if (childAge <= 7) {
      return "bg-wonderwhiz-bright-pink/30 hover:bg-wonderwhiz-bright-pink/40 text-lg py-4";
    } else if (childAge <= 11) {
      return "bg-wonderwhiz-bright-pink/20 hover:bg-wonderwhiz-bright-pink/30 text-base py-3";
    } else {
      return "bg-wonderwhiz-bright-pink/20 hover:bg-wonderwhiz-bright-pink/30 text-sm py-3";
    }
  };

  return (
    <motion.div
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-wonderwhiz-purple/30"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-wonderwhiz-bright-pink/20 p-2 rounded-full">
          <HelpCircle className="h-5 w-5 text-wonderwhiz-bright-pink" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-3">{content.question}</h3>
          <motion.p variants={contentVariants} className="text-white/90 leading-relaxed">
            {content.riddle}
          </motion.p>

          <div className="mt-4 space-y-3">
            {!showAnswer && content.hint && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowHint(!showHint)}
                className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-lg text-white flex items-center justify-center space-x-2 transition-colors"
              >
                <Lightbulb className="h-4 w-4" />
                <span>{showHint ? "Hide Hint" : "Need a Hint?"}</span>
              </motion.button>
            )}

            {showHint && !showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 p-4 rounded-lg"
              >
                <p className="text-white/80">{content.hint}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAnswer(!showAnswer)}
              className={`w-full rounded-lg text-white flex items-center justify-center space-x-2 transition-colors ${getButtonStyle()}`}
            >
              {showAnswer ? "Hide Answer" : "Show Answer"}
            </motion.button>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-wonderwhiz-bright-pink/10 p-4 rounded-lg border border-wonderwhiz-bright-pink/20"
              >
                <p className="text-white/90">{content.answer}</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RiddleBlock;
