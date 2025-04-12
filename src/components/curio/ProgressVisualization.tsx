
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Award, Trophy } from 'lucide-react';

interface ProgressVisualizationProps {
  progress: number;
  ageGroup: '5-7' | '8-11' | '12-16';
  totalChapters: number;
  completedChapters: number;
}

export const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  progress,
  ageGroup,
  totalChapters,
  completedChapters
}) => {
  const getProgressText = () => {
    if (progress < 25) return "Just getting started!";
    if (progress < 50) return "Making good progress!";
    if (progress < 75) return "Well on your way!";
    if (progress < 100) return "Almost there!";
    return "Journey complete!";
  };
  
  const getProgressIcon = () => {
    if (progress < 50) return <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
    if (progress < 100) return <Award className="h-5 w-5 text-wonderwhiz-bright-pink" />;
    return <Trophy className="h-5 w-5 text-wonderwhiz-gold" />;
  };
  
  const getProgressStyle = () => {
    if (ageGroup === '5-7') {
      return {
        container: "p-4 rounded-xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20",
        progressBar: "h-6 rounded-full overflow-hidden bg-white/10",
        progressFill: "h-full rounded-full bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink"
      };
    } else if (ageGroup === '8-11') {
      return {
        container: "p-3 rounded-lg bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-500/10",
        progressBar: "h-4 rounded-full overflow-hidden bg-white/10",
        progressFill: "h-full rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-cyan"
      };
    } else {
      return {
        container: "p-2 rounded-md bg-gradient-to-r from-indigo-900/10 to-purple-900/10 border border-indigo-500/10",
        progressBar: "h-3 rounded-full overflow-hidden bg-white/10",
        progressFill: "h-full rounded-full bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-vibrant-yellow"
      };
    }
  };
  
  const style = getProgressStyle();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`mb-8 ${style.container}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          {getProgressIcon()}
          <span className="ml-2 text-white/90 font-medium">
            {getProgressText()}
          </span>
        </div>
        <span className="text-white/80 text-sm">
          {completedChapters} of {totalChapters} chapters
        </span>
      </div>
      
      <div className={style.progressBar}>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={style.progressFill}
        />
      </div>
      
      {completedChapters === totalChapters && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-3 text-center"
        >
          <span className="text-wonderwhiz-gold font-medium text-sm inline-flex items-center">
            <Trophy className="h-4 w-4 mr-1" />
            Learning journey complete! Well done!
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressVisualization;
