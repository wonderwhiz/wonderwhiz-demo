
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Star, Zap, Crown, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PersonalizedWelcomeProps {
  childName: string;
  childAge: number;
  streakDays: number;
  lastActivity?: string;
  sparksBalance: number;
}

const PersonalizedWelcome: React.FC<PersonalizedWelcomeProps> = ({
  childName,
  childAge,
  streakDays,
  lastActivity,
  sparksBalance
}) => {
  const [greeting, setGreeting] = useState('');
  const [timeIcon, setTimeIcon] = useState<React.ReactNode>(<Sun />);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    let timeGreeting = '';
    let icon = <Sun className="h-8 w-8" />;

    if (hour < 12) {
      timeGreeting = 'Good morning';
      icon = <Sun className="h-8 w-8 text-amber-400 drop-shadow-lg" />;
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
      icon = <Sun className="h-8 w-8 text-orange-400 drop-shadow-lg" />;
    } else {
      timeGreeting = 'Good evening';
      icon = <Moon className="h-8 w-8 text-blue-300 drop-shadow-lg" />;
    }

    setTimeIcon(icon);

    // More exciting greetings based on age
    if (childAge <= 7) {
      setGreeting(`${timeGreeting}, ${childName}! 🌟`);
      setMotivationalMessage("What magical thing will you discover today?");
    } else if (childAge <= 11) {
      setGreeting(`${timeGreeting}, ${childName}! 🚀`);
      setMotivationalMessage("Ready to explore something incredible?");
    } else {
      setGreeting(`${timeGreeting}, ${childName}! ⚡`);
      setMotivationalMessage("What fascinating adventure awaits you today?");
    }
  }, [childName, childAge]);

  const getStreakMessage = () => {
    if (streakDays === 0) return null;
    if (streakDays === 1) return "🌱 You're growing your learning power!";
    if (streakDays < 5) return `🔥 ${streakDays} days of pure curiosity!`;
    if (streakDays < 10) return `⭐ Amazing ${streakDays}-day streak! You're unstoppable!`;
    return `🏆 Incredible ${streakDays}-day learning champion!`;
  };

  const getSparksMessage = () => {
    if (sparksBalance >= 100) return "✨ You're a knowledge superstar!";
    if (sparksBalance >= 50) return "💫 Your spark collection is incredible!";
    if (sparksBalance >= 20) return "⚡ Look at all those sparks you've earned!";
    return "🔥 Ready to collect some amazing sparks?";
  };

  const level = Math.floor(sparksBalance / 50) + 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-br from-wonderwhiz-bright-pink/25 via-purple-500/20 to-wonderwhiz-vibrant-yellow/15 backdrop-blur-xl border-2 border-wonderwhiz-bright-pink/40 p-8 mb-6 shadow-2xl overflow-hidden relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360]
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-4 right-4 w-32 h-32 bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-full blur-xl"
          />
          <motion.div
            animate={{ 
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0]
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-4 left-4 w-24 h-24 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl"
          />
        </div>

        <div className="flex items-start justify-between mb-6 relative z-10">
          <div className="flex items-center gap-6">
            <motion.div
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="relative"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-wonderwhiz-vibrant-yellow via-orange-400 to-wonderwhiz-bright-pink rounded-full flex items-center justify-center shadow-2xl">
                {timeIcon}
              </div>
              
              {/* Orbiting sparkles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 text-yellow-300">✨</div>
                <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 text-pink-300">⭐</div>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 text-blue-300">💫</div>
                <div className="absolute top-1/2 -left-1 transform -translate-y-1/2 text-purple-300">🌟</div>
              </motion.div>
            </motion.div>
            
            <div className="flex-1">
              <motion.h2 
                className="text-3xl font-bold text-white mb-2 drop-shadow-lg"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {greeting}
              </motion.h2>
              
              <motion.p 
                className="text-white/90 text-lg font-medium"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {motivationalMessage}
              </motion.p>
            </div>
          </div>

          {/* Level and Sparks Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col items-end gap-2"
          >
            <div className="flex items-center gap-2 bg-gradient-to-r from-wonderwhiz-vibrant-yellow/30 to-orange-400/20 px-4 py-2 rounded-full backdrop-blur-sm border border-wonderwhiz-vibrant-yellow/40">
              <Crown className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
              <span className="text-white font-bold">Level {level}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-gradient-to-r from-wonderwhiz-bright-pink/30 to-purple-500/20 px-4 py-2 rounded-full backdrop-blur-sm border border-wonderwhiz-bright-pink/40">
              <Sparkles className="h-5 w-5 text-wonderwhiz-bright-pink" />
              <span className="text-white font-bold">{sparksBalance} sparks</span>
            </div>
          </motion.div>
        </div>

        {/* Achievement Badges */}
        <div className="flex flex-wrap gap-3 relative z-10">
          {streakDays > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="flex items-center gap-3 bg-gradient-to-r from-green-400/25 via-emerald-400/20 to-teal-400/15 px-4 py-3 rounded-2xl backdrop-blur-sm border-2 border-green-400/30 shadow-lg"
            >
              <motion.div
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <Star className="h-6 w-6 text-wonderwhiz-vibrant-yellow drop-shadow-lg" />
              </motion.div>
              <span className="text-white text-sm font-bold drop-shadow">
                {getStreakMessage()}
              </span>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex items-center gap-3 bg-gradient-to-r from-wonderwhiz-bright-pink/25 via-purple-500/20 to-wonderwhiz-vibrant-yellow/15 px-4 py-3 rounded-2xl backdrop-blur-sm border-2 border-wonderwhiz-bright-pink/30 shadow-lg"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Rocket className="h-6 w-6 text-wonderwhiz-bright-pink drop-shadow-lg" />
            </motion.div>
            <span className="text-white text-sm font-bold drop-shadow">
              {getSparksMessage()}
            </span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PersonalizedWelcome;
