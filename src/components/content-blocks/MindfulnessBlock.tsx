import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Play, Pause, Check, Clock } from 'lucide-react';

interface MindfulnessBlockProps {
  content: {
    exercise: string;
    duration: number;
    title?: string;
    instruction?: string;
  };
  onMindfulnessComplete?: () => void;
  specialistId?: string;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({ 
  content, 
  onMindfulnessComplete,
  specialistId 
}) => {
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(content.duration);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    let timer: number;
    
    if (timerRunning && secondsLeft > 0) {
      timer = window.setTimeout(() => {
        setSecondsLeft(prevSeconds => prevSeconds - 1);
      }, 1000);
    } else if (timerRunning && secondsLeft === 0) {
      setTimerRunning(false);
      setCompleted(true);
      if (onMindfulnessComplete) {
        onMindfulnessComplete();
      }
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [timerRunning, secondsLeft, onMindfulnessComplete]);
  
  const toggleTimer = () => {
    setTimerRunning(prev => !prev);
  };
  
  const resetTimer = () => {
    setTimerRunning(false);
    setSecondsLeft(content.duration);
    setCompleted(false);
  };
  
  const progress = 1 - secondsLeft / content.duration;
  
  return (
    <div>
      <motion.p 
        className="text-white mb-1.5 sm:mb-2 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.exercise}
      </motion.p>
      
      {!completed ? (
        <div className="space-y-2 sm:space-y-3">
          <p className="text-white/70 text-xs flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            {secondsLeft} seconds remaining
          </p>
          
          <div className="w-full bg-white/10 rounded-full h-2.5">
            <motion.div 
              className="bg-wonderwhiz-purple h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ ease: "linear" }}
            ></motion.div>
          </div>
          
          <div className="flex space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={toggleTimer}
                variant="outline"
                size="sm"
                className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm"
              >
                {timerRunning ? (
                  <><Pause className="h-3.5 w-3.5 mr-1.5" /> Pause</>
                ) : (
                  <><Play className="h-3.5 w-3.5 mr-1.5" /> {secondsLeft === content.duration ? 'Start' : 'Resume'}</>
                )}
              </Button>
            </motion.div>
            
            {secondsLeft < content.duration && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={resetTimer}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm"
                >
                  Reset
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div 
          className="flex items-center text-green-400 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Check className="mr-1 h-4 w-4" />
          Wonderful job! You earned 5 sparks for completing this mindfulness exercise!
        </motion.div>
      )}
    </div>
  );
};

export default MindfulnessBlock;
