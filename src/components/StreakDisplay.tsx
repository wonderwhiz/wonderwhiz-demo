
import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Star, Calendar, Trophy } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StreakDisplayProps {
  streakDays: number;
  className?: string;
  showBadgesOnly?: boolean;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  streakDays, 
  className = '',
  showBadgesOnly = false
}) => {
  // Calculate days until next bonus (every 3 days)
  const daysUntilNextBonus = 3 - (streakDays % 3);
  const nextBonusDay = streakDays + daysUntilNextBonus;
  
  // Get the appropriate streak icon based on streak length
  const getStreakIcon = () => {
    if (streakDays >= 30) return <Trophy className="h-5 w-5 text-wonderwhiz-gold" />;
    if (streakDays >= 14) return <Star className="h-5 w-5 text-wonderwhiz-gold" />;
    return <Flame className="h-5 w-5 text-wonderwhiz-gold" />; 
  };
  
  // Different displays for badges-only vs full display
  if (showBadgesOnly) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex items-center bg-white/10 px-2 py-1 rounded-lg">
          {getStreakIcon()}
          <span className="ml-1 font-medium text-white">{streakDays}</span>
        </div>
      </div>
    );
  }
  
  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardContent className="pt-6">
        <div className="flex items-center mb-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center mr-3">
            {getStreakIcon()}
          </div>
          <div>
            <h3 className="text-lg font-medium text-white">{streakDays}-Day Streak!</h3>
            <p className="text-white/70 text-sm">Keep learning every day</p>
          </div>
        </div>
        
        <div className="mt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/70 text-sm">
              Streak bonus in {daysUntilNextBonus} day{daysUntilNextBonus !== 1 ? 's' : ''}
            </span>
            <span className="text-wonderwhiz-gold text-sm font-medium">
              +10 sparks at day {nextBonusDay}
            </span>
          </div>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${((3 - daysUntilNextBonus) / 3) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          
          <div className="flex justify-between mt-4">
            {[...Array(7)].map((_, i) => {
              const dayIndex = i + 1;
              const isActive = dayIndex <= (streakDays % 7 || 7);
              const isToday = dayIndex === (streakDays % 7 || 7);
              
              return (
                <div key={i} className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                    isActive 
                      ? isToday 
                        ? 'bg-gradient-to-br from-amber-500 to-red-500 animate-pulse' 
                        : 'bg-wonderwhiz-purple/50'
                      : 'bg-white/10'
                  }`}>
                    <Calendar className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/40'}`} />
                  </div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-white/40'}`}>
                    Day {dayIndex}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
