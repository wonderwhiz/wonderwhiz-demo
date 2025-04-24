
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, Award, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAgeAdaptation, getAnimationSettings } from '@/hooks/useAgeAdaptation';
import AccessibleBlockWrapper from './AccessibleBlockWrapper';
import EnhancedBlockInteractions from './EnhancedBlockInteractions';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface EnhancedQuizBlockProps {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  specialistId: string;
  blockId?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onQuizCorrect?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
  childAge?: number;
  liked?: boolean;
  bookmarked?: boolean;
  relatedQuestions?: string[];
}

const EnhancedQuizBlock: React.FC<EnhancedQuizBlockProps> = ({
  id,
  question,
  options = [],
  correctIndex,
  explanation,
  specialistId,
  blockId,
  difficulty = 'medium',
  onLike,
  onBookmark,
  onReply,
  onQuizCorrect,
  onRabbitHoleClick,
  updateHeight,
  childAge = 10,
  liked = false,
  bookmarked = false,
  relatedQuestions = []
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const { 
    textSize, 
    headingSize,
    animationLevel, 
    visualAids 
  } = useAgeAdaptation(childAge);
  
  const animationSettings = getAnimationSettings(childAge);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedIndex(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setAnimating(false);
  }, [question, options, correctIndex]);
  
  const handleOptionSelect = (index: number) => {
    if (selectedIndex !== null || animating) return; // Already answered or animating
    
    setSelectedIndex(index);
    const correct = index === correctIndex;
    setIsCorrect(correct);
    setAnimating(true);
    
    if (correct) {
      // Update streak and trigger celebration for streak milestones
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      if (newStreak % 3 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
      
      if (onQuizCorrect) onQuizCorrect();
      
      // Show success animation and then explanation
      triggerSuccessFeedback(childAge);
      
      setTimeout(() => {
        setAnimating(false);
        setShowExplanation(true);
      }, 800);
    } else {
      // Reset streak on wrong answer
      setStreak(0);
      
      // For incorrect answers, show explanation slightly faster
      setTimeout(() => {
        setAnimating(false);
        setShowExplanation(true);
      }, 500);
    }
  };
  
  const triggerSuccessFeedback = (age: number) => {
    // Different success feedback based on age
    if (age <= 8) {
      // More confetti for younger kids
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5733', '#33FFF5', '#FF33F5', '#F5FF33']
      });
      
      toast.success("🎉 Great job! You got it right!", {
        duration: 3000,
      });
    } else if (age <= 12) {
      // Medium celebration
      confetti({
        particleCount: 70,
        spread: 50,
        origin: { y: 0.6 }
      });
      
      toast.success("Correct answer! Well done!", {
        duration: 2000,
      });
    } else {
      // Subtle celebration for teens
      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.6 },
        colors: ['#4F46E5', '#0EA5E9']
      });
      
      toast.success("Correct!", {
        duration: 1500,
      });
    }
  };
  
  const getOptionClassName = (index: number) => {
    const baseClasses = `w-full text-left p-3.5 rounded-lg transition-all flex items-center ${textSize}`;
    
    // Different styles based on whether an answer is selected and the age of the user
    if (selectedIndex === null) {
      // Not answered yet
      if (childAge <= 8) {
        return `${baseClasses} bg-white/10 hover:bg-white/15 border-2 border-white/20 hover:border-white/30`;
      } else {
        return `${baseClasses} bg-white/5 hover:bg-white/10 text-white/80`;
      }
    }
    
    // Answer selected, show results
    if (index === correctIndex) {
      return `${baseClasses} bg-green-500/20 text-green-300 border ${childAge <= 8 ? 'border-2' : 'border'} border-green-500/40`;
    }
    
    if (index === selectedIndex) {
      return `${baseClasses} bg-red-500/20 text-red-300 border ${childAge <= 8 ? 'border-2' : 'border'} border-red-500/40`;
    }
    
    return `${baseClasses} bg-white/5 text-white/50`;
  };
  
  // Get difficulty color
  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };
  
  const getExplanationStyle = () => {
    if (isCorrect === null) return '';
    return isCorrect 
      ? 'bg-green-500/10 border border-green-500/20' 
      : 'bg-red-500/10 border border-red-500/20';
  };

  const difficultyColor = getDifficultyColor();
  
  return (
    <AccessibleBlockWrapper
      childAge={childAge}
      type="quiz"
      title={question}
      specialist={specialistId}
      updateHeight={updateHeight}
      accessibilityLabel={`Quiz question: ${question}`}
    >
      <div className="p-5">
        {/* Quiz Header with Difficulty */}
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-white font-medium ${headingSize}`}>
            {childAge <= 8 ? "Quiz Time!" : "Quiz"}
          </h3>
          <div className={`flex items-center ${difficultyColor}`}>
            {difficulty === 'easy' && (
              <>
                <Star className="fill-current h-4 w-4" />
                <span className="ml-1 text-xs">{childAge <= 8 ? "Easy" : "Easy"}</span>
              </>
            )}
            {difficulty === 'medium' && (
              <>
                <div className="flex">
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                </div>
                <span className="ml-1 text-xs">{childAge <= 8 ? "Medium" : "Medium"}</span>
              </>
            )}
            {difficulty === 'hard' && (
              <>
                <div className="flex">
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                  <Star className="fill-current h-4 w-4" />
                </div>
                <span className="ml-1 text-xs">{childAge <= 8 ? "Tricky!" : "Hard"}</span>
              </>
            )}
          </div>
        </div>
        
        {/* Question */}
        <p className={`${textSize} text-white/90 font-medium mb-4`}>
          {question || "Quiz Question"}
        </p>
        
        {/* Options */}
        <div className="space-y-3 mb-4">
          {Array.isArray(options) && options.length > 0 ? (
            options.map((option, index) => (
              <motion.button
                key={index}
                whileHover={selectedIndex === null ? { scale: 1.01 } : {}}
                whileTap={selectedIndex === null ? { scale: 0.99 } : {}}
                animate={selectedIndex === index && isCorrect ? {
                  scale: [1, 1.05, 1],
                  transition: { duration: 0.5 }
                } : {}}
                className={getOptionClassName(index)}
                onClick={() => handleOptionSelect(index)}
                disabled={selectedIndex !== null}
                aria-label={`Option ${index + 1}: ${option}`}
              >
                {selectedIndex !== null && (
                  <span className="mr-2 flex-shrink-0">
                    {index === correctIndex ? (
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    ) : index === selectedIndex ? (
                      <XCircle className="h-5 w-5 text-red-400" />
                    ) : (
                      <div className="w-5" />
                    )}
                  </span>
                )}
                
                {childAge <= 8 && selectedIndex === null && (
                  <span className="mr-2 h-5 w-5 rounded-full bg-white/20 flex-shrink-0 text-center text-xs flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </span>
                )}
                
                <span>{option}</span>
              </motion.button>
            ))
          ) : (
            <div className="p-3 bg-white/5 rounded-lg text-white/60">
              No options available for this quiz
            </div>
          )}
        </div>
        
        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mt-4 p-4 rounded-lg ${getExplanationStyle()}`}
            >
              <div className="flex items-start">
                <HelpCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                <p className={`text-white/80 ${childAge && childAge <= 8 ? 'text-base' : 'text-sm'}`}>
                  {explanation}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Streak Counter */}
        {streak > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-white/60">Streak</span>
              <span className="text-xs font-medium text-yellow-400">{streak} correct</span>
            </div>
            <Progress 
              value={(streak % 3) * 33.33} 
              max={100} 
              className="h-1 bg-white/10" 
            />
          </div>
        )}
        
        {/* Celebration for milestone streaks */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="mt-4 p-3 rounded-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-400 mr-2" />
                  <div>
                    <p className="font-medium text-yellow-300">
                      {childAge <= 8 ? "Amazing Streak!" : "Quiz Streak!"}
                    </p>
                    <p className="text-xs text-white/70">
                      {streak} correct answers in a row!
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-white/60" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Block Interactions */}
        <EnhancedBlockInteractions
          id={id}
          liked={liked}
          bookmarked={bookmarked}
          type="quiz"
          onToggleLike={onLike}
          onToggleBookmark={onBookmark}
          onReply={onReply}
          onRabbitHoleClick={onRabbitHoleClick}
          relatedQuestions={relatedQuestions}
          childAge={childAge}
        />
      </div>
    </AccessibleBlockWrapper>
  );
};

export default EnhancedQuizBlock;
