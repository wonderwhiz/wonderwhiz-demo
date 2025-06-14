import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

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
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[#9b87f5] font-bold text-lg">{question}</h3>
      <div className="space-y-2">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isThisOptionCorrect = index === correctIndex;
          let optionClasses =
            "w-full p-3 rounded-lg border text-left flex justify-between items-center transition-all text-[#252238]";
          if (isAnswered) {
            if (isThisOptionCorrect) {
              optionClasses += " bg-[#F2FCE2] border-green-500/70";
            } else if (isSelected) {
              optionClasses += " bg-[#FFDEE2] border-[#F97316]/40";
            }
          } else {
            optionClasses += " hover:bg-[#F97316]/10 cursor-pointer bg-[#F1F0FB]";
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
                <Check className="text-green-600 h-5 w-5 ml-2" />
              )}
              {isAnswered && isSelected && !isThisOptionCorrect && (
                <X className="text-[#F97316] h-5 w-5 ml-2" />
              )}
            </motion.button>
          );
        })}
      </div>
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-3 rounded-lg mt-4 ${
            isCorrect
              ? 'bg-[#F2FCE2] border border-green-500/30'
              : 'bg-[#FFDEE2] border border-[#F97316]/30'
          }`}
        >
          <p className="text-[#252238] text-sm">
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
