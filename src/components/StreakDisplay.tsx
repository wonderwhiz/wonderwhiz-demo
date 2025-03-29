
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Calendar, Trophy, Gift, Sparkles } from 'lucide-react';
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
        <motion.div 
          className="flex items-center bg-white/10 px-2 py-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {getStreakIcon()}
          <span className="ml-1 font-medium text-white">{streakDays}</span>
        </motion.div>
      </div>
    );
  }
  
  return (
    <Card className={`bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-pink/10 border-white/10 overflow-hidden ${className}`}>
      <CardContent className="pt-6 relative">
        {/* Animated background sparkles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: [Math.random() * 100, Math.random() * 200],
                y: [Math.random() * 100, Math.random() * 200]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut" 
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`
              }}
            >
              <Sparkles className="h-3 w-3 text-wonderwhiz-gold/40" />
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center mb-3 relative">
          <motion.div 
            className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center mr-4"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {getStreakIcon()}
          </motion.div>
          <div>
            <motion.h3 
              className="text-xl font-bold text-white flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {streakDays}-Day Streak!
              {streakDays % 3 === 0 && streakDays > 0 && (
                <motion.div 
                  className="ml-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Gift className="h-5 w-5 text-wonderwhiz-pink" />
                </motion.div>
              )}
            </motion.h3>
            <p className="text-white/70 text-sm">Keep learning every day</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">
              {daysUntilNextBonus === 0 ? (
                <span className="text-wonderwhiz-gold font-medium">Streak bonus today!</span>
              ) : (
                `Streak bonus in ${daysUntilNextBonus} day${daysUntilNextBonus !== 1 ? 's' : ''}`
              )}
            </span>
            <span className="text-wonderwhiz-gold text-sm font-medium">
              +10 sparks at day {nextBonusDay}
            </span>
          </div>
          
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-amber-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${((3 - daysUntilNextBonus) / 3) * 100}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          <div className="flex justify-between mt-6">
            {[...Array(7)].map((_, i) => {
              const dayIndex = i + 1;
              const isActive = dayIndex <= (streakDays % 7 || 7);
              const isToday = dayIndex === (streakDays % 7 || 7);
              
              return (
                <motion.div 
                  key={i} 
                  className="flex flex-col items-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div 
                    className={`h-9 w-9 rounded-full flex items-center justify-center ${
                      isActive 
                        ? isToday 
                          ? 'bg-gradient-to-br from-amber-500 to-red-500' 
                          : 'bg-wonderwhiz-purple/50'
                        : 'bg-white/10'
                    }`}
                    whileHover={{ scale: 1.1, y: -2 }}
                    animate={isToday ? { 
                      scale: [1, 1.1, 1],
                      boxShadow: ["0px 0px 0px rgba(255,199,44,0)", "0px 0px 20px rgba(255,199,44,0.5)", "0px 0px 0px rgba(255,199,44,0)"]
                    } : {}}
                    transition={{ 
                      duration: 2, 
                      repeat: isToday ? Infinity : 0,
                      repeatDelay: 1
                    }}
                  >
                    <Calendar className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/40'}`} />
                  </motion.div>
                  <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-white/40'}`}>
                    Day {dayIndex}
                  </span>
                </motion.div>
              );
            })}
          </div>
          
          {streakDays >= 7 && (
            <motion.div 
              className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-wonderwhiz-gold text-sm font-medium">
                {streakDays >= 30 ? '🏆' : '⭐'} Amazing! You've been learning for {streakDays} days in a row!
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
