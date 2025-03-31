
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Star } from 'lucide-react';

interface QuizBlockProps {
  content: {
    question: string;
    options: string[];
    correctIndex: number;
  };
  onQuizCorrect?: () => void;
}

const QuizBlock: React.FC<QuizBlockProps> = ({ content, onQuizCorrect }) => {
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleQuizOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);
    
    const isCorrect = idx === content.correctIndex;
    if (isCorrect) {
      setShowConfetti(true);
      if (onQuizCorrect) {
        onQuizCorrect();
      }
    }
  };

  return (
    <div>
      <div className="space-y-3 sm:space-y-4">
        {content.options.map((option: string, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.4 }}
            whileHover={{ scale: quizSubmitted ? 1 : 1.02 }}
          >
            <button
              onClick={() => handleQuizOptionSelect(idx)}
              disabled={quizSubmitted}
              className={`group w-full p-3 sm:p-4 rounded-lg text-left transition-all ${
                quizSubmitted
                  ? idx === content.correctIndex
                    ? 'bg-gradient-to-r from-green-500/20 to-green-400/20 border border-green-500'
                    : idx === selectedQuizOption
                      ? 'bg-gradient-to-r from-red-500/20 to-red-400/20 border border-red-500'
                      : 'bg-white/5 border border-white/10'
                  : 'bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center">
                <motion.span 
                  className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full flex items-center justify-center mr-3 text-sm sm:text-base font-medium border flex-shrink-0 ${
                    quizSubmitted && idx === content.correctIndex
                      ? 'bg-green-500 border-green-600 text-white'
                      : quizSubmitted && idx === selectedQuizOption && idx !== content.correctIndex
                        ? 'bg-red-500 border-red-600 text-white'
                        : 'border-white/20 group-hover:border-white/40 text-white'
                  }`}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {String.fromCharCode(65 + idx)}
                </motion.span>
                <span className="text-sm sm:text-base text-white">{option}</span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
      
      {quizSubmitted && (
        <motion.div 
          className={`mt-3 sm:mt-4 p-3 rounded-lg ${
            selectedQuizOption === content.correctIndex 
              ? 'bg-green-500/10' 
              : 'bg-red-500/10'
          }`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          {selectedQuizOption === content.correctIndex ? (
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <div>
                <p className="text-green-400 text-sm font-medium">Correct!</p>
                <div className="flex items-center text-white/80 text-xs mt-1">
                  <Star className="h-4 w-4 fill-wonderwhiz-gold text-wonderwhiz-gold mr-1.5" /> 
                  <span>You earned 5 sparks!</span>
                  {showConfetti && (
                    <motion.span 
                      className="ml-2"
                      initial={{ opacity: 0, scale: 0, rotate: -45 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0], 
                        scale: [0, 1.5, 1.2, 0], 
                        rotate: [-45, 0, 15, 30] 
                      }}
                      transition={{ duration: 1.5, times: [0, 0.2, 0.8, 1] }}
                    >
                      ✨
                    </motion.span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-red-400 text-sm">Not quite!</p>
              <p className="text-white/80 text-xs mt-1">
                The correct answer is: <span className="font-medium text-green-400">{content.options[content.correctIndex]}</span>
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default QuizBlock;
