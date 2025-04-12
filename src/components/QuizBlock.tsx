
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  onCorrect?: () => void;
  specialistId: string;
}

const QuizBlock: React.FC<QuizBlockProps> = ({
  question,
  options,
  correctIndex,
  onCorrect,
  specialistId
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  
  const handleOptionClick = (index: number) => {
    if (isAnswered) return;
    
    setSelectedIndex(index);
    setIsAnswered(true);
    
    const correct = index === correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      if (onCorrect) onCorrect();
      
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      }, 300);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-white font-medium text-lg">{question}</h3>
      
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isThisOptionCorrect = index === correctIndex;
          
          let optionClasses = "w-full p-3 rounded-lg border border-white/10 text-left flex justify-between items-center transition-all";
          
          if (isAnswered) {
            if (isThisOptionCorrect) {
              optionClasses += " bg-green-500/20 border-green-500/50";
            } else if (isSelected) {
              optionClasses += " bg-red-500/20 border-red-500/50";
            }
          } else {
            optionClasses += " hover:bg-white/10 cursor-pointer bg-white/5";
          }
          
          return (
            <motion.button
              key={index}
              className={optionClasses}
              onClick={() => handleOptionClick(index)}
              whileHover={!isAnswered ? { scale: 1.01 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              disabled={isAnswered}
            >
              <span>{option}</span>
              
              {isAnswered && isThisOptionCorrect && (
                <Check className="text-green-400 h-5 w-5 ml-2" />
              )}
              
              {isAnswered && isSelected && !isThisOptionCorrect && (
                <X className="text-red-400 h-5 w-5 ml-2" />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg ${isCorrect ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}
        >
          <p className="text-white text-sm">
            {isCorrect 
              ? "That's correct! Great job!" 
              : `Oops! That's not quite right. The correct answer is: ${options[correctIndex]}`}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default QuizBlock;
