
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star } from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number;
  ageGroup: '5-7' | '8-11' | '12-16';
  totalChapters: number;
  completedChapters: number;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  ageGroup,
  totalChapters,
  completedChapters
}) => {
  // Generate stars for the space journey
  const stars = Array(20).fill(0).map((_, i) => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    size: Math.random() * 2 + 1,
  }));

  // Different visualizations for different age groups
  const renderAgeAppropriateVisualization = () => {
    switch(ageGroup) {
      case '5-7':
        return (
          <div className="relative h-24 sm:h-32 mb-3">
            {/* Stars background */}
            {stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  repeat: Infinity,
                }}
              />
            ))}
            
            {/* Rocket journey path */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 rounded-full transform -translate-y-1/2" />
            
            {/* Progress line */}
            <motion.div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full transform -translate-y-1/2"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
            
            {/* Moving rocket */}
            <motion.div
              className="absolute top-1/2 transform -translate-y-1/2"
              style={{ left: `${progress}%` }}
              initial={{ left: "0%" }}
              animate={{ left: `${progress}%` }}
              transition={{ duration: 1 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative -ml-4"
              >
                <div className="bg-gradient-to-b from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink p-3 rounded-full">
                  <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-white transform rotate-90" />
                </div>
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-wonderwhiz-bright-pink/40 rounded-full blur-sm"
                  animate={{ opacity: [0.3, 0.6, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </motion.div>
            </motion.div>
          </div>
        );
        
      case '12-16':
        return (
          <div className="mb-3">
            <div className="relative h-6 bg-white/5 rounded-full overflow-hidden mb-2">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                style={{ width: `${progress}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            
            <div className="grid grid-cols-7 gap-2">
              {Array(totalChapters).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className={`h-1 rounded-full ${
                    index < completedChapters 
                      ? 'bg-indigo-500' 
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>
        );
        
      default: // 8-11
        return (
          <div className="relative h-16 sm:h-24 mb-3">
            {/* Stars background */}
            {stars.map((star, i) => (
              <motion.div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  top: star.top,
                  left: star.left,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                animate={{
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  duration: 2,
                  delay: star.delay,
                  repeat: Infinity,
                }}
              />
            ))}
            
            {/* Journey path */}
            <div className="absolute top-1/2 left-0 right-0 h-2 bg-white/10 rounded-full transform -translate-y-1/2" />
            
            {/* Progress stars */}
            <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex justify-between px-1">
              {Array(totalChapters).fill(0).map((_, index) => (
                <div 
                  key={index} 
                  className={`w-4 h-4 rounded-full flex items-center justify-center ${
                    index < completedChapters 
                      ? 'bg-wonderwhiz-bright-pink text-white' 
                      : 'bg-white/10 text-white/30'
                  }`}
                >
                  <Star className="w-3 h-3" />
                </div>
              ))}
            </div>
            
            {/* Progress line */}
            <motion.div 
              className="absolute top-1/2 left-0 h-2 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full transform -translate-y-1/2"
              style={{ width: `${progress}%` }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-semibold text-base sm:text-lg">Progress</h3>
          <div className="text-white/80 text-sm">
            {completedChapters} of {totalChapters} chapters
          </div>
        </div>
        
        {renderAgeAppropriateVisualization()}
        
        <div className="text-center text-white/60 text-xs sm:text-sm">
          {progress < 30 && "Just beginning your journey!"}
          {progress >= 30 && progress < 60 && "Making great progress!"}
          {progress >= 60 && progress < 90 && "Almost there!"}
          {progress >= 90 && "You've mastered this topic!"}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressVisualization;
