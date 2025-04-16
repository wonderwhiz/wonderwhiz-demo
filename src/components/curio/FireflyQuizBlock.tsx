
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Award, Brain, VolumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface FireflyQuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  onComplete?: () => void;
  childAge?: number;
  onReadAloud?: (text: string) => void;
}

const FireflyQuizBlock: React.FC<FireflyQuizBlockProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  onComplete,
  childAge = 10,
  onReadAloud
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (index: number) => {
    if (selectedIndex !== null) return; // Already answered
    
    setSelectedIndex(index);
    const correct = index === correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      // Celebration animation for correct answer
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 }
      });
      
      toast.success(
        childAge < 8 ? "Great job! That's correct! 🎉" : "Correct answer! 🎉",
        { duration: 3000 }
      );
      
      if (onComplete) {
        onComplete();
      }
    } else {
      toast.error(
        childAge < 8 ? "Not quite right. Try again!" : "That's not correct. Try again!",
        { duration: 3000 }
      );
    }
    
    // Show explanation after answer
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };
  
  const handleReadAloud = () => {
    if (onReadAloud) {
      onReadAloud(question + ". " + options.join(". ") + (showExplanation ? ". " + explanation : ""));
    }
  };
  
  const getQuestionText = () => {
    if (childAge < 8) {
      // Simpler language for younger children
      return question.replace(/(\?|\.|\!)+$/, '') + "?";
    }
    return question;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-indigo-800/20 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-cyan/5 to-wonderwhiz-bright-pink/5 pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-10 w-10 bg-gradient-to-br from-wonderwhiz-cyan to-wonderwhiz-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-brand-cyan">
              <Brain className="h-5 w-5 text-white" />
            </div>
            
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white font-nunito">Quiz Challenge</h3>
                <div className="ml-2 bg-wonderwhiz-cyan/20 px-2 py-0.5 rounded-full text-xs text-wonderwhiz-cyan font-medium hidden sm:block">
                  Test your knowledge
                </div>
              </div>
              
              <div className="mt-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  className="text-white/70 hover:text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10 p-1 h-auto"
                >
                  <VolumeIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">Read aloud</span>
                </Button>
                <p className="text-sm text-white/70 font-inter">
                  {childAge < 8 ? "Choose the right answer!" : "Select the correct option"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white text-lg font-medium mb-4 font-nunito">
              {getQuestionText()}
            </p>
            
            <div className="space-y-3">
              {options.map((option, idx) => (
                <motion.button
                  key={idx}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-3 ${
                    selectedIndex === idx
                      ? idx === correctIndex
                        ? 'bg-green-500/20 border-green-500/50 text-white'
                        : 'bg-red-500/20 border-red-500/50 text-white'
                      : 'bg-white/10 hover:bg-white/20 border-white/10 text-white'
                  }`}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedIndex !== null}
                  whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
                  whileTap={selectedIndex === null ? { scale: 0.98 } : {}}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                    selectedIndex === idx
                      ? idx === correctIndex
                        ? 'bg-green-500 text-white'
                        : 'bg-red-500 text-white'
                      : 'bg-white/20 text-white'
                  }`}>
                    {selectedIndex === idx ? (
                      idx === correctIndex ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )
                    ) : (
                      <span>{String.fromCharCode(65 + idx)}</span>
                    )}
                  </div>
                  <span>{option}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow flex-shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1 font-nunito">
                      {isCorrect
                        ? childAge < 8
                          ? "You got it right!"
                          : "Correct Answer Explanation"
                        : childAge < 8
                        ? "Let's learn more!"
                        : "Explanation"
                      }
                    </h4>
                    <p className="text-white/90 font-inter text-sm">
                      {explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default FireflyQuizBlock;
