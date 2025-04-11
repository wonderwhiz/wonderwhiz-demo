
import React from 'react';
import { motion } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';

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
  const getMessage = () => {
    if (progress < 30) return "Just getting started!";
    if (progress < 60) return "Making good progress!";
    if (progress < 90) return "Almost there!";
    return "Amazing job!";
  };
  
  const getBarStyle = () => {
    if (ageGroup === '5-7') {
      return {
        bar: "h-6 rounded-full bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink",
        container: "h-6 rounded-full"
      };
    } else if (ageGroup === '8-11') {
      return {
        bar: "h-4 rounded-full bg-gradient-to-r from-blue-500 to-wonderwhiz-bright-pink",
        container: "h-4 rounded-full"
      };
    } else {
      return {
        bar: "h-2 rounded-full bg-gradient-to-r from-cyan-500 to-wonderwhiz-bright-pink",
        container: "h-2 rounded-full"
      };
    }
  };
  
  const styles = getBarStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="mb-6 bg-white/5 rounded-lg p-4 border border-white/10"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-white">
          <TrendingUp className="h-4 w-4 mr-1.5 text-wonderwhiz-bright-pink" />
          <h3 className="font-medium text-sm">Learning Progress</h3>
        </div>
        
        <div className="text-white/80 text-xs font-medium">
          {completedChapters} of {totalChapters} chapters
        </div>
      </div>
      
      <div className={`bg-white/10 ${styles.container} mb-2`}>
        <motion.div 
          className={styles.bar}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="text-white/60">{Math.round(progress)}% complete</div>
        <div className="text-white flex items-center">
          <Award className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow" />
          {getMessage()}
        </div>
      </div>
    </motion.div>
  );
};

export default ProgressVisualization;
