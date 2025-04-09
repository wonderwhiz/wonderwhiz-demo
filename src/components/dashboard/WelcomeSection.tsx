
import React from 'react';
import { motion } from 'framer-motion';
import SmartDashboard from './SmartDashboard';
import { Sparkles, Brain, Star, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import AnimatedMascot from './AnimatedMascot';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
  childProfile: any;
  pastCurios: any[];
  childId: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  handleCurioSuggestionClick,
  childProfile,
  pastCurios,
  childId
}) => {
  // Get greeting based on time of day and child profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };

  // Get a fun message based on time or randomized
  const getFunMessage = () => {
    const messages = [
      "What amazing things will you discover today?",
      "Your brain is ready for new adventures!",
      "Every question leads to awesome discoveries!",
      "What are you curious about right now?",
      "The more you ask, the more you'll learn!"
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 px-4"
    >
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          {/* Main greeting section */}
          <motion.div 
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="flex items-center gap-4">
              <AnimatedMascot 
                childName={childProfile?.name} 
                streakDays={childProfile?.streak_days}
              />
              
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  {getGreeting()}
                </h1>
                <p className="text-white/70 text-sm sm:text-base mt-1">
                  {getFunMessage()}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {childProfile?.streak_days > 0 && (
                <Badge variant="outline" className="bg-wonderwhiz-gold/20 text-wonderwhiz-gold border-wonderwhiz-gold/20 flex items-center gap-1 px-3 py-1">
                  <Rocket className="h-3.5 w-3.5" />
                  <span>{childProfile.streak_days} day streak!</span>
                </Badge>
              )}
              
              <div className="flex items-center gap-1 px-3 py-1 bg-white/10 rounded-full">
                <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-gold" />
                <span className="text-white font-medium text-sm">
                  {childProfile?.sparks_balance || 0}
                </span>
              </div>
            </div>
          </motion.div>
          
          <SmartDashboard
            childId={childId}
            childProfile={childProfile}
            curioSuggestions={curioSuggestions}
            isLoadingSuggestions={isLoadingSuggestions}
            onCurioSuggestionClick={handleCurioSuggestionClick}
            handleRefreshSuggestions={handleRefreshSuggestions}
            pastCurios={pastCurios}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
