
import React from 'react';
import { motion } from 'framer-motion';
import { Rocket, Star, Medal } from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number; // 0-100
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
  // Different styles based on age group
  const getProgressStyles = () => {
    if (ageGroup === '5-7') {
      return {
        mainColor: 'text-wonderwhiz-vibrant-yellow',
        bgColor: 'bg-wonderwhiz-vibrant-yellow/20',
        icon: <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />,
        size: 'h-4',
        pathStyle: 'dotted'
      };
    } else if (ageGroup === '12-16') {
      return {
        mainColor: 'text-wonderwhiz-cyan',
        bgColor: 'bg-wonderwhiz-cyan/20',
        icon: <Medal className="h-5 w-5 text-wonderwhiz-cyan" />,
        size: 'h-3',
        pathStyle: 'solid'
      };
    } else {
      return {
        mainColor: 'text-wonderwhiz-bright-pink',
        bgColor: 'bg-wonderwhiz-bright-pink/20',
        icon: <Rocket className="h-5 w-5 text-wonderwhiz-bright-pink" />,
        size: 'h-3.5',
        pathStyle: 'dashed'
      };
    }
  };
  
  const styles = getProgressStyles();
  
  // Generate stars or milestone markers
  const generateMilestones = () => {
    const milestones = [];
    const totalSteps = totalChapters > 0 ? totalChapters : 5;
    
    for (let i = 0; i < totalSteps; i++) {
      const isCompleted = i < completedChapters;
      milestones.push(
        <motion.div
          key={i}
          className={`absolute ${styles.bgColor} rounded-full w-6 h-6 flex items-center justify-center
            ${isCompleted ? 'border-2 border-wonderwhiz-bright-pink' : 'border border-white/20'}
          `}
          style={{ left: `${(i / (totalSteps - 1)) * 100}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          {styles.icon}
        </motion.div>
      );
    }
    
    return milestones;
  };
  
  return (
    <motion.div
      className="py-4 px-6 rounded-lg mb-6 bg-white/5 backdrop-blur-sm border border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white text-sm font-medium">Your Learning Adventure</h3>
        <span className={`text-sm font-medium ${styles.mainColor}`}>
          {completedChapters} of {totalChapters} chapters
        </span>
      </div>
      
      <div className="relative pt-6 pb-8">
        {/* Background track */}
        <div className={`w-full ${styles.size} ${styles.pathStyle === 'dotted' ? 'border-dotted' : styles.pathStyle === 'dashed' ? 'border-dashed' : ''} bg-white/10 rounded-full`}></div>
        
        {/* Progress bar */}
        <motion.div
          className={`absolute top-6 left-0 ${styles.size} ${styles.bgColor} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
        
        {/* Milestones */}
        <div className="absolute top-4 left-0 right-0">
          {generateMilestones()}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressVisualization;
