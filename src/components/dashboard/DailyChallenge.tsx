
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Clock, Brain, BookOpen, Zap, Rocket, Sparkles, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface DailyChallengeProps {
  childId: string;
  onNewChallenges?: (count: number) => void;
  onComplete?: () => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ 
  childId,
  onNewChallenges,
  onComplete
}) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [completionAnimation, setCompletionAnimation] = useState<string | null>(null);
  
  useEffect(() => {
    // Generate daily challenges - this would normally come from the backend
    const generateChallenges = () => {
      const dailyChallenges = [
        {
          id: 'quiz',
          title: 'Answer a quiz correctly',
          description: 'Complete any quiz in your curios',
          type: 'quiz',
          icon: <Brain className="h-5 w-5 text-wonderwhiz-cyan" />,
          reward: 5,
          timeEstimate: '2 min',
          progress: 0
        },
        {
          id: 'read',
          title: 'Read an interesting fact',
          description: 'Explore a fact card in any curio',
          type: 'read',
          icon: <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />,
          reward: 3,
          timeEstimate: '3 min',
          progress: 0
        },
        {
          id: 'create',
          title: 'Create something new',
          description: 'Complete a creative challenge',
          type: 'create',
          icon: <Zap className="h-5 w-5 text-wonderwhiz-bright-pink" />,
          reward: 10,
          timeEstimate: '5 min',
          progress: 0
        }
      ];
      
      setChallenges(dailyChallenges);
      
      // Notify parent component about new challenges if needed
      if (onNewChallenges) {
        onNewChallenges(dailyChallenges.length);
      }
    };
    
    generateChallenges();
  }, [childId, onNewChallenges]);
  
  // Handle challenge completion with visual feedback
  const handleChallengeComplete = (challengeId: string) => {
    // Set the challenge ID for completion animation
    setCompletionAnimation(challengeId);
    
    // Update the challenge progress
    setChallenges(prevChallenges => 
      prevChallenges.map(challenge => 
        challenge.id === challengeId 
          ? { ...challenge, progress: 100 } 
          : challenge
      )
    );
    
    // Trigger confetti effect for visual feedback
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00E2FF', '#FF5BA3', '#FFD54F', '#00D68F'],
      disableForReducedMotion: true
    });
    
    // Show success toast
    toast.success("Challenge completed!", {
      description: `Great job! You've earned ${challenges.find(c => c.id === challengeId)?.reward || 0} sparks!`,
      icon: <CheckCircle className="h-5 w-5 text-wonderwhiz-green" />
    });
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setCompletionAnimation(null);
      
      // Notify parent component if needed
      if (onComplete) {
        onComplete();
      }
    }, 1000);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }
  };
  
  const completionVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: [1, 1.1, 1],
      transition: { duration: 0.5 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-indigo-950/70 backdrop-blur-sm rounded-2xl border border-wonderwhiz-light-purple/30 p-5 shadow-lg"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 flex items-center justify-center mr-3 border border-white/10">
            <Trophy className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          </div>
          <div>
            <h3 className="text-xl font-nunito font-bold text-white">Today's Challenges</h3>
            <p className="text-sm font-inter text-white/70">Earn rewards by completing challenges</p>
          </div>
        </div>
        
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 flex items-center justify-center"
        >
          <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -1 }}
            animate={completionAnimation === challenge.id ? "animate" : "initial"}
            variants={completionAnimation === challenge.id ? completionVariants : undefined}
            onClick={() => challenge.progress < 100 && handleChallengeComplete(challenge.id)}
            className={cn(
              "p-4 rounded-lg transition-all overflow-hidden group border cursor-pointer",
              challenge.progress === 100 
                ? "bg-gradient-to-r from-wonderwhiz-green/15 to-wonderwhiz-green/5 border-wonderwhiz-green/30" 
                : "bg-gradient-to-r from-wonderwhiz-deep-purple/20 to-wonderwhiz-deep-purple/10 border-white/10 hover:border-white/20"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border border-white/10",
                  challenge.progress === 100 
                    ? "bg-gradient-to-br from-wonderwhiz-green/30 to-wonderwhiz-green/20" 
                    : "bg-gradient-to-br from-wonderwhiz-deep-purple/50 to-wonderwhiz-deep-purple/30"
                )}>
                  {challenge.progress === 100 ? (
                    <CheckCircle className="h-5 w-5 text-wonderwhiz-green" />
                  ) : (
                    challenge.icon
                  )}
                </div>
                
                <div>
                  <div className="flex items-center">
                    <h4 className="font-nunito font-semibold text-white">{challenge.title}</h4>
                    {challenge.progress === 100 && (
                      <Badge className="ml-2 bg-wonderwhiz-green/20 text-wonderwhiz-green border-wonderwhiz-green/20 text-[10px]">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs font-inter text-white/70 mt-0.5">{challenge.description}</p>
                  <div className="flex items-center mt-1.5">
                    <Clock className="h-3 w-3 text-white/60 mr-1" />
                    <span className="text-white/60 text-xs font-inter">{challenge.timeEstimate}</span>
                    
                    <div className="ml-3 flex items-center">
                      <Sparkles className="h-3 w-3 text-wonderwhiz-vibrant-yellow mr-1" />
                      <span className="text-wonderwhiz-vibrant-yellow text-xs font-inter">+{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-3 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div 
                className={cn(
                  "h-full rounded-full",
                  challenge.progress === 100 
                    ? "bg-gradient-to-r from-wonderwhiz-green to-wonderwhiz-cyan"
                    : "bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
                )} 
                style={{ width: `${challenge.progress}%` }}
                initial={{ width: "0%" }}
                animate={{ width: `${challenge.progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
