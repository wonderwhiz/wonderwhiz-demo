
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LearningProgressProps {
  sparksEarned: number;
  explorationDepth: number;
  blocksExplored: number;
}

const LearningProgress: React.FC<LearningProgressProps> = ({
  sparksEarned,
  explorationDepth,
  blocksExplored
}) => {
  // Calculate a "progress score" based on blocks explored
  // Just a simple visual indicator, not meant to be a real "score"
  const progressPercentage = Math.min(blocksExplored * 10, 100);
  
  return (
    <motion.div 
      className="bg-white/10 rounded-lg p-4 backdrop-blur-sm"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="flex flex-wrap md:flex-nowrap gap-4 justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Sparks Earned</h3>
            <p className="text-xl font-bold text-wonderwhiz-gold">{sparksEarned}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Knowledge Blocks</h3>
            <p className="text-xl font-bold text-blue-400">{blocksExplored}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/80">Exploration Depth</h3>
            <p className="text-xl font-bold text-emerald-400">{explorationDepth}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between mb-1 text-xs text-white/70">
          <span>Learning Journey</span>
          <span>{progressPercentage}%</span>
        </div>
        <Progress value={progressPercentage} className="h-2 bg-white/20">
          <motion.div 
            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink via-purple-500 to-blue-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </Progress>
      </div>
    </motion.div>
  );
};

export default LearningProgress;
