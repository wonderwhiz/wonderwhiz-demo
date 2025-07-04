import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Target } from 'lucide-react';

interface InteractiveProgressBarProps {
  currentSection: number;
  totalSections: number;
  completedSections: number[];
  childAge?: number;
  onSectionClick?: (index: number) => void;
}

const InteractiveProgressBar: React.FC<InteractiveProgressBarProps> = ({
  currentSection,
  totalSections,
  completedSections,
  childAge = 10,
  onSectionClick
}) => {
  const isYoungChild = childAge <= 8;
  const progress = (completedSections.length / totalSections) * 100;

  const getIconForSection = (index: number) => {
    if (completedSections.includes(index)) {
      return <Star className="h-4 w-4 fill-current" />;
    } else if (index === currentSection) {
      return <Target className="h-4 w-4" />;
    } else if (index === totalSections - 1) {
      return <Trophy className="h-3 w-3" />;
    }
    return <div className="w-2 h-2 rounded-full bg-current" />;
  };

  const getSectionState = (index: number) => {
    if (completedSections.includes(index)) return 'completed';
    if (index === currentSection) return 'current';
    if (index <= currentSection) return 'available';
    return 'locked';
  };

  return (
    <div className={`w-full ${isYoungChild ? 'p-4' : 'p-3'} bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-bold text-gray-900 ${isYoungChild ? 'text-lg' : 'text-base'}`}>
          {isYoungChild ? "🚀 Your Adventure Progress" : "Learning Progress"}
        </h3>
        <div className={`text-right ${isYoungChild ? 'text-base' : 'text-sm'}`}>
          <div className="font-bold text-wonderwhiz-bright-pink">
            {Math.round(progress)}%
          </div>
          <div className="text-gray-600 text-xs">
            {isYoungChild ? "Done!" : "Complete"}
          </div>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink via-wonderwhiz-purple to-wonderwhiz-vibrant-yellow rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Floating progress text */}
        {progress > 10 && (
          <motion.div
            className="absolute top-0 bg-white text-wonderwhiz-bright-pink font-bold text-xs px-2 py-1 rounded-full shadow-md"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: -8 }}
            style={{ left: `${Math.min(progress - 5, 85)}%` }}
          >
            {completedSections.length}/{totalSections}
          </motion.div>
        )}
      </div>

      {/* Interactive Section Dots */}
      <div className="flex items-center justify-between gap-2">
        {Array.from({ length: totalSections }).map((_, index) => {
          const state = getSectionState(index);
          const isClickable = onSectionClick && (state === 'completed' || state === 'current' || state === 'available');
          
          return (
            <motion.button
              key={index}
              onClick={() => isClickable && onSectionClick(index)}
              disabled={!isClickable}
              className={`
                relative flex items-center justify-center rounded-full transition-all duration-200
                ${isYoungChild ? 'w-10 h-10' : 'w-8 h-8'}
                ${state === 'completed' 
                  ? 'bg-green-500 text-white shadow-lg hover:shadow-xl' 
                  : state === 'current'
                  ? 'bg-wonderwhiz-bright-pink text-white shadow-lg animate-pulse'
                  : state === 'available'
                  ? 'bg-wonderwhiz-purple/70 text-white hover:bg-wonderwhiz-purple hover:shadow-md'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
                ${isClickable ? 'hover:scale-110 cursor-pointer' : ''}
              `}
              whileHover={isClickable ? { scale: 1.1 } : {}}
              whileTap={isClickable ? { scale: 0.95 } : {}}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", stiffness: 150 }}
            >
              {getIconForSection(index)}
              
              {/* Current section pulse ring */}
              {state === 'current' && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-wonderwhiz-bright-pink"
                  animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Encouragement Text */}
      {isYoungChild && (
        <motion.div
          className="mt-3 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-gray-600 font-medium">
            {progress < 25 ? "🌟 Great start! Keep going!" :
             progress < 50 ? "🚀 You're doing amazing!" :
             progress < 75 ? "⭐ Almost there, superstar!" :
             progress < 100 ? "🏆 So close to finishing!" :
             "🎉 You did it! Amazing work!"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InteractiveProgressBar;