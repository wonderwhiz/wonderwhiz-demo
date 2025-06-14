
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Crown, Heart, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';

interface Achievement {
  id: string;
  type: 'streak' | 'sparks' | 'exploration' | 'learning' | 'milestone';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface CelebrationSystemProps {
  childId: string;
  streakDays: number;
  sparksBalance: number;
  explorationsCount: number;
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({
  childId,
  streakDays,
  sparksBalance,
  explorationsCount
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const generateAchievements = (): Achievement[] => [
    {
      id: 'first-exploration',
      type: 'exploration',
      title: 'First Explorer',
      description: 'Started your first learning adventure!',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-wonderwhiz-bright-pink',
      earned: explorationsCount >= 1,
      progress: Math.min(explorationsCount, 1),
      maxProgress: 1
    },
    {
      id: 'streak-3',
      type: 'streak',
      title: 'Learning Habit',
      description: '3 days of continuous learning!',
      icon: <Star className="h-6 w-6" />,
      color: 'text-wonderwhiz-vibrant-yellow',
      earned: streakDays >= 3,
      progress: Math.min(streakDays, 3),
      maxProgress: 3
    },
    {
      id: 'sparks-50',
      type: 'sparks',
      title: 'Spark Collector',
      description: 'Collected 50 sparks of knowledge!',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-wonderwhiz-bright-pink',
      earned: sparksBalance >= 50,
      progress: Math.min(sparksBalance, 50),
      maxProgress: 50
    },
    {
      id: 'explorations-10',
      type: 'exploration',
      title: 'Curious Mind',
      description: 'Completed 10 explorations!',
      icon: <Crown className="h-6 w-6" />,
      color: 'text-wonderwhiz-purple',
      earned: explorationsCount >= 10,
      progress: Math.min(explorationsCount, 10),
      maxProgress: 10
    },
    {
      id: 'streak-7',
      type: 'streak',
      title: 'Weekly Warrior',
      description: '7 days of amazing learning!',
      icon: <Trophy className="h-6 w-6" />,
      color: 'text-wonderwhiz-gold',
      earned: streakDays >= 7,
      progress: Math.min(streakDays, 7),
      maxProgress: 7
    }
  ];

  useEffect(() => {
    const currentAchievements = generateAchievements();
    const previousAchievements = achievements;
    
    // Find newly earned achievements
    const newlyEarned = currentAchievements.filter(current => {
      const previous = previousAchievements.find(prev => prev.id === current.id);
      return current.earned && (!previous || !previous.earned);
    });

    setAchievements(currentAchievements);

    if (newlyEarned.length > 0) {
      setNewAchievements(newlyEarned);
      setShowCelebration(true);
      
      // Trigger confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      });

      // Auto-hide after 5 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [streakDays, sparksBalance, explorationsCount]);

  const handleDismissCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <>
      {/* Achievement Progress Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`p-4 ${achievement.earned ? 'bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30' : 'bg-white/5 border-white/10'} transition-all duration-300`}>
              <div className="flex items-center gap-3 mb-2">
                <div className={`${achievement.earned ? achievement.color : 'text-white/40'} transition-colors`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-white/60'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-white/50 text-sm">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                  >
                    <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow fill-current" />
                  </motion.div>
                )}
              </div>
              
              {achievement.maxProgress && (
                <div className="w-full bg-white/10 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(achievement.progress! / achievement.maxProgress) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
              )}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && newAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleDismissCelebration}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-gradient-to-br from-wonderwhiz-bright-pink via-wonderwhiz-purple to-wonderwhiz-deep-purple p-8 rounded-3xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <Trophy className="h-16 w-16 text-wonderwhiz-vibrant-yellow mx-auto" />
              </motion.div>

              <h2 className="text-3xl font-bold text-white mb-4">
                🎉 Achievement Unlocked!
              </h2>

              <div className="space-y-4">
                {newAchievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={achievement.color}>
                        {achievement.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-bold text-white">{achievement.title}</h3>
                        <p className="text-white/70 text-sm">{achievement.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDismissCelebration}
                className="mt-6 bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Awesome! Keep Learning! 🚀
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CelebrationSystem;
