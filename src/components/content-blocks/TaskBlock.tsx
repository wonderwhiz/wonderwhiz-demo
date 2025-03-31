
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Star, Trophy } from 'lucide-react';

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
  const [showSparkles, setShowSparkles] = useState(false);
  
  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      setTimeout(() => {
        setShowReward(true);
        setShowSparkles(true);
        setTimeout(() => setShowSparkles(false), 2000);
      }, 300);
      if (onTaskComplete) {
        onTaskComplete();
      }
    }
  };
  
  return (
    <div>
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
            <Star className="h-4 w-4 fill-wonderwhiz-gold text-wonderwhiz-gold" /> 
            <span>Earn {content.reward} sparks by completing this task!</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-wonderwhiz-gold to-amber-400 hover:from-amber-400 hover:to-wonderwhiz-gold text-black font-medium text-xs sm:text-sm px-4 py-2 rounded-full shadow-lg w-full sm:w-auto flex items-center justify-center"
            >
              <Check className="h-4 w-4 mr-1.5" />
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
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <Check className="h-3 w-3 text-black" />
            </div>
            <span>Task completed!</span>
          </motion.div>
          
          {showReward && (
            <motion.div
              className="mt-2 flex items-center"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
            >
              <div className="relative mr-2">
                <Star className="h-5 w-5 fill-wonderwhiz-gold text-wonderwhiz-gold" />
                {showSparkles && (
                  <>
                    <motion.div
                      className="absolute -top-2 -right-2 text-lg"
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.8],
                        y: [0, -15, -25],
                        x: [0, 10, 15]
                      }}
                      transition={{ duration: 2, times: [0, 0.5, 1] }}
                    >
                      ✨
                    </motion.div>
                    <motion.div
                      className="absolute -bottom-2 -left-2 text-lg"
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.2, 0.7],
                        y: [0, 10, 20],
                        x: [0, -8, -12]
                      }}
                      transition={{ duration: 1.8, times: [0, 0.5, 1], delay: 0.2 }}
                    >
                      ✨
                    </motion.div>
                  </>
                )}
              </div>
              <motion.span
                className="text-wonderwhiz-gold text-xs sm:text-sm font-semibold"
                initial={{ fontWeight: 400 }}
                animate={{ 
                  fontWeight: 700,
                  scale: showSparkles ? [1, 1.15, 1] : 1
                }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                You earned {content.reward} sparks!
              </motion.span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskBlock;
