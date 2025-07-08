import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Target, Flame, Star, Zap, Brain, Heart, Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface IntelligentEngagementSystemProps {
  childProfile: any;
  onEngagementAction: (action: string, data?: any) => void;
}

interface EngagementMetric {
  name: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  isUnlocked: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const IntelligentEngagementSystem: React.FC<IntelligentEngagementSystemProps> = ({
  childProfile,
  onEngagementAction
}) => {
  const [currentStreak, setCurrentStreak] = useState(5);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetric[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  
  const isYoungChild = (childProfile?.age || 10) <= 8;

  useEffect(() => {
    // Initialize engagement metrics
    const metrics: EngagementMetric[] = [
      {
        name: 'Curiosity Score',
        value: 92,
        change: +8,
        icon: <Brain className="h-5 w-5" />,
        color: 'text-wonderwhiz-cyan',
        description: 'How much you love learning!'
      },
      {
        name: 'Exploration Level',
        value: 87,
        change: +15,
        icon: <Rocket className="h-5 w-5" />,
        color: 'text-wonderwhiz-bright-pink',
        description: 'Your adventure spirit!'
      },
      {
        name: 'Focus Power',
        value: 78,
        change: +3,
        icon: <Target className="h-5 w-5" />,
        color: 'text-wonderwhiz-vibrant-yellow',
        description: 'How well you concentrate!'
      },
      {
        name: 'Joy Factor',
        value: 95,
        change: +12,
        icon: <Heart className="h-5 w-5" />,
        color: 'text-wonderwhiz-purple',
        description: 'Fun level while learning!'
      }
    ];
    setEngagementMetrics(metrics);

    // Initialize achievements
    const achievementList: Achievement[] = [
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: '5 days of continuous learning!',
        icon: '🔥',
        progress: 100,
        isUnlocked: true,
        rarity: 'rare'
      },
      {
        id: 'curious_explorer',
        title: 'Curious Explorer',
        description: 'Asked 50 amazing questions',
        icon: '🔍',
        progress: 85,
        isUnlocked: false,
        rarity: 'common'
      },
      {
        id: 'knowledge_wizard',
        title: 'Knowledge Wizard',
        description: 'Completed 10 encyclopedia topics',
        icon: '🧙‍♂️',
        progress: 60,
        isUnlocked: false,
        rarity: 'epic'
      },
      {
        id: 'star_learner',
        title: 'Star Learner',
        description: 'Perfect week of learning!',
        icon: '⭐',
        progress: 40,
        isUnlocked: false,
        rarity: 'legendary'
      }
    ];
    setAchievements(achievementList);

    // Set motivational message based on performance
    setMotivationalMessage(generateMotivationalMessage());
  }, [childProfile]);

  const generateMotivationalMessage = () => {
    const messages = isYoungChild ? [
      "You're becoming super smart! 🌟",
      "Every question makes you stronger! 💪",
      "You're a learning superhero! 🦸‍♀️",
      "Your brain is growing bigger! 🧠✨"
    ] : [
      "Your intellectual curiosity is inspiring! 🚀",
      "You're developing critical thinking skills! 🎯",
      "Your learning momentum is unstoppable! ⚡",
      "Knowledge is your superpower! 🌟"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-400/20';
      case 'rare': return 'border-blue-400 bg-blue-400/20';
      case 'epic': return 'border-purple-400 bg-purple-400/20';
      case 'legendary': return 'border-yellow-400 bg-yellow-400/20';
      default: return 'border-gray-400 bg-gray-400/20';
    }
  };

  const triggerCelebration = () => {
    setCelebrationTrigger(true);
    setTimeout(() => setCelebrationTrigger(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Engagement Metrics Dashboard */}
      <Card className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 via-wonderwhiz-purple/30 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 backdrop-blur-lg overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {isYoungChild ? '🎮 Your Learning Powers' : '📊 Engagement Analytics'}
            </h3>
            <motion.div
              animate={{ rotate: celebrationTrigger ? [0, 360] : 0 }}
              className="text-2xl"
            >
              {currentStreak >= 5 ? '🔥' : '⭐'}
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementMetrics.map((metric, index) => (
              <motion.div
                key={metric.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={metric.color}>
                    {metric.icon}
                  </div>
                  <motion.div
                    className={`text-xs px-2 py-1 rounded-full ${
                      metric.change > 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    {metric.change > 0 ? '+' : ''}{metric.change}
                  </motion.div>
                </div>
                
                <motion.div
                  className="text-2xl font-bold text-white mb-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: "spring" }}
                >
                  {metric.value}%
                </motion.div>
                
                <div className="text-xs text-white/70 mb-2">{metric.name}</div>
                
                {/* Progress bar */}
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${
                      metric.color.includes('cyan') ? 'from-wonderwhiz-cyan to-wonderwhiz-bright-pink' :
                      metric.color.includes('pink') ? 'from-wonderwhiz-bright-pink to-wonderwhiz-purple' :
                      metric.color.includes('yellow') ? 'from-wonderwhiz-vibrant-yellow to-wonderwhiz-cyan' :
                      'from-wonderwhiz-purple to-wonderwhiz-bright-pink'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.value}%` }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements Showcase */}
      <Card className="bg-white/5 backdrop-blur-sm border-white/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Trophy className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
              {isYoungChild ? 'Your Awesome Badges' : 'Achievement Progress'}
            </h3>
            <Button
              onClick={triggerCelebration}
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
            >
              View All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.slice(0, 4).map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)} ${
                  achievement.isUnlocked ? 'opacity-100' : 'opacity-60'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    className="text-3xl"
                    animate={{ 
                      scale: achievement.isUnlocked ? [1, 1.2, 1] : 1,
                      rotate: achievement.isUnlocked ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 2, repeat: achievement.isUnlocked ? Infinity : 0 }}
                  >
                    {achievement.icon}
                  </motion.div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-white/70 text-xs">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.isUnlocked && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-wonderwhiz-vibrant-yellow"
                    >
                      <Star className="h-4 w-4" />
                    </motion.div>
                  )}
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  />
                </div>
                <div className="text-right text-xs text-white/60 mt-1">
                  {achievement.progress}%
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Motivational Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Card className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-bright-pink/30 backdrop-blur-lg">
          <CardContent className="p-6">
            <motion.p
              className="text-lg font-medium text-white"
              animate={{ scale: celebrationTrigger ? [1, 1.05, 1] : 1 }}
            >
              {motivationalMessage}
            </motion.p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Celebration Effects */}
      <AnimatePresence>
        {celebrationTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight,
                  rotate: 0
                }}
                animate={{ 
                  y: -100,
                  rotate: 360
                }}
                transition={{ 
                  duration: 3,
                  delay: Math.random() * 1
                }}
              >
                {['🎉', '⭐', '🎊', '✨', '🏆'][Math.floor(Math.random() * 5)]}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentEngagementSystem;