
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface MindfulnessBlockProps {
  title: string;
  instructions: string;
  duration: number; // in seconds
  benefit?: string;
  onComplete?: () => void;
  childAge?: number;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  title,
  instructions,
  duration = 180, // default 3 minutes
  benefit,
  onComplete,
  childAge = 10
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [completed, setCompleted] = useState(false);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && !isPaused && timeRemaining > 0) {
      interval = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !completed) {
      setCompleted(true);
      setIsActive(false);
      
      if (onComplete) {
        onComplete();
      }
      
      toast.success(
        childAge < 10 
          ? "Great job on your mindfulness practice!" 
          : "Mindfulness exercise completed successfully!", 
        { duration: 3000 }
      );
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, isPaused, timeRemaining, completed, onComplete, childAge]);
  
  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    toast.info(
      childAge < 10 
        ? "Let's begin our mindfulness moment!" 
        : "Starting mindfulness exercise...", 
      { duration: 2000 }
    );
  };
  
  const handlePause = () => {
    setIsPaused(true);
  };
  
  const handleResume = () => {
    setIsPaused(false);
  };
  
  const handleReset = () => {
    setTimeRemaining(duration);
    setIsActive(false);
    setIsPaused(false);
    setCompleted(false);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="bg-indigo-800/30 rounded-xl p-6 my-6 border border-indigo-500/20">
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 mb-6">{instructions}</p>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-medium text-white">
          Time Remaining: {formatTime(timeRemaining)}
        </div>
        
        <div className="flex space-x-2">
          {!isActive && !completed ? (
            <Button 
              onClick={handleStart}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          ) : isActive && !isPaused ? (
            <Button 
              onClick={handlePause}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : isActive && isPaused ? (
            <Button 
              onClick={handleResume}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Resume
            </Button>
          ) : null}
          
          {(isPaused || completed) && (
            <Button 
              onClick={handleReset}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          )}
        </div>
      </div>
      
      {benefit && (
        <div className="bg-white/5 p-4 rounded-lg mt-6">
          <h4 className="font-semibold text-white/90 mb-1">Benefit:</h4>
          <p className="text-white/80">{benefit}</p>
        </div>
      )}
    </div>
  );
};

export default MindfulnessBlock;
