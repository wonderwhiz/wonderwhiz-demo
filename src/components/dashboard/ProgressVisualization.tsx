import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Zap, Target, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ProgressVisualizationProps {
  childProfile: any;
  streakDays: number;
  sparksBalance: number;
  completedTopics?: number;
  totalLearningTime?: number;
}

const ProgressVisualization: React.FC<ProgressVisualizationProps> = ({
  childProfile,
  streakDays,
  sparksBalance,
  completedTopics = 12,
  totalLearningTime = 150
}) => {
  const age = childProfile?.age || 10;

  // 5-7 Years - Visual stars and animations
  if (age <= 7) {
    const starCount = Math.min(Math.floor(sparksBalance / 20), 10);
    
    return (
      <Card className="bg-[#1A0B2E] border-4 border-wonderwhiz-vibrant-yellow/80">
        <CardContent className="p-6">
          <h3 className="text-2xl font-bold text-white text-center mb-4">
            Your Amazing Progress! ⭐
          </h3>
          
          {/* Star Display */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: index < starCount ? 1 : 0.3 }}
                transition={{ delay: index * 0.1, type: "spring" }}
                className="flex justify-center"
              >
                <Star 
                  className={`h-8 w-8 ${
                    index < starCount 
                      ? 'text-wonderwhiz-vibrant-yellow fill-current' 
                      : 'text-white/20'
                  }`}
                />
              </motion.div>
            ))}
          </div>

          {/* Simple Stats */}
          <div className="space-y-3">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <span className="text-3xl">🔥</span>
              <p className="text-white font-bold text-lg">
                {streakDays} days learning!
              </p>
            </div>
            
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <span className="text-3xl">✨</span>
              <p className="text-white font-bold text-lg">
                {sparksBalance} sparks earned!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // 8-11 Years - Achievement-based progression
  if (age <= 11) {
    const achievements = [
      { 
        icon: Zap, 
        title: 'Learning Streak', 
        value: `${streakDays} days`, 
        progress: Math.min(streakDays / 7, 1),
        color: 'text-orange-400'
      },
      { 
        icon: Brain, 
        title: 'Topics Mastered', 
        value: `${completedTopics}`, 
        progress: completedTopics / 20,
        color: 'text-wonderwhiz-cyan'
      },
      { 
        icon: Star, 
        title: 'Sparks Collected', 
        value: `${sparksBalance}`, 
        progress: sparksBalance / 500,
        color: 'text-wonderwhiz-vibrant-yellow'
      }
    ];

    return (
      <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-purple/60">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            Your Achievements
          </h3>
          
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.15 }}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <achievement.icon className={`h-5 w-5 ${achievement.color}`} />
                    <span className="text-white font-medium">{achievement.title}</span>
                  </div>
                  <span className="text-white font-bold">{achievement.value}</span>
                </div>
                
                <div className="w-full bg-white/20 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      achievement.color.includes('orange') ? 'from-orange-400 to-red-400' :
                      achievement.color.includes('cyan') ? 'from-wonderwhiz-cyan to-blue-400' :
                      'from-wonderwhiz-vibrant-yellow to-yellow-400'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress * 100}%` }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // 12-16 Years - Advanced analytics
  const stats = [
    { label: 'Learning Streak', value: `${streakDays} days`, trend: '+2' },
    { label: 'Knowledge Points', value: sparksBalance.toLocaleString(), trend: '+45' },
    { label: 'Topics Completed', value: `${completedTopics}`, trend: '+3' },
    { label: 'Study Time', value: `${totalLearningTime}min`, trend: '+20' },
    { label: 'Accuracy Rate', value: '94%', trend: '+5%' },
    { label: 'Weekly Goal', value: '85%', trend: 'On track' }
  ];

  return (
    <Card className="bg-[#1A0B2E] border border-white/20">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Learning Analytics</h3>
          <Target className="h-5 w-5 text-wonderwhiz-cyan" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10"
            >
              <div className="text-2xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-white/60 text-sm mb-2">
                {stat.label}
              </div>
              <div className="text-xs text-wonderwhiz-cyan">
                {stat.trend.startsWith('+') ? '↗' : stat.trend.startsWith('-') ? '↘' : '→'} {stat.trend}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Graph Placeholder */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="h-24 bg-white/5 rounded-lg flex items-center justify-center">
            <div className="text-white/60 text-sm">Learning progress over time</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressVisualization;