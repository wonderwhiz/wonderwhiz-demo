import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Timer, Star } from 'lucide-react';

interface ActivityBlockProps {
  content: {
    activity: string;
    title?: string;
    instructions?: string;
    steps?: string[];
  };
  onActivityComplete?: () => void;
  narrativePosition?: 'beginning' | 'middle' | 'end';
  specialistId?: string;
  updateHeight?: (height: number) => void;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ 
  content, 
  onActivityComplete, 
  narrativePosition,
  specialistId,
  updateHeight
}) => {
  const [completed, setCompleted] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5); // Short timer for demonstration
  
  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      if (onActivityComplete) {
        onActivityComplete();
      }
    }
  };
  
  const startTimer = () => {
    setShowTimer(true);
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowTimer(false);
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  return (
    <div>
      <motion.p 
        className="text-white text-sm sm:text-base mb-2 sm:mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.activity}
      </motion.p>
      
      {!completed && !showTimer ? (
        <div className="flex flex-wrap gap-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={handleComplete}
              className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white text-xs sm:text-sm"
            >
              I Did This Activity
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={startTimer}
              variant="outline"
              className="border-wonderwhiz-gold/40 bg-wonderwhiz-gold/10 text-wonderwhiz-gold hover:bg-wonderwhiz-gold/20 text-xs sm:text-sm"
            >
              <Timer className="mr-1 h-4 w-4" />
              Time This Activity
            </Button>
          </motion.div>
        </div>
      ) : showTimer ? (
        <motion.div 
          className="bg-wonderwhiz-deep-purple/40 backdrop-blur-sm rounded-lg p-3 border border-white/10"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">{timeRemaining}</div>
            <p className="text-white/60 text-xs">Time remaining</p>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          className="flex items-center text-wonderwhiz-gold text-xs sm:text-sm p-3 bg-wonderwhiz-gold/10 rounded-lg border border-wonderwhiz-gold/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="mr-2 w-8 h-8 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center">
            <Star className="h-4 w-4 text-wonderwhiz-gold" />
          </div>
          <div>
            <div className="flex items-center text-wonderwhiz-gold font-medium">
              <Check className="mr-1 h-4 w-4" />
              Great job completing this activity!
            </div>
            <p className="text-white/60 text-xs mt-0.5">You earned 3 sparks for your scientific exploration!</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ActivityBlock;
