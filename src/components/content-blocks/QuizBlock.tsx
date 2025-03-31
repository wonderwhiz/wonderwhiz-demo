
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

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

  const handleQuizOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);
    
    const isCorrect = idx === content.correctIndex;
    if (isCorrect && onQuizCorrect) {
      onQuizCorrect();
    }
  };

  return (
    <div>
      <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{content.question}</p>
      <div className="space-y-1.5 sm:space-y-2">
        {content.options.map((option: string, idx: number) => (
          <button
            key={idx}
            onClick={() => handleQuizOptionSelect(idx)}
            disabled={quizSubmitted}
            className={`w-full p-2 sm:p-3 rounded-lg text-left transition-colors ${
              quizSubmitted
                ? idx === content.correctIndex
                  ? 'bg-green-500/20 border border-green-500'
                  : idx === selectedQuizOption
                    ? 'bg-red-500/20 border border-red-500'
                    : 'bg-white/5 border border-white/10'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center">
              <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 text-xs sm:text-sm font-medium border border-white/20 flex-shrink-0 text-white">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-xs sm:text-sm text-white">{option}</span>
            </div>
          </button>
        ))}
      </div>
      
      {quizSubmitted && (
        <p className={`mt-2 sm:mt-3 text-xs sm:text-sm ${
          selectedQuizOption === content.correctIndex 
            ? 'text-green-400' 
            : 'text-red-400'
        }`}>
          {selectedQuizOption === content.correctIndex 
            ? 'Correct! You earned 5 sparks!' 
            : `Not quite! The correct answer is: ${content.options[content.correctIndex]}`
          }
        </p>
      )}
    </div>
  );
};

export default QuizBlock;
