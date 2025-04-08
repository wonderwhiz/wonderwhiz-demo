
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { getBlockTypeColor, getHoverAnimation } from '@/components/BlockStyleUtils';
import { Check, X, HelpCircle, Award, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizBlockProps {
  content: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
  onQuizCorrect?: () => void;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ content, onQuizCorrect }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animateBrain, setAnimateBrain] = useState(false);
  
  const { question, options, correctAnswer, explanation } = content;
  
  const handleSelectOption = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer after submission
    
    setSelectedOption(index);
    
    if (index === correctAnswer) {
      setAnimateBrain(true);
      
      setTimeout(() => {
        // Trigger confetti effect when answer is correct
        confetti({
          particleCount: 80,
          spread: 50,
          origin: { y: 0.6 },
          colors: ['#10b981', '#059669', '#34d399']
        });
        
        if (onQuizCorrect) {
          onQuizCorrect();
        }
      }, 300);
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 500);
  };
  
  return (
    <motion.div 
      className={`relative overflow-hidden ${getHoverAnimation('quiz')}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`p-3 sm:p-4 rounded-lg ${getBlockTypeColor('quiz')}`}>
        <div className="flex mb-3 items-start">
          <div className="mr-3 mt-1 flex-shrink-0">
            <motion.div
              animate={{ 
                scale: animateBrain ? [1, 1.3, 1] : 1,
                rotate: animateBrain ? [0, 10, -10, 0] : 0
              }}
              transition={{ duration: 0.8 }}
              className="h-6 w-6 bg-emerald-500/20 rounded-full flex items-center justify-center"
            >
              <Brain className="w-3.5 h-3.5 text-emerald-400" />
            </motion.div>
          </div>
          <p className="text-white font-medium">{question}</p>
        </div>
        
        <div className="space-y-2 mb-3">
          {options.map((option, index) => (
            <motion.button
              key={`option-${index}`}
              onClick={() => handleSelectOption(index)}
              className={`w-full text-left p-2.5 sm:p-3 rounded-lg flex items-center transition-colors duration-300
                ${selectedOption === null
                  ? 'bg-white/10 hover:bg-white/15 text-white'
                  : selectedOption === index
                    ? index === correctAnswer
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                      : 'bg-red-500/20 text-red-200 border border-red-500/40'
                    : index === correctAnswer && showExplanation
                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                      : 'bg-white/5 text-white/60'
                }
              `}
              disabled={selectedOption !== null}
              whileHover={selectedOption === null ? { scale: 1.02 } : {}}
              whileTap={selectedOption === null ? { scale: 0.98 } : {}}
            >
              <span className="mr-3 flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center bg-white/10">
                {selectedOption !== null && (
                  <>
                    {selectedOption === index ? (
                      index === correctAnswer ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : (
                        <X className="h-4 w-4 text-red-400" />
                      )
                    ) : index === correctAnswer && showExplanation ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <span className="text-xs text-white/70">{String.fromCharCode(65 + index)}</span>
                    )}
                  </>
                )}
                
                {selectedOption === null && (
                  <span className="text-xs text-white/70">{String.fromCharCode(65 + index)}</span>
                )}
              </span>
              <span className="text-sm sm:text-base">{option}</span>
            </motion.button>
          ))}
        </div>
        
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-3 pt-3 border-t border-white/10"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-2">
                  <HelpCircle className="h-4 w-4 text-white/70" />
                </div>
                <div>
                  <p className="text-sm text-white/90">{explanation}</p>
                  
                  {selectedOption === correctAnswer && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-3 flex items-center"
                    >
                      <Award className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                      <span className="text-wonderwhiz-gold text-sm">+5 sparks earned for answering correctly!</span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuizBlock;
