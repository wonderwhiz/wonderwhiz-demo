
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Star, Zap } from 'lucide-react';
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
    let icon = <Sun className="h-6 w-6" />;

    if (hour < 12) {
      timeGreeting = 'Good morning';
      icon = <Sun className="h-6 w-6 text-amber-400" />;
    } else if (hour < 17) {
      timeGreeting = 'Good afternoon';
      icon = <Sun className="h-6 w-6 text-orange-400" />;
    } else {
      timeGreeting = 'Good evening';
      icon = <Moon className="h-6 w-6 text-blue-300" />;
    }

    setTimeIcon(icon);

    // Personalized greeting based on age and context
    if (childAge <= 7) {
      setGreeting(`${timeGreeting}, ${childName}! 🌟`);
      setMotivationalMessage("What amazing thing will you discover today?");
    } else if (childAge <= 11) {
      setGreeting(`${timeGreeting}, ${childName}! 🚀`);
      setMotivationalMessage("Ready to explore something incredible?");
    } else {
      setGreeting(`${timeGreeting}, ${childName}! ⚡`);
      setMotivationalMessage("What fascinating topic will you dive into today?");
    }
  }, [childName, childAge]);

  const getStreakMessage = () => {
    if (streakDays === 0) return null;
    if (streakDays === 1) return "You're building a learning habit! 🌱";
    if (streakDays < 5) return `${streakDays} days of curiosity in a row! 🔥`;
    if (streakDays < 10) return `Wow! ${streakDays} days of learning! You're amazing! ⭐`;
    return `Incredible ${streakDays}-day learning streak! You're a true explorer! 🏆`;
  };

  const getSparksMessage = () => {
    if (sparksBalance >= 100) return "You're sparkling with knowledge! ✨";
    if (sparksBalance >= 50) return "Your spark collection is growing! 💫";
    if (sparksBalance >= 20) return "Great job collecting sparks! ⚡";
    return "Start collecting sparks by exploring! 🔥";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            {timeIcon}
          </motion.div>
          
          <div className="flex-1">
            <motion.h2 
              className="text-2xl font-bold text-white mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {greeting}
            </motion.h2>
            
            <motion.p 
              className="text-white/70"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              {motivationalMessage}
            </motion.p>
          </div>

          <motion.div
            animate={{ 
              y: [0, -5, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="h-8 w-8 text-wonderwhiz-vibrant-yellow" />
          </motion.div>
        </div>

        <div className="flex flex-wrap gap-3">
          {streakDays > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"
            >
              <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
              <span className="text-white text-sm font-medium">
                {getStreakMessage()}
              </span>
            </motion.div>
          )}
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full"
          >
            <Zap className="h-4 w-4 text-wonderwhiz-bright-pink" />
            <span className="text-white text-sm font-medium">
              {getSparksMessage()}
            </span>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};

export default PersonalizedWelcome;
