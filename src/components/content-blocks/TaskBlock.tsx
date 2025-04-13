
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Check, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';

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
  const [currentStep, setCurrentStep] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  // Start with expanded view to show the task details
  const [expanded, setExpanded] = useState(true);
  
  useEffect(() => {
    if (currentStep >= 0) {
      // Calculate progress based on steps completed
      const newProgress = ((currentStep + 1) / content.steps.length) * 100;
      setProgress(newProgress);
    }
  }, [currentStep, content.steps.length]);
  
  const handleStartTask = () => {
    setExpanded(true);
    setCurrentStep(0);
    // Optional: Set a timer for the task
    setTimeLeft(content.steps.length * 60); // 1 minute per step as an example
  };
  
  const handleNextStep = () => {
    if (currentStep < content.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTask();
    }
  };
  
  const completeTask = () => {
    if (!completed) {
      setCompleted(true);
      
      // Trigger confetti effect when task is completed
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => {
        setShowReward(true);
      }, 300);
      
      if (onTaskComplete) {
        onTaskComplete();
      }
    }
  };
  
  // Optional: Countdown timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || completed) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev !== null && prev > 0 ? prev - 1 : null);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [timeLeft, completed]);
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div 
      className="overflow-hidden"
      animate={{ height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="p-5 bg-gradient-to-r from-purple-900/50 to-indigo-900/30 rounded-lg border border-wonderwhiz-bright-pink/20 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Task Header */}
        <div className="flex items-start space-x-4 mb-3">
          <div className="flex-shrink-0 mt-1">
            <motion.div 
              className="h-10 w-10 rounded-full bg-gradient-to-br from-wonderwhiz-gold to-amber-500 flex items-center justify-center shadow-glow-sm"
              animate={
                completed 
                  ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } 
                  : {}
              }
              transition={{ duration: 0.5 }}
            >
              <Trophy className="h-5 w-5 text-black" />
            </motion.div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white">{content.title || "Learning Task"}</h3>
            <p className="text-white/80 mb-1">{content.task}</p>
            
            {/* Reward Badge */}
            <div className="inline-flex items-center text-xs bg-wonderwhiz-gold/20 text-wonderwhiz-gold px-2 py-1 rounded-full">
              <Sparkles className="h-3 w-3 mr-1" /> 
              <span>{content.reward} sparks reward</span>
            </div>
          </div>
        </div>
        
        {/* Progress indicator (only shown when task is started) */}
        {currentStep >= 0 && !completed && (
          <div className="mb-4">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>{currentStep + 1} of {content.steps.length} steps</span>
              {timeLeft !== null && (
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>
            <Progress value={progress} className="h-2">
              <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" 
                style={{ width: `${progress}%` }} 
              />
            </Progress>
          </div>
        )}
        
        {/* Task Content - Shown when expanded */}
        <AnimatedHeight isVisible={expanded && !completed}>
          {currentStep === -1 ? (
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <p className="text-white/90 mb-3">{content.description}</p>
              <p className="text-sm text-white/70">This task has {content.steps.length} steps to complete.</p>
            </div>
          ) : (
            <div className="bg-white/5 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-1 text-white/80 text-sm">
                <span className="font-medium">Step {currentStep + 1}:</span>
              </div>
              <p className="text-white/90">{content.steps[currentStep]}</p>
            </div>
          )}
        </AnimatedHeight>
        
        {/* Task Actions */}
        {!completed ? (
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 sm:gap-4">
            {currentStep === -1 ? (
              <Button 
                onClick={handleStartTask}
                className="w-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2 rounded-full shadow-lg flex items-center justify-center"
              >
                <Trophy className="h-4 w-4 mr-1.5" />
                Start Task
              </Button>
            ) : (
              <Button 
                onClick={handleNextStep}
                className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium py-2 rounded-full shadow-lg flex items-center justify-center"
              >
                {currentStep < content.steps.length - 1 ? (
                  <>
                    <ArrowRight className="h-4 w-4 mr-1.5" />
                    Next Step
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-1.5" />
                    Complete Task
                  </>
                )}
              </Button>
            )}
          </div>
        ) : (
          <motion.div 
            className="flex items-center text-green-400 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex-shrink-0 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <Check className="h-4 w-4 text-black" />
            </div>
            <span className="font-medium">Task completed!</span>
            
            {showReward && (
              <motion.div
                className="ml-auto flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.3, 
                  type: "spring",
                  duration: 0.8
                }}
              >
                <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-1" />
                <span className="text-wonderwhiz-gold font-semibold">+{content.reward} sparks</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Helper component for animated height transitions
const AnimatedHeight: React.FC<{ 
  isVisible: boolean;
  children: React.ReactNode;
}> = ({ isVisible, children }) => {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0, marginBottom: 0 }}
      animate={{ 
        height: isVisible ? 'auto' : 0,
        opacity: isVisible ? 1 : 0,
        marginBottom: isVisible ? 16 : 0
      }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  );
};

export default TaskBlock;
