
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import SpecialistAvatar from '@/components/SpecialistAvatar';

interface MindfulnessBlockProps {
  title: string;
  instructions: string;
  duration: number;
  benefit?: string;
  specialistId?: string;
  childAge?: number;
  onComplete?: () => void;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  title,
  instructions,
  duration = 60, // Default to 60 seconds if not provided
  benefit,
  specialistId = 'lotus',
  childAge = 10,
  onComplete
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          const newValue = prev - 1;
          const newProgress = ((duration - newValue) / duration) * 100;
          setProgress(newProgress);
          return newValue;
        });
      }, 1000);
    } else if (timeRemaining === 0 && !isCompleted) {
      setIsActive(false);
      setIsCompleted(true);
      if (onComplete) {
        onComplete();
      }
      
      // Show completion message
      toast.success('Mindfulness activity completed! 🌿', {
        description: 'Great job taking a moment for yourself!'
      });
    }
    
    return () => {
      clearInterval(interval);
    };
  }, [isActive, timeRemaining, duration, isCompleted, onComplete]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getBackgroundClass = () => {
    if (isCompleted) return 'from-green-500/20 to-teal-500/20';
    return isActive ? 'from-wonderwhiz-light-purple/30 to-wonderwhiz-bright-pink/20' : 'from-indigo-800/30 to-purple-800/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className={`rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br ${getBackgroundClass()} shadow-lg overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-start gap-4 mb-5">
            <SpecialistAvatar specialistId={specialistId} size="lg" />
            
            <div>
              <h3 className="text-lg font-bold text-white font-nunito">{title}</h3>
              <p className="text-sm text-white/70 font-inter">Mindfulness Activity</p>
            </div>
          </div>

          <div className="text-white font-inter leading-relaxed mb-6">
            <p>{instructions}</p>
            
            {benefit && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-sm text-white/80">
                  <span className="font-medium">Benefit:</span> {benefit}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white/80 font-medium">{formatTime(timeRemaining)}</span>
              <span className="text-white/60 text-sm">{isCompleted ? 'Completed!' : isActive ? 'In progress...' : 'Ready to begin'}</span>
            </div>
            
            <Progress value={progress} className="h-2 bg-white/10" />
            
            <div className="flex justify-center pt-2">
              {isCompleted ? (
                <Button 
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6"
                  disabled
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Completed
                </Button>
              ) : (
                <Button
                  className={`${isActive 
                    ? 'bg-white/20 hover:bg-white/30' 
                    : 'bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-bright-pink/90 hover:to-wonderwhiz-purple/90'
                  } text-white px-6`}
                  onClick={toggleTimer}
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      {timeRemaining === duration ? 'Start' : 'Resume'}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MindfulnessBlock;
