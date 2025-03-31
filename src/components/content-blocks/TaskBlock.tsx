
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';

interface TaskBlockProps {
  content: {
    task: string;
    reward: string | number;
  };
  onTaskComplete?: () => void;
}

const TaskBlock: React.FC<TaskBlockProps> = ({ content, onTaskComplete }) => {
  const [completed, setCompleted] = useState(false);
  const [showReward, setShowReward] = useState(false);
  
  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      setTimeout(() => setShowReward(true), 300);
      if (onTaskComplete) {
        onTaskComplete();
      }
    }
  };
  
  return (
    <div>
      <motion.p 
        className="text-white mb-2 sm:mb-3 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.task}
      </motion.p>
      
      {!completed ? (
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 sm:gap-4">
          <p className="text-wonderwhiz-gold flex items-center text-xs sm:text-sm">
            <Star className="inline-block mr-1 h-3.5 w-3.5 fill-wonderwhiz-gold text-wonderwhiz-gold" /> 
            Earn {content.reward} sparks by completing this task!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleComplete}
              className="bg-wonderwhiz-gold hover:bg-wonderwhiz-gold/80 text-black font-medium text-xs sm:text-sm w-full sm:w-auto"
            >
              Mark Complete
            </Button>
          </motion.div>
        </div>
      ) : (
        <div className="relative">
          <motion.div 
            className="flex items-center text-green-400 text-xs sm:text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Check className="mr-1 h-4 w-4" />
            Task completed! 
          </motion.div>
          
          {showReward && (
            <motion.div
              className="mt-1.5 flex items-center text-wonderwhiz-gold text-xs sm:text-sm"
              initial={{ opacity: 0, y: -10, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              <Star className="mr-1 h-4 w-4 fill-wonderwhiz-gold text-wonderwhiz-gold" /> 
              <motion.span
                initial={{ fontWeight: 400 }}
                animate={{ fontWeight: 600 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                You earned {content.reward} sparks!
              </motion.span>
            </motion.div>
          )}
          
          {showReward && (
            <motion.div
              className="absolute -top-8 -right-4 text-3xl"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ 
                opacity: [0, 1, 1, 0], 
                scale: [0.5, 1.2, 1.2, 0.8], 
                y: [10, -20, -40, -60],
                x: [0, 10, -10, 0]
              }}
              transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
            >
              ✨
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBlock;
