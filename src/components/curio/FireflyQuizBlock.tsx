
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, HelpCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import SpecialistAvatar from '@/components/SpecialistAvatar';
import confetti from 'canvas-confetti';

interface FireflyQuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  specialistId?: string;
  childAge?: number;
  onCorrect?: () => void;
}

const FireflyQuizBlock: React.FC<FireflyQuizBlockProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  specialistId = 'prism',
  childAge = 10,
  onCorrect
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attemptsRemaining, setAttemptsRemaining] = useState(childAge < 8 ? 3 : 1);

  const handleOptionSelect = (index: number) => {
    if (selectedIndex !== null && !showExplanation) return;
    
    setSelectedIndex(index);
    const correct = index === correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      // Celebrate correct answers
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      toast.success('Correct answer! 🎉', {
        duration: 2000
      });
      
      if (onCorrect) {
        onCorrect();
      }
      
      // Show explanation after a short delay for correct answers
      setTimeout(() => {
        setShowExplanation(true);
      }, 700);
    } else {
      // Decrement attempts for incorrect answers
      setAttemptsRemaining(prev => Math.max(0, prev - 1));
      
      if (attemptsRemaining <= 1) {
        // If this was the last attempt, show the explanation
        setTimeout(() => {
          setShowExplanation(true);
        }, 700);
      } else {
        toast.error(`Not quite! Try again. (${attemptsRemaining - 1} attempts left)`, {
          duration: 2000
        });
      }
    }
  };
  
  const resetQuiz = () => {
    setSelectedIndex(null);
    setShowExplanation(false);
    setIsCorrect(null);
    setAttemptsRemaining(childAge < 8 ? 3 : 1);
  };

  const getOptionClassName = (index: number) => {
    const baseClasses = "w-full text-left p-4 rounded-xl transition-colors flex items-center mb-3";
    
    if (selectedIndex === null) {
      return `${baseClasses} bg-white/10 hover:bg-white/15 text-white border border-white/10`;
    }
    
    if (showExplanation && index === correctIndex) {
      return `${baseClasses} bg-green-500/20 text-green-100 border border-green-500/30`;
    }
    
    if (index === selectedIndex) {
      return isCorrect
        ? `${baseClasses} bg-green-500/20 text-green-100 border border-green-500/30`
        : `${baseClasses} bg-red-500/20 text-red-100 border border-red-500/30`;
    }
    
    return `${baseClasses} bg-white/5 text-white/60 border border-white/5`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <div className="rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <SpecialistAvatar specialistId={specialistId} size="lg" />
            
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white font-nunito">Quiz Challenge</h3>
                <div className="ml-2 bg-wonderwhiz-bright-pink/20 px-2 py-0.5 rounded-full">
                  <span className="text-xs text-wonderwhiz-bright-pink font-medium">
                    {childAge < 8 ? 'Easy' : childAge < 12 ? 'Medium' : 'Advanced'}
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/70 font-inter">Test your knowledge</p>
            </div>
          </div>

          <div className="text-white font-inter leading-relaxed mb-6">
            <p className="text-lg font-medium">{question}</p>
          </div>

          <div className="space-y-1">
            {Array.isArray(options) && options.length > 0 ? (
              options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedIndex === null ? 1.01 : 1 }}
                  whileTap={{ scale: selectedIndex === null ? 0.99 : 1 }}
                  className={getOptionClassName(index)}
                  onClick={() => handleOptionSelect(index)}
                  disabled={showExplanation || (selectedIndex !== null && attemptsRemaining === 0)}
                >
                  {/* Fancy option labels for younger kids */}
                  {childAge < 10 && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3 text-sm font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                  )}
                  
                  <span>{option}</span>
                  
                  {/* Show indicators for selected/correct answers */}
                  {selectedIndex !== null && (
                    <div className="ml-auto">
                      {showExplanation && index === correctIndex && (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                      {selectedIndex === index && !isCorrect && (
                        <XCircle className="h-5 w-5 text-red-400" />
                      )}
                    </div>
                  )}
                </motion.button>
              ))
            ) : (
              <div className="p-4 bg-white/10 rounded-lg text-white/70">
                No options available for this quiz
              </div>
            )}
          </div>

          {showExplanation && explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-white/10 rounded-xl"
            >
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-wonderwhiz-cyan mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-white font-medium mb-1">Explanation</h4>
                  <p className="text-white/90 text-sm">{explanation}</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={resetQuiz}
                  className="bg-white/10 hover:bg-white/20 text-white"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </motion.div>
          )}
          
          {selectedIndex !== null && !isCorrect && attemptsRemaining === 0 && !showExplanation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center"
            >
              <Button
                onClick={() => setShowExplanation(true)}
                className="bg-wonderwhiz-light-purple hover:bg-wonderwhiz-purple text-white"
              >
                See Correct Answer
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FireflyQuizBlock;
