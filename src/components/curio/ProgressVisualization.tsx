
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles,
  Trophy,
  Award
} from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number;
  ageGroup?: '5-7' | '8-11' | '12-16';
  totalChapters: number;
  completedChapters: number;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  ageGroup = '8-11',
  totalChapters,
  completedChapters
}) => {
  const progressLabel = 
    progress < 25 ? 'Just beginning' :
    progress < 50 ? 'Making progress' :
    progress < 75 ? 'Well on your way' :
    progress < 100 ? 'Almost complete' :
    'Complete!';

  const progressEmoji = 
    progress < 25 ? '🌱' :
    progress < 50 ? '🌿' :
    progress < 75 ? '🌳' :
    progress < 100 ? '🌟' :
    '🎉';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className={`font-bold text-white ${ageGroup === '5-7' ? 'text-lg' : 'text-base'}`}>
          Your Wonder Progress
        </h3>
        <div className="flex items-center space-x-2">
          {progress >= 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.3 
              }}
            >
              <Trophy className="h-5 w-5 text-yellow-400" />
            </motion.div>
          )}
          {progress >= 75 && progress < 100 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20, 
                delay: 0.3 
              }}
            >
              <Award className="h-5 w-5 text-indigo-400" />
            </motion.div>
          )}
          <div className={`${ageGroup === '5-7' ? 'text-base' : 'text-sm'} font-medium text-white/80`}>
            {completedChapters} of {totalChapters} chapters
          </div>
        </div>
      </div>
      
      <div className="relative h-4 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: 0.5 }}
        />
        
        {progress > 25 && (
          <motion.div 
            className="absolute top-0 right-0 h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
            style={{ right: `${100 - progress}%` }}
          >
            <Sparkles className="h-4 w-4 text-white transform -translate-x-1/2" />
          </motion.div>
        )}
      </div>
      
      <div className="mt-2 flex justify-between items-center">
        <div className={`${ageGroup === '5-7' ? 'text-sm' : 'text-xs'} text-white/60`}>
          {progressLabel}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 260, 
            damping: 20, 
            delay: 0.8 
          }}
          className={`${ageGroup === '5-7' ? 'text-lg' : 'text-base'}`}
        >
          {progressEmoji}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProgressVisualization;
