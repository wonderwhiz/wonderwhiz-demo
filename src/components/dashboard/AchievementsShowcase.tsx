import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Trophy, Star, Award } from 'lucide-react';

interface AchievementsShowcaseProps {
  achievements: Array<{
    title: string;
    description: string;
    earnedAt: string;
    icon: string;
    rarity: 'common' | 'rare' | 'legendary';
  }>;
  childAge: number;
}

const AchievementsShowcase: React.FC<AchievementsShowcaseProps> = ({
  achievements,
  childAge
}) => {
  const isYoungChild = childAge <= 8;

  const getRarityStyle = (rarity: string) => {
    switch (rarity) {
      case 'legendary':
        return 'from-yellow-100 to-orange-100 border-yellow-300';
      case 'rare':
        return 'from-purple-100 to-pink-100 border-purple-300';
      default:
        return 'from-blue-100 to-indigo-100 border-blue-300';
    }
  };

  if (achievements.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-yellow-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Trophy className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isYoungChild ? "🏆 Your Awesome Badges!" : "🎖️ Achievements"}
        </h2>
      </div>

      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl bg-gradient-to-r border-2 ${getRarityStyle(achievement.rarity)}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{achievement.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {achievement.title}
                </h3>
                <p className="text-gray-700 text-sm">
                  {achievement.description}
                </p>
              </div>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default AchievementsShowcase;