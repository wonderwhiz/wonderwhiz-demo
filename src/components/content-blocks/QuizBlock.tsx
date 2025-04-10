
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import BlockHeader from './BlockHeader';

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
  updateHeight
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [updateHeight, selectedIndex, showExplanation]);
  
  const handleOptionClick = (index: number) => {
    if (selectedIndex !== null) return;
    
    setSelectedIndex(index);
    
    if (index === correctIndex) {
      setShowExplanation(true);
      onCorrectAnswer?.();
    } else {
      setShowExplanation(true);
    }
  };
  
  return (
    <Card 
      ref={blockRef}
      className="overflow-hidden bg-white/5 backdrop-blur-sm border-primary/10"
    >
      <BlockHeader 
        type="quiz" 
        specialistId={specialistId}
      />
      
      <div className="p-4">
        <h3 className="text-white font-medium text-base sm:text-lg mb-3">{question}</h3>
        
        <div className="space-y-2 mt-4">
          {options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: selectedIndex === null ? 1.01 : 1 }}
              whileTap={{ scale: selectedIndex === null ? 0.99 : 1 }}
              className={`w-full text-left p-3 rounded-lg transition-colors flex items-center justify-between ${
                selectedIndex === null 
                  ? 'bg-white/10 hover:bg-white/15 cursor-pointer' 
                  : selectedIndex === index
                    ? index === correctIndex
                      ? 'bg-green-500/20 border border-green-500/40'
                      : 'bg-red-500/20 border border-red-500/40'
                    : index === correctIndex && showExplanation
                      ? 'bg-green-500/20 border border-green-500/40'
                      : 'bg-white/5 opacity-60'
              }`}
              onClick={() => handleOptionClick(index)}
              disabled={selectedIndex !== null}
            >
              <span className="text-white/90">{option}</span>
              
              {selectedIndex !== null && (
                index === correctIndex ? (
                  <Check className="h-5 w-5 text-green-400" />
                ) : selectedIndex === index ? (
                  <X className="h-5 w-5 text-red-400" />
                ) : null
              )}
            </motion.button>
          ))}
        </div>
        
        {showExplanation && explanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-4 p-3 bg-white/5 rounded-lg"
          >
            <p className="text-white/80 text-sm leading-relaxed">{explanation}</p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default QuizBlock;
