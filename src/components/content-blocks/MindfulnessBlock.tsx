
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MindfulnessBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  content,
  specialistId,
  onMindfulnessComplete,
  updateHeight,
  childAge = 10
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  
  const duration = content.duration || 60; // Default 60 seconds if not specified
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  
  useEffect(() => {
    if (isActive && !isCompleted) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(newProgress);
        
        if (newProgress >= 100) {
          setIsActive(false);
          setIsCompleted(true);
          if (onMindfulnessComplete) {
            onMindfulnessComplete();
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      }, 100);
    } else if (!isActive && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, duration, isCompleted, onMindfulnessComplete]);
  
  const toggleActive = () => {
    setIsActive(!isActive);
  };
  
  const getTitle = () => {
    return content.title || (messageStyle === 'playful' ? 
      "Mindfulness Moment" : 
      messageStyle === 'casual' ? 
        "Take a Mindful Moment" : 
        "Mindfulness Exercise"
    );
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const timeLeft = duration - (progress / 100 * duration);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-teal-600/20 to-emerald-600/20 p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-teal-500/20 rounded-full">
          <Heart className="h-5 w-5 text-teal-400" />
        </div>
        <h3 className={`text-white font-medium ${textSize}`}>{getTitle()}</h3>
      </div>
      
      <div className={`mb-6 ${textSize}`}>
        <p className="text-white/90">
          {content.exercise || content.instruction}
        </p>
      </div>
      
      {!isCompleted ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">
              {isActive ? "In progress..." : "Ready to begin"}
            </span>
            <span className="text-white/70 text-sm">
              {formatTime(timeLeft)}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <Button
            onClick={toggleActive}
            variant="outline"
            className={`w-full bg-teal-500/30 hover:bg-teal-500/50 border-teal-500/50 ${interactionStyle}`}
          >
            {isActive ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                {childAge <= 7 ? "Take a Break" : "Pause"}
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                {progress > 0 ? 
                  (childAge <= 7 ? "Keep Going!" : "Resume") : 
                  (childAge <= 7 ? "Start Now!" : "Begin Exercise")
                }
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 rounded-lg text-white">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className={textSize}>
            {messageStyle === 'playful' ? 
              "Amazing! You completed your mindfulness practice!" : 
              messageStyle === 'casual' ? 
                "Well done! Mindfulness exercise completed." : 
                "Exercise completed successfully."
            }
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default MindfulnessBlock;
