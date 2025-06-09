
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, Zap, BookOpen, Brain, Heart, Compass } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  type: 'exploration' | 'curiosity' | 'persistence' | 'creativity' | 'knowledge';
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  sparksReward: number;
}

interface AchievementSystemProps {
  childId: string;
  visible?: boolean;
  onClose?: () => void;
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  childId,
  visible = false,
  onClose
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Sample achievements - in real app, fetch from backend
  const sampleAchievements: Achievement[] = [
    {
      id: 'first-question',
      title: 'Curious Explorer',
      description: 'Asked your first question!',
      icon: Target,
      type: 'curiosity',
      progress: 1,
      maxProgress: 1,
      unlocked: true,
      rarity: 'common',
      sparksReward: 10
    },
    {
      id: 'streak-7',
      title: 'Learning Streak',
      description: 'Learn something new for 7 days in a row',
      icon: Zap,
      type: 'persistence',
      progress: 3,
      maxProgress: 7,
      unlocked: false,
      rarity: 'rare',
      sparksReward: 50
    },
    {
      id: 'topics-10',
      title: 'Knowledge Seeker',
      description: 'Explore 10 different topics',
      icon: BookOpen,
      type: 'exploration',
      progress: 7,
      maxProgress: 10,
      unlocked: false,
      rarity: 'epic',
      sparksReward: 100
    },
    {
      id: 'deep-dive',
      title: 'Deep Thinker',
      description: 'Spend 30 minutes on a single topic',
      icon: Brain,
      type: 'knowledge',
      progress: 0,
      maxProgress: 1,
      unlocked: false,
      rarity: 'rare',
      sparksReward: 75
    }
  ];

  useEffect(() => {
    setAchievements(sampleAchievements);
  }, []);

  const handleCelebration = (achievement: Achievement) => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5BA3', '#4A6FFF', '#FFE066']
    });

    // Show achievement notification
    setNewlyUnlocked([achievement]);
    setTimeout(() => setNewlyUnlocked([]), 4000);
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400';
      case 'rare': return 'text-blue-400 border-blue-400';
      case 'epic': return 'text-purple-400 border-purple-400';
      case 'legendary': return 'text-yellow-400 border-yellow-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTypeIcon = (type: Achievement['type']) => {
    switch (type) {
      case 'exploration': return Compass;
      case 'curiosity': return Target;
      case 'persistence': return Zap;
      case 'creativity': return Heart;
      case 'knowledge': return Brain;
      default: return BookOpen;
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* Achievement Panel */}
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        className="fixed right-4 top-20 bottom-4 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 z-40 overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            <h3 className="text-lg font-semibold text-white">Achievements</h3>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white"
            >
              ×
            </Button>
          )}
        </div>

        <div className="space-y-3">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            const progressPercent = (achievement.progress / achievement.maxProgress) * 100;

            return (
              <Card
                key={achievement.id}
                className={`p-3 bg-white/5 border-white/10 transition-all ${
                  achievement.unlocked 
                    ? 'ring-1 ring-wonderwhiz-bright-pink/30' 
                    : 'opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    achievement.unlocked 
                      ? 'bg-wonderwhiz-bright-pink/20' 
                      : 'bg-white/10'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${
                      achievement.unlocked 
                        ? 'text-wonderwhiz-bright-pink' 
                        : 'text-white/50'
                    }`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`text-sm font-medium ${
                        achievement.unlocked ? 'text-white' : 'text-white/70'
                      }`}>
                        {achievement.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getRarityColor(achievement.rarity)}`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>

                    <p className="text-xs text-white/60 mb-2">
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-white/60">
                          <span>{achievement.progress}/{achievement.maxProgress}</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-1.5">
                          <div 
                            className="bg-wonderwhiz-bright-pink h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div className="flex items-center gap-1 text-xs text-wonderwhiz-vibrant-yellow">
                        <Star className="h-3 w-3" />
                        <span>+{achievement.sparksReward} Sparks</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </motion.div>

      {/* Achievement Notifications */}
      <AnimatePresence>
        {newlyUnlocked.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: -100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -100, scale: 0.8 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
          >
            <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/90 to-wonderwhiz-vibrant-yellow/90 backdrop-blur-md border-white/20 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">Achievement Unlocked!</h4>
                  <p className="text-white/90 text-sm">{achievement.title}</p>
                  <p className="text-white/80 text-xs">+{achievement.sparksReward} Sparks</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </>
  );
};

export default AchievementSystem;
