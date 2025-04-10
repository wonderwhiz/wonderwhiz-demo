
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Clock, Brain, BookOpen, Zap, Rocket, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DailyChallengeProps {
  childId: string;
  onNewChallenges?: (count: number) => void;
}

const DailyChallenge: React.FC<DailyChallengeProps> = ({ 
  childId,
  onNewChallenges
}) => {
  const [challenges, setChallenges] = useState<any[]>([]);
  
  useEffect(() => {
    // Generate daily challenges - this would normally come from the backend
    const generateChallenges = () => {
      const dailyChallenges = [
        {
          id: 'quiz',
          title: 'Answer a quiz correctly',
          description: 'Complete any quiz in your curios',
          type: 'quiz',
          icon: <Brain className="h-5 w-5 text-indigo-400" />,
          reward: 5,
          timeEstimate: '2 min',
          progress: 0
        },
        {
          id: 'read',
          title: 'Read an interesting fact',
          description: 'Explore a fact card in any curio',
          type: 'read',
          icon: <BookOpen className="h-5 w-5 text-amber-400" />,
          reward: 3,
          timeEstimate: '3 min',
          progress: 0
        },
        {
          id: 'create',
          title: 'Create something new',
          description: 'Complete a creative challenge',
          type: 'create',
          icon: <Zap className="h-5 w-5 text-green-400" />,
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
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-amber-500/10 to-amber-700/10 backdrop-blur-sm rounded-xl border border-amber-500/20 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500/30 to-amber-700/30 flex items-center justify-center mr-3">
            <Trophy className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">Today's Challenges</h3>
            <p className="text-sm text-white/60">Earn rewards by completing challenges</p>
          </div>
        </div>
        
        <motion.div 
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="h-10 w-10 flex items-center justify-center"
        >
          <Sparkles className="h-5 w-5 text-amber-400" />
        </motion.div>
      </div>
      
      <div className="space-y-3">
        {challenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -1 }}
            className={cn(
              "p-3 rounded-lg transition-all overflow-hidden group border",
              challenge.progress === 100 
                ? "bg-gradient-to-r from-green-500/10 to-green-600/10 border-green-500/20" 
                : "bg-gradient-to-r from-amber-500/5 to-amber-600/5 border-amber-500/10"
            )}
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  challenge.progress === 100 
                    ? "bg-gradient-to-br from-green-500 to-green-600" 
                    : "bg-gradient-to-br from-amber-500 to-amber-600"
                )}>
                  {challenge.icon}
                </div>
                
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-white text-sm">{challenge.title}</h4>
                    {challenge.progress === 100 && (
                      <Badge className="ml-2 bg-green-500/20 text-green-300 text-[10px] border-green-500/30">
                        Completed
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-white/60 mt-0.5">{challenge.description}</p>
                  <div className="flex items-center mt-1">
                    <Clock className="h-3 w-3 text-white/60 mr-1" />
                    <span className="text-white/60 text-xs">{challenge.timeEstimate}</span>
                    
                    <div className="ml-3 flex items-center">
                      <Sparkles className="h-3 w-3 text-amber-300 mr-1" />
                      <span className="text-amber-300 text-xs">+{challenge.reward}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="mt-2 w-full bg-white/10 rounded-full h-1 overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full",
                  challenge.progress === 100 
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-amber-500 to-amber-400"
                )} 
                style={{ width: `${challenge.progress}%` }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DailyChallenge;
