
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Pause, RefreshCw, Timer, CheckCircle, Heart } from 'lucide-react';

interface MindfulnessBlockProps {
  title: string;
  instructions: string;
  duration?: number; // in seconds
  benefit?: string;
  onComplete?: () => void;
  childAge?: number;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  title,
  instructions,
  duration = 30, // Default now 30 seconds as requested
  benefit,
  onComplete,
  childAge = 10
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [particles, setParticles] = useState<{x: number, y: number, size: number, speed: number, opacity: number}[]>([]);
  
  const intervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Generate random particles for the background effect
  useEffect(() => {
    const newParticles = Array(20).fill(null).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 3,
      speed: 0.2 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5
    }));
    setParticles(newParticles);
  }, []);
  
  useEffect(() => {
    // Reset the timer when the duration prop changes
    setTimeRemaining(duration);
    setProgress(0);
  }, [duration]);
  
  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          // Calculate progress percentage (inverted since we're counting down)
          setProgress(((duration - newTime) / duration) * 100);
          return newTime;
        });
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
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining, completed, onComplete, childAge, duration]);
  
  // Animate particles
  useEffect(() => {
    if (canvasRef.current && (isActive || completed)) {
      const animateParticles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        setParticles(prevParticles => 
          prevParticles.map(p => ({
            ...p,
            y: (p.y - p.speed) % 100,
            opacity: completed ? p.opacity * 1.2 : p.opacity
          }))
        );
        
        // Draw particles
        particles.forEach(p => {
          const color = completed ? 
            `rgba(100, 255, 100, ${p.opacity})` : 
            `rgba(150, 150, 255, ${p.opacity})`;
          
          ctx.beginPath();
          ctx.arc(
            (p.x / 100) * canvas.width, 
            (p.y / 100) * canvas.height, 
            p.size, 
            0, 
            Math.PI * 2
          );
          ctx.fillStyle = color;
          ctx.fill();
        });
        
        requestAnimationFrame(animateParticles);
      };
      
      const animation = requestAnimationFrame(animateParticles);
      return () => cancelAnimationFrame(animation);
    }
  }, [particles, isActive, completed]);
  
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
    setProgress(0);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl p-6 my-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 shadow-lg overflow-hidden relative"
    >
      {/* Particle canvas background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none"
        width={400}
        height={300}
      />
      
      <div className="flex items-center gap-3 mb-4 relative z-10">
        <div className="p-2 bg-indigo-500/20 backdrop-blur-sm rounded-full shadow-inner">
          <Heart className="h-5 w-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </div>
      
      <p className="text-white/80 mb-6 relative z-10">{instructions}</p>
      
      <AnimatePresence mode="wait">
        {!completed ? (
          <motion.div
            key="timer-active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5 relative z-10"
          >
            <div className="relative h-24 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-inner border border-white/10">
              <div 
                className="absolute inset-0 bg-gradient-to-r from-indigo-500/50 to-purple-500/50"
                style={{ 
                  width: `${progress}%`,
                  transition: 'width 0.5s ease-in-out'
                }}
              />
              
              {/* Glowing edge for progress */}
              <div 
                className="absolute top-0 bottom-0 w-2 bg-white/40 blur-md"
                style={{ 
                  left: `${progress}%`,
                  opacity: isActive && !isPaused ? 1 : 0,
                  transition: 'left 0.5s ease-in-out, opacity 0.3s ease'
                }}
              />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  animate={isActive && !isPaused ? { 
                    scale: [1, 1.05, 1],
                    opacity: [1, 0.9, 1]
                  } : {}}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4, 
                    ease: "easeInOut" 
                  }}
                  className="flex flex-col items-center"
                >
                  <Timer className="h-6 w-6 text-white/70 mb-1" />
                  <div className="text-3xl font-bold text-white tabular-nums drop-shadow-lg">
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs text-white/70 mt-1">
                    {isActive && !isPaused 
                      ? "Mindfulness in progress..." 
                      : isPaused 
                        ? "Paused" 
                        : "Ready to begin"}
                  </div>
                </motion.div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {!isActive && !completed ? (
                <Button 
                  onClick={handleStart}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {childAge <= 7 ? "Start Now!" : "Begin"}
                </Button>
              ) : isActive && !isPaused ? (
                <Button 
                  onClick={handlePause}
                  variant="outline"
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm shadow-inner"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  {childAge <= 7 ? "Take a Break" : "Pause"}
                </Button>
              ) : isActive && isPaused ? (
                <Button 
                  onClick={handleResume}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/20"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {childAge <= 7 ? "Keep Going!" : "Resume"}
                </Button>
              ) : null}
              
              {(isPaused || (timeRemaining < duration && !isActive)) && (
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500/30 text-white backdrop-blur-sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="timer-completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg text-white relative z-10 backdrop-blur-sm border border-green-500/30 shadow-lg"
          >
            <motion.div 
              className="h-14 w-14 rounded-full bg-green-500/20 flex items-center justify-center mb-3"
              animate={{ 
                boxShadow: ['0 0 0 rgba(52, 211, 153, 0.3)', '0 0 20px rgba(52, 211, 153, 0.7)', '0 0 0 rgba(52, 211, 153, 0.3)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <CheckCircle className="h-8 w-8 text-green-400" />
            </motion.div>
            
            <h4 className="text-lg font-semibold text-white mb-2">
              {childAge < 10 
                ? "Amazing job!" 
                : "Practice Complete"}
            </h4>
            
            <p className="text-white/80 text-center mb-4">
              {childAge < 10 
                ? "You finished your mindfulness moment!" 
                : "You've successfully completed your mindfulness exercise."}
            </p>
            
            <Button 
              onClick={handleReset}
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {childAge < 10 ? "Try Again" : "New Session"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {benefit && !completed && (
        <div className="bg-white/5 p-4 rounded-lg mt-6 backdrop-blur-sm border border-white/10 relative z-10">
          <h4 className="font-semibold text-white/90 mb-1">Benefit:</h4>
          <p className="text-white/80">{benefit}</p>
        </div>
      )}
    </motion.div>
  );
};

export default MindfulnessBlock;
