
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import BlockHeader from './BlockHeader';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface QuizBlockProps {
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  specialistId: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onCorrectAnswer?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  onQuizCorrect?: () => void;
  updateHeight?: (height: number) => void;
}

const QuizBlock: React.FC<QuizBlockProps> = ({
  question,
  options,
  correctIndex,
  explanation,
  specialistId,
  onLike,
  onBookmark,
  onReply,
  onCorrectAnswer,
  onRabbitHoleClick,
  onQuizCorrect,
  updateHeight
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const blockRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [question, selectedIndex, showExplanation, updateHeight]);
  
  const handleOptionSelect = (index: number) => {
    if (selectedIndex !== null) return; // Already answered
    
    setSelectedIndex(index);
    const correct = index === correctIndex;
    setIsCorrect(correct);
    
    if (correct) {
      if (onCorrectAnswer) onCorrectAnswer();
      if (onQuizCorrect) onQuizCorrect();
    }
    
    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };
  
  const getOptionClassName = (index: number) => {
    const baseClasses = "w-full text-left p-3.5 rounded-lg transition-colors flex items-center";
    
    if (selectedIndex === null) {
      return `${baseClasses} bg-white/5 hover:bg-white/10 text-white/80`;
    }
    
    if (index === correctIndex) {
      return `${baseClasses} bg-green-500/20 text-green-300 border border-green-500/30`;
    }
    
    if (index === selectedIndex) {
      return `${baseClasses} bg-red-500/20 text-red-300 border border-red-500/30`;
    }
    
    return `${baseClasses} bg-white/5 text-white/50`;
  };
  
  return (
    <Card 
      ref={blockRef}
      className="overflow-hidden bg-white/5 backdrop-blur-sm border-primary/10"
    >
      <BlockHeader 
        type="quiz" 
        specialistId={specialistId} 
        blockTitle="Quiz Question"
      />
      
      <div className="p-4">
        <p className="text-white/90 text-lg font-medium mb-4">{question}</p>
        
        <div className="space-y-3 mb-4">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={selectedIndex === null ? { scale: 1.01 } : {}}
              whileTap={selectedIndex === null ? { scale: 0.99 } : {}}
              className={getOptionClassName(index)}
              onClick={() => handleOptionSelect(index)}
              disabled={selectedIndex !== null}
            >
              {selectedIndex !== null && (
                <span className="mr-2">
                  {index === correctIndex ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : index === selectedIndex ? (
                    <XCircle className="h-5 w-5 text-red-400" />
                  ) : (
                    <div className="w-5" />
                  )}
                </span>
              )}
              <span>{option}</span>
            </motion.button>
          ))}
        </div>
        
        {showExplanation && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 p-4 bg-white/5 rounded-lg"
          >
            <div className="flex items-start">
              <HelpCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
              <p className="text-white/80 text-sm">{explanation}</p>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default QuizBlock;
