import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SimplifiedProgressProps {
  childProfile: any;
  streakDays?: number;
  sparksBalance?: number;
}

const SimplifiedProgress: React.FC<SimplifiedProgressProps> = ({
  childProfile,
  streakDays = 5,
  sparksBalance = 150
}) => {
  const age = childProfile?.age || 10;
  const isYoungChild = age <= 8;

  if (isYoungChild) {
    return (
      <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-vibrant-yellow/60">
        <CardContent className="p-4">
          <div className="text-center">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              ⭐
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-1">
              Great Job!
            </h3>
            <p className="text-white/80 text-sm">
              You have {sparksBalance} sparks!
            </p>
            {streakDays > 1 && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <Flame className="h-4 w-4 text-orange-400" />
                <span className="text-white font-medium text-sm">
                  {streakDays} days in a row!
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1A0B2E] border-2 border-wonderwhiz-cyan/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-wonderwhiz-vibrant-yellow" />
            <div>
              <p className="text-white font-medium">Progress</p>
              <p className="text-white/70 text-sm">{sparksBalance} sparks earned</p>
            </div>
          </div>
          
          {streakDays > 1 && (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
              <Flame className="h-4 w-4 text-orange-400" />
              <span className="text-white font-medium text-sm">
                {streakDays} day streak
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedProgress;