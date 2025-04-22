
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Sparkles, CheckCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ExplorationProgressProps {
  totalBlocks: number;
  viewedBlocks: number;
  interactedBlocks: number;
  sparksEarned: number;
  onComplete?: () => void;
}

const ExplorationProgress: React.FC<ExplorationProgressProps> = ({
  totalBlocks,
  viewedBlocks,
  interactedBlocks,
  sparksEarned,
  onComplete
}) => {
  // Calculate progress percentages
  const viewProgress = totalBlocks > 0 ? (viewedBlocks / totalBlocks) * 100 : 0;
  const interactionProgress = totalBlocks > 0 ? (interactedBlocks / totalBlocks) * 100 : 0;
  const isComplete = viewedBlocks >= totalBlocks;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-black/20 border border-white/10 rounded-xl p-4 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white">Exploration Progress</h3>
        
        {isComplete && (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-400 mr-1.5" />
            <span className="text-green-400 text-sm font-medium">Complete!</span>
          </div>
        )}
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/70 text-sm">Content Explored</span>
          <span className="text-white/90 text-sm font-medium">{viewedBlocks}/{totalBlocks}</span>
        </div>
        <Progress value={viewProgress} className="h-2 bg-white/10" 
          indicatorClassName="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple" />
      </motion.div>
      
      <motion.div variants={itemVariants} className="mb-4">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/70 text-sm">Interactions</span>
          <span className="text-white/90 text-sm font-medium">{interactedBlocks}/{totalBlocks}</span>
        </div>
        <Progress value={interactionProgress} className="h-2 bg-white/10"
          indicatorClassName="bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-blue" />
      </motion.div>
      
      <motion.div 
        variants={itemVariants}
        className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-white/10"
      >
        <div className="flex items-center">
          <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1.5" />
          <span className="text-white/90">{viewedBlocks * 2} XP</span>
        </div>
        
        <div className="flex items-center">
          <Sparkles className="h-4 w-4 text-wonderwhiz-bright-pink mr-1.5" />
          <span className="text-white/90">{sparksEarned} Sparks</span>
        </div>
        
        {isComplete && (
          <div className="flex items-center">
            <Trophy className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1.5" />
            <span className="text-white/90">+5 Bonus</span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default ExplorationProgress;
