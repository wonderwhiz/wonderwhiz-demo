
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Clock, RefreshCw, Heart, VolumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface MindfulnessBlockProps {
  title: string;
  instructions: string;
  duration: number; // in seconds
  benefit: string;
  onComplete?: () => void;
  childAge?: number;
  onReadAloud?: (text: string) => void;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  title,
  instructions,
  duration,
  benefit,
  onComplete,
  childAge = 10,
  onReadAloud
}) => {
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isComplete, setIsComplete] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'breathe-in' | 'hold' | 'breathe-out' | 'rest'>('rest');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const formattedTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const progressPercentage = () => {
    return ((duration - timeLeft) / duration) * 100;
  };
  
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        
        // Update breathing phase
        const cycle = 15; // 15 second breathing cycle
        const position = (duration - timeLeft) % cycle;
        
        if (position < 4) {
          setBreathingPhase('breathe-in');
        } else if (position < 7) {
          setBreathingPhase('hold');
        } else if (position < 11) {
          setBreathingPhase('breathe-out');
        } else {
          setBreathingPhase('rest');
        }
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      setIsComplete(true);
      
      // Celebration effect
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.7 }
      });
      
      toast.success(
        childAge < 8 ? "Great job with your mindfulness practice! ✨" : "Mindfulness activity completed! ✨",
        { duration: 3000 }
      );
      
      if (onComplete) {
        onComplete();
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isActive, timeLeft, duration, onComplete, childAge]);
  
  const toggleTimer = () => {
    setIsActive(!isActive);
    
    if (!isActive && timeLeft === duration) {
      toast.info(
        childAge < 8 ? "Let's begin our mindful moment!" : "Starting mindfulness practice",
        { duration: 2000 }
      );
    }
  };
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsComplete(false);
    setBreathingPhase('rest');
  };
  
  const getBreathingInstructions = () => {
    switch (breathingPhase) {
      case 'breathe-in':
        return "Breathe in slowly...";
      case 'hold':
        return "Hold your breath...";
      case 'breathe-out':
        return "Breathe out gently...";
      case 'rest':
        return "Relax...";
    }
  };
  
  const handleReadAloud = () => {
    if (onReadAloud) {
      onReadAloud(title + ". " + instructions + ". " + benefit);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <div className="relative overflow-hidden rounded-2xl backdrop-blur-lg border border-white/10 bg-gradient-to-br from-indigo-900/30 to-purple-900/30 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-wonderwhiz-bright-pink/5 to-purple-500/5 pointer-events-none" />
        
        <div className="relative p-6">
          <div className="flex items-start gap-3 mb-5">
            <div className="h-10 w-10 bg-gradient-to-br from-wonderwhiz-bright-pink to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-glow-brand-pink">
              <Heart className="h-5 w-5 text-white" />
            </div>
            
            <div>
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white font-nunito">{title}</h3>
                <div className="ml-2 bg-wonderwhiz-bright-pink/20 px-2 py-0.5 rounded-full text-xs text-wonderwhiz-bright-pink font-medium hidden sm:block">
                  Mindfulness
                </div>
              </div>
              
              <div className="mt-1 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReadAloud}
                  className="text-white/70 hover:text-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/10 p-1 h-auto"
                >
                  <VolumeIcon className="h-3.5 w-3.5" />
                  <span className="sr-only">Read aloud</span>
                </Button>
                <p className="text-sm text-white/70 font-inter">
                  {duration < 60 
                    ? `${duration} seconds` 
                    : `${Math.floor(duration / 60)} minute${Math.floor(duration / 60) !== 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-white font-inter mb-6 leading-relaxed">
              {instructions}
            </p>
            
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-white/70" />
                  <span className="text-white font-medium">{formattedTime()}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetTimer}
                    disabled={timeLeft === duration && !isActive}
                    className="bg-white/10 hover:bg-white/20 text-white rounded-lg h-8 w-8 p-0"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleTimer}
                    disabled={isComplete}
                    className={`rounded-lg ${
                      isActive 
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-wonderwhiz-bright-pink text-white hover:bg-wonderwhiz-bright-pink/90'
                    }`}
                  >
                    {isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-1" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-1" />
                        {isComplete ? 'Completed' : timeLeft === duration ? 'Start' : 'Resume'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-purple-500"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-4 text-center"
                  >
                    <motion.div
                      animate={{
                        scale: breathingPhase === 'breathe-in' ? [1, 1.15] :
                               breathingPhase === 'hold' ? 1.15 :
                               breathingPhase === 'breathe-out' ? [1.15, 1] : 1
                      }}
                      transition={{
                        duration: breathingPhase === 'breathe-in' ? 4 :
                                 breathingPhase === 'breathe-out' ? 4 : 0.5,
                        ease: "easeInOut"
                      }}
                      className="h-20 w-20 mx-auto bg-gradient-to-r from-wonderwhiz-bright-pink to-purple-500 rounded-full flex items-center justify-center opacity-80"
                    >
                      <div className="h-16 w-16 rounded-full bg-indigo-900/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-semibold">{getBreathingInstructions()}</span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-white font-medium mb-2 font-nunito">Benefit</h4>
            <p className="text-white/90 font-inter text-sm">
              {benefit}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MindfulnessBlock;
