
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

interface WelcomeHeaderProps {
  childName: string;
  streakDays: number;
  sparksBalance: number;
  childAge?: number;
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  childName,
  streakDays,
  sparksBalance,
  childAge = 10
}) => {
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getPersonalizedMessage = () => {
    if (streakDays > 10) {
      return `Amazing ${streakDays}-day streak!`;
    } else if (streakDays > 0) {
      return `${streakDays} day${streakDays > 1 ? 's' : ''} streak!`;
    }
    return "Welcome back!";
  };
  
  const renderAvatar = () => {
    const initial = childName.charAt(0).toUpperCase();
    
    return (
      <Avatar className="h-14 w-14 border-2 border-white/20">
        <div className="bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple w-full h-full flex items-center justify-center text-2xl font-medium text-white">
          {initial}
        </div>
      </Avatar>
    );
  };
  
  return (
    <motion.div 
      className="mb-6 flex items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {renderAvatar()}
      
      <div className="ml-4">
        <motion.h1 
          className="text-2xl sm:text-3xl font-bold text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {getTimeBasedGreeting()}, {childName}!
        </motion.h1>
        
        <motion.div 
          className="flex items-center gap-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {streakDays > 0 && (
            <div className="flex items-center gap-1 text-amber-300">
              <Star className="h-4 w-4" />
              <span>{getPersonalizedMessage()}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-wonderwhiz-vibrant-yellow">
            <Sparkles className="h-4 w-4" />
            <span>{sparksBalance} Sparks</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WelcomeHeader;
