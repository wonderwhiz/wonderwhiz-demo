
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FireflyQuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  onAnswerSelected?: (isCorrect: boolean) => void;
  onQuizCorrect?: () => void;
  explanation?: string;
  specialistId: string;  // Added this prop to match how it's used
  childAge?: number;
}

const FireflyQuizBlock: React.FC<FireflyQuizBlockProps> = ({
  question,
  options,
  correctIndex,
  onAnswerSelected,
  explanation,
  onQuizCorrect,
  childAge = 10
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [revealed, setRevealed] = useState(false);
  
  const handleOptionClick = (index: number) => {
    if (selectedIndex !== null) return; // Already answered
    
    setSelectedIndex(index);
    const isCorrect = index === correctIndex;
    
    if (onAnswerSelected) {
      onAnswerSelected(isCorrect);
    }
    
    if (isCorrect && onQuizCorrect) {
      onQuizCorrect();
      toast.success("That's correct! 🎉", {
        duration: 3000
      });
    } else {
      toast.error("That's not right. Try again!", {
        duration: 3000
      });
    }
    
    // Show explanation after a short delay
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };
  
  const handleRevealAnswer = () => {
    setRevealed(true);
    setSelectedIndex(correctIndex);
    setShowExplanation(true);
  };
  
  return (
    <div className="bg-wonderwhiz-purple/30 rounded-xl p-6 my-6">
      <h3 className="text-xl font-bold text-white mb-6">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: selectedIndex === null ? 1.01 : 1 }}
            whileTap={{ scale: selectedIndex === null ? 0.99 : 1 }}
            className={`w-full text-left p-4 rounded-lg transition-colors ${
              selectedIndex === null
                ? 'bg-white/10 hover:bg-white/15 text-white'
                : selectedIndex === index
                  ? index === correctIndex
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                    : 'bg-red-500/20 text-red-200 border border-red-500/30'
                  : index === correctIndex && revealed
                    ? 'bg-green-500/20 text-green-200 border border-green-500/30'
                    : 'bg-white/5 text-white/50'
            }`}
            onClick={() => handleOptionClick(index)}
            disabled={selectedIndex !== null}
          >
            {option}
          </motion.button>
        ))}
      </div>
      
      {!selectedIndex && !revealed && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={handleRevealAnswer}
            className="bg-white/5 hover:bg-white/10 text-white border-white/20"
          >
            Reveal Answer
          </Button>
        </div>
      )}
      
      {(showExplanation || revealed) && explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 bg-white/5 p-4 rounded-lg"
        >
          <h4 className="font-semibold text-white/90 mb-1">Explanation:</h4>
          <p className="text-white/80">{explanation}</p>
        </motion.div>
      )}
    </div>
  );
};

export default FireflyQuizBlock;
