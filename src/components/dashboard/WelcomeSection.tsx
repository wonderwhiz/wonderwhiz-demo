
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartDashboard from './SmartDashboard';
import { Sparkles, Brain, Star, Rocket, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
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
  
  // Launch confetti when streak days are over 5
  React.useEffect(() => {
    if (childProfile?.streak_days >= 5) {
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8b5cf6', '#10b981', '#3b82f6', '#ec4899', '#f59e0b'],
          disableForReducedMotion: true
        });
      }, 1000);
    }
  }, [childProfile?.streak_days]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 sm:py-8 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="space-y-4">
          {/* Main greeting and streak section */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {getGreeting()}
              </h1>
              <p className="text-white/70 text-sm sm:text-base mt-1">
                {getFunMessage()}
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {childProfile?.streak_days > 0 && (
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
                  <div className="flex items-center">
                    <Rocket className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                    <div>
                      <Badge variant="outline" className="bg-wonderwhiz-gold/20 text-wonderwhiz-gold border-wonderwhiz-gold/20">
                        {childProfile.streak_days} day streak!
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                  <span className="text-white font-medium text-sm">
                    {childProfile?.sparks_balance || 0} Sparks
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Main search card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card className="bg-white/5 border-white/10 p-4">
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-full mb-3">
                  <Search className="h-5 w-5 text-wonderwhiz-gold" />
                </div>
                <h2 className="text-xl font-semibold text-white">What would you like to explore?</h2>
                <p className="text-white/60 text-sm mt-1">Type a question or choose from suggestions below</p>
              </div>
              
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, staggerChildren: 0.1 }}
              >
                {[
                  { id: 'space', name: 'Space', icon: <Star className="h-4 w-4" /> },
                  { id: 'animals', name: 'Animals', icon: <BookOpen className="h-4 w-4" /> },
                  { id: 'science', name: 'Science', icon: <Brain className="h-4 w-4" /> },
                  { id: 'all', name: 'All Topics', icon: <Sparkles className="h-4 w-4" /> }
                ].map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`px-3 py-2 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                      selectedCategory === category.id 
                        ? 'bg-wonderwhiz-bright-pink text-white' 
                        : 'bg-white/10 text-white/80 hover:bg-white/15'
                    }`}
                    onClick={() => setSelectedCategory(
                      selectedCategory === category.id ? null : category.id
                    )}
                  >
                    <span className="mr-1.5">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </motion.button>
                ))}
              </motion.div>
            </Card>
          </motion.div>
          
          <SmartDashboard
            childId={childId}
            childProfile={childProfile}
            curioSuggestions={curioSuggestions}
            isLoadingSuggestions={isLoadingSuggestions}
            onCurioSuggestionClick={handleCurioSuggestionClick}
            handleRefreshSuggestions={handleRefreshSuggestions}
            pastCurios={pastCurios}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeSection;
