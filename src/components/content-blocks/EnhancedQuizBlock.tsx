
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Star } from 'lucide-react';
import { blockContainer } from './utils/blockStyles';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface EnhancedQuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  onCorrect?: () => void;
  childAge?: number;
}

const EnhancedQuizBlock: React.FC<EnhancedQuizBlockProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  onCorrect,
  childAge = 10
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswer = (index: number) => {
    if (selectedIndex !== null) return;
    setSelectedIndex(index);
    
    if (index === correctIndex) {
      if (onCorrect) onCorrect();
      setShowExplanation(true);
      
      // Celebrate correct answer
      confetti({
        particleCount: childAge < 8 ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else {
      setTimeout(() => setShowExplanation(true), 500);
    }
  };

  return (
    <div className={blockContainer({ type: 'quiz', childAge: childAge < 8 ? 'young' : childAge < 12 ? 'middle' : 'older' })}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">{question}</h3>

        <div className="space-y-3">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={selectedIndex === null ? { scale: 1.02 } : {}}
              whileTap={selectedIndex === null ? { scale: 0.98 } : {}}
              onClick={() => handleAnswer(index)}
              disabled={selectedIndex !== null}
              className={`
                w-full text-left p-4 rounded-lg flex items-center space-x-3
                ${selectedIndex === null ? 'bg-white/10 hover:bg-white/20' : 
                  index === correctIndex ? 'bg-green-500/20 border border-green-500/30' :
                  index === selectedIndex ? 'bg-red-500/20 border border-red-500/30' :
                  'bg-white/5'}
                transition-all duration-300
              `}
            >
              {selectedIndex !== null && (
                <span className="flex-shrink-0">
                  {index === correctIndex ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : index === selectedIndex ? (
                    <XCircle className="h-5 w-5 text-red-400" />
                  ) : (
                    <div className="w-5" />
                  )}
                </span>
              )}
              <span className={`flex-grow ${
                childAge && childAge < 8 ? 'text-lg' : 'text-base'
              } text-white/90`}>{option}</span>
            </motion.button>
          ))}
        </div>

        {showExplanation && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-white/10 rounded-lg border border-white/10"
          >
            <div className="flex items-start space-x-3">
              <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow flex-shrink-0 mt-1" />
              <p className="text-white/90">{explanation}</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default EnhancedQuizBlock;
