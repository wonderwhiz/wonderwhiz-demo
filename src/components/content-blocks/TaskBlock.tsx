
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TaskBlockProps {
  content: {
    task: string;
    reward: number;
    title: string;
    description: string;
    steps: string[];
  };
  specialistId: string;
  onTaskComplete?: () => void;
  updateHeight?: (height: number) => void;
}

const TaskBlock: React.FC<TaskBlockProps> = ({
  content,
  specialistId,
  onTaskComplete,
  updateHeight
}) => {
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  
  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      setTimeout(() => {
        setShowReward(true);
      }, 300);
      if (onTaskComplete) {
        onTaskComplete();
      }
    }
  };
  
  return (
    <div className="p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/30 rounded-lg border border-wonderwhiz-bright-pink/20">
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0 mt-1">
          <motion.div 
            className="h-6 w-6 rounded-full bg-gradient-to-br from-wonderwhiz-gold to-amber-500 flex items-center justify-center"
            animate={
              completed ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}
            }
            transition={{ duration: 0.5 }}
          >
            <Trophy className="h-3.5 w-3.5 text-black" />
          </motion.div>
        </div>
        <motion.p 
          className="flex-1 text-white mb-2 sm:mb-3 text-sm sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {content.task}
        </motion.p>
      </div>
      
      {!completed ? (
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center space-x-1.5 text-wonderwhiz-gold text-xs sm:text-sm">
            <Sparkles className="h-4 w-4 text-wonderwhiz-gold" /> 
            <span>Earn {content.reward} sparks</span>
          </div>
          <Button 
            onClick={handleComplete}
            className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-purple hover:to-wonderwhiz-bright-pink text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg w-full sm:w-auto flex items-center justify-center"
          >
            <Check className="h-4 w-4 mr-1.5" />
            Complete
          </Button>
        </div>
      ) : (
        <motion.div 
          className="flex items-center text-green-400 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
            <Check className="h-3 w-3 text-black" />
          </div>
          <span>Task completed!</span>
          
          {showReward && (
            <motion.div
              className="ml-2 flex items-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <Sparkles className="h-4 w-4 text-wonderwhiz-gold mr-1" />
              <span className="text-wonderwhiz-gold font-semibold">+{content.reward} sparks</span>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TaskBlock;
