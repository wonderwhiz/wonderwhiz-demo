
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface QuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  onCorrect?: () => void;
  specialistId?: string;
}

const QuizBlock: React.FC<QuizBlockProps> = ({
  question,
  options,
  correctIndex,
  onCorrect,
  specialistId
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionClick = (index: number) => {
    if (answered) return;
    
    setSelectedIndex(index);
    setShowAnswer(true);
    setAnswered(true);
    
    const correct = index === correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      toast.success("Great job! You got it right!");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      if (onCorrect) {
        onCorrect();
      }
    } else {
      toast("That's not right. Try again!");
    }
  };
  
  const resetQuiz = () => {
    setSelectedIndex(null);
    setShowAnswer(false);
    setAnswered(false);
    setIsCorrect(false);
  };
  
  const getSpecialistGradient = () => {
    switch(specialistId) {
      case 'nova':
        return 'from-blue-600/20 to-indigo-600/20 border-blue-500/20';
      case 'spark':
        return 'from-amber-600/20 to-orange-600/20 border-amber-500/20';
      case 'prism':
        return 'from-indigo-600/20 to-purple-600/20 border-indigo-500/20';
      case 'pixel':
        return 'from-cyan-600/20 to-blue-600/20 border-cyan-500/20';
      case 'atlas':
        return 'from-amber-800/20 to-yellow-700/20 border-amber-500/20';
      case 'lotus':
        return 'from-emerald-600/20 to-green-600/20 border-emerald-500/20';
      default:
        return 'from-wonderwhiz-deep-purple/20 to-wonderwhiz-light-purple/20 border-wonderwhiz-light-purple/20';
    }
  };
  
  return (
    <div className={`p-4 border rounded-lg bg-gradient-to-br ${getSpecialistGradient()}`}>
      <h3 className="text-white text-base sm:text-lg font-medium mb-4">{question}</h3>
      
      <div className="space-y-2 sm:space-y-3 mb-4">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`
              w-full text-left p-3 rounded-md border transition-colors
              ${selectedIndex === index 
                ? index === correctIndex 
                  ? 'bg-green-500/20 border-green-500/50 text-white' 
                  : 'bg-red-500/20 border-red-500/50 text-white'
                : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}
              ${answered && index === correctIndex && 'bg-green-500/20 border-green-500/50'}
              ${answered && index !== selectedIndex ? 'opacity-70' : 'opacity-100'}
            `}
            onClick={() => handleOptionClick(index)}
            whileHover={!answered ? { scale: 1.01 } : {}}
            whileTap={!answered ? { scale: 0.99 } : {}}
            disabled={answered}
          >
            <div className="flex items-center">
              <div className="mr-3 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 text-sm sm:text-base">{option}</span>
              
              {answered && index === selectedIndex && (
                <div className={`h-6 w-6 rounded-full flex items-center justify-center ${index === correctIndex ? 'bg-green-500' : 'bg-red-500'}`}>
                  {index === correctIndex ? (
                    <Check className="h-4 w-4 text-white" />
                  ) : (
                    <X className="h-4 w-4 text-white" />
                  )}
                </div>
              )}
              
              {answered && index === correctIndex && index !== selectedIndex && (
                <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
      
      {showAnswer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className={`p-3 rounded-md ${isCorrect ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
        >
          <div className="flex">
            <div className={`h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center mr-2 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
              {isCorrect ? (
                <Check className="h-3 w-3 text-white" />
              ) : (
                <X className="h-3 w-3 text-white" />
              )}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Not quite right'}
              </p>
              <p className="text-white/80 text-xs mt-1">
                {isCorrect 
                  ? "Amazing job! You've earned 3 sparks for your knowledge."
                  : `The correct answer is: ${options[correctIndex]}`
                }
              </p>
            </div>
            
            {isCorrect && (
              <div className="flex items-center ml-2 text-wonderwhiz-gold">
                <Star className="h-4 w-4 mr-1" />
                <span className="text-xs font-medium">+3</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
      
      {answered && !isCorrect && (
        <div className="mt-3 text-right">
          <button
            onClick={resetQuiz}
            className="text-xs text-indigo-400 hover:text-indigo-300 underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizBlock;
