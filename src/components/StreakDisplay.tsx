
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Star, Calendar, Trophy, Gift, Sparkles, Snowflake } from 'lucide-react'; // Added Snowflake
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"; // Added Tooltip

interface StreakDisplayProps {
  streakDays: number;
  className?: string;
  showBadgesOnly?: boolean;
  isFreezeAvailable?: boolean; // New prop
  freezeUsedToday?: boolean; // New prop
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  streakDays, 
  className = '',
  showBadgesOnly = false,
  isFreezeAvailable = false,
  freezeUsedToday = false,
}) => {
  // Calculate days until next bonus (every 3 days)
  // Calculate days until next bonus (every 3 days), ensuring streakDays is at least 0
  const currentStreakDays = Math.max(0, streakDays);
  const daysUntilNextBonus = 3 - (currentStreakDays % 3);
  const nextBonusDay = currentStreakDays + daysUntilNextBonus;

  const getStreakIcon = () => {
    if (currentStreakDays >= 30) return <Trophy className="h-5 w-5 text-wonderwhiz-gold" />;
    if (currentStreakDays >= 14) return <Star className="h-5 w-5 text-wonderwhiz-gold" />;
    return <Flame className="h-5 w-5 text-wonderwhiz-gold" />;
  };

  if (showBadgesOnly) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <motion.div
          className="flex items-center bg-white/10 px-2 py-1 rounded-lg"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {getStreakIcon()}
          <span className="ml-1 font-medium text-white">{currentStreakDays}</span>
        </motion.div>
        {isFreezeAvailable && !freezeUsedToday && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <motion.div whileHover={{ scale: 1.1 }} className="p-1 bg-blue-500/20 rounded-full">
                  <Snowflake className="h-4 w-4 text-blue-300" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-wonderwhiz-deep-purple text-white border-wonderwhiz-purple">
                <p>Streak Freeze available!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {freezeUsedToday && (
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <motion.div whileHover={{ scale: 1.1 }} className="p-1 bg-blue-400/30 rounded-full animate-pulse">
                  <Snowflake className="h-4 w-4 text-blue-200" />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent className="bg-wonderwhiz-deep-purple text-white border-wonderwhiz-purple">
                <p>Streak saved by a freeze today!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    );
  }

  return (
    <Card className={`bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-pink/10 border-white/10 overflow-hidden ${className}`}>
      <CardContent className="pt-6 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0], 
                scale: [0, 1, 0],
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`
              }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.5, ease: "easeInOut" }}
            >
              <Sparkles className="h-3 w-3 text-wonderwhiz-gold/40" />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center mb-3 relative">
          <motion.div
            className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center mr-4 shrink-0"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            {getStreakIcon()}
          </motion.div>
          <div className="flex-grow">
            <motion.h3
              className="text-xl font-bold text-white flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {currentStreakDays}-Day Streak!
              {currentStreakDays > 0 && currentStreakDays % 3 === 0 && (
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
            {freezeUsedToday ? (
              <p className="text-blue-300 text-sm font-medium">Streak saved by a freeze!</p>
            ) : (
              <p className="text-white/70 text-sm">Keep learning every day</p>
            )}
          </div>
          {isFreezeAvailable && !freezeUsedToday && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="ml-auto">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="p-1.5 bg-blue-500/30 rounded-full border border-blue-400/50"
                  >
                    <Snowflake className="h-5 w-5 text-blue-200" />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent className="bg-wonderwhiz-deep-purple text-white border-wonderwhiz-purple">
                  <p>Streak Freeze available. Miss a day, save your streak!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/70 text-sm">
              {daysUntilNextBonus === 0 && currentStreakDays > 0 ? (
                <span className="text-wonderwhiz-gold font-medium">Streak bonus today!</span>
              ) : currentStreakDays === 0 ? (
                "Start your streak for bonuses!"
              ) : (
                `Streak bonus in ${daysUntilNextBonus} day${daysUntilNextBonus !== 1 ? 's' : ''}`
              )}
            </span>
            {currentStreakDays > 0 && (
              <span className="text-wonderwhiz-gold text-sm font-medium">
                +10 sparks at day {nextBonusDay}
              </span>
            )}
          </div>

          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${currentStreakDays > 0 ? ((3 - daysUntilNextBonus) / 3) * 100 : 0}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>

          <div className="flex justify-between mt-6">
            {[...Array(7)].map((_, i) => {
              const dayIndex = i + 1;
              const isActive = dayIndex <= (currentStreakDays % 7 || (currentStreakDays > 0 ? 7 : 0) ); // if streak is 0, nothing active
              const isToday = dayIndex === (currentStreakDays % 7 || (currentStreakDays > 0 ? 7 : 0) );
              
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
                    animate={isToday && currentStreakDays > 0 ? {
                      scale: [1, 1.1, 1],
                      boxShadow: ["0px 0px 0px rgba(255,199,44,0)", "0px 0px 20px rgba(255,199,44,0.5)", "0px 0px 0px rgba(255,199,44,0)"]
                    } : {}}
                    transition={{ duration: 2, repeat: (isToday && currentStreakDays > 0) ? Infinity : 0, repeatDelay: 1 }}
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

          {currentStreakDays >= 7 && (
            <motion.div
              className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-wonderwhiz-gold text-sm font-medium">
                {currentStreakDays >= 30 ? '🏆' : '⭐'} Amazing! You've been learning for {currentStreakDays} days in a row!
              </p>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakDisplay;
