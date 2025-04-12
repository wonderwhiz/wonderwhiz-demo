
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';

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
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return 'from-emerald-500 to-sky-500 border-emerald-500/30';
      case '12-16':
        return 'from-purple-600 to-indigo-600 border-purple-500/30';
      default: // 8-11
        return 'from-indigo-600 to-purple-600 border-indigo-500/30';
    }
  };
  
  const gradientStyle = getAgeGroupStyles();
  
  return (
    <motion.div 
      className="mb-6 bg-white/5 rounded-lg border border-white/10 p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <div className="flex items-center mb-2">
        <h3 className="text-white text-sm font-medium">Your Progress</h3>
        <div className="ml-auto flex items-center text-white/60 text-xs">
          <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-gold" />
          <span>{completedChapters} of {totalChapters} chapters completed</span>
        </div>
      </div>
      
      <div className="w-full h-2.5 bg-white/10 rounded-full mb-2 overflow-hidden">
        <motion.div 
          className={`h-full rounded-full bg-gradient-to-r ${gradientStyle}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      
      {progress >= 85 && (
        <motion.div 
          className="mt-3 flex items-center text-wonderwhiz-gold text-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="h-5 w-5 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center mr-2">
            <Trophy className="h-3 w-3 text-wonderwhiz-gold" />
          </div>
          <span>Amazing job! You've nearly completed this learning journey!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressVisualization;
