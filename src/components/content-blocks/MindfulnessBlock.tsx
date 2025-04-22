
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Play, Pause, CheckCircle, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { MindfulnessBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { toast } from 'sonner';

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
  const [secondsLeft, setSecondsLeft] = useState(0);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  
  const duration = content.duration || 60; // Default 60 seconds if not specified
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Initialize seconds left when duration changes
    setSecondsLeft(duration);
  }, [duration]);
  
  useEffect(() => {
    if (isActive && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsActive(false);
            setIsCompleted(true);
            setProgress(100);
            if (onMindfulnessComplete) {
              onMindfulnessComplete();
            }
            return 0;
          }
          
          // Calculate progress percentage
          const newProgress = ((duration - newValue) / duration) * 100;
          setProgress(newProgress);
          
          return newValue;
        });
      }, 1000);
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
    if (isCompleted) return;
    
    if (!isActive) {
      toast.success(
        childAge < 8 ? "Let's begin our mindful moment!" : "Starting mindfulness exercise...",
        { duration: 2000 }
      );
    }
    
    setIsActive(!isActive);
  };
  
  const handleReset = () => {
    setIsActive(false);
    setIsCompleted(false);
    setProgress(0);
    setSecondsLeft(duration);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl overflow-hidden shadow-lg border border-indigo-500/20"
    >
      <div className="backdrop-blur-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-indigo-500/20 rounded-full">
            <Heart className="h-5 w-5 text-indigo-400" />
          </div>
          <h3 className={`text-white font-medium ${textSize}`}>{getTitle()}</h3>
        </div>
        
        <div className={`mb-6 ${textSize}`}>
          <p className="text-white/90">
            {content.exercise || content.instruction}
          </p>
        </div>
        
        <AnimatePresence mode="wait">
          {!isCompleted ? (
            <motion.div 
              key="active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <div className="relative h-24 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg overflow-hidden">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 to-purple-500/50"
                  style={{ 
                    width: `${progress}%`,
                    transition: 'width 0.5s ease-in-out'
                  }}
                />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Timer className="h-6 w-6 text-white/70 mb-1" />
                  <div className="text-3xl font-bold text-white tabular-nums">
                    {formatTime(secondsLeft)}
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    {isActive ? "Mindfulness in progress..." : "Ready to begin"}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={toggleActive}
                  variant="outline"
                  className={`flex-1 bg-indigo-500/30 hover:bg-indigo-500/50 border-indigo-500/50 text-white ${interactionStyle}`}
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
                
                {progress > 0 && !isActive && (
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-white"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="completed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-4 px-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg text-white"
            >
              <div className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
              <span className={`text-center ${textSize} font-medium`}>
                {messageStyle === 'playful' ? 
                  "Amazing! You completed your mindfulness practice!" : 
                  messageStyle === 'casual' ? 
                    "Well done! Mindfulness exercise completed." : 
                    "Exercise completed successfully."
                }
              </span>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="mt-4 bg-white/10 hover:bg-white/20 border-white/20 text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MindfulnessBlock;
