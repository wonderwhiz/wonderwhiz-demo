
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SmartDashboard from './SmartDashboard';
import { Sparkles, BookOpen, Brain, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

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
  
  const categories = [
    { id: 'space', name: 'Space', icon: <Star className="h-4 w-4" /> },
    { id: 'animals', name: 'Animals', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'science', name: 'Science', icon: <Brain className="h-4 w-4" /> },
    { id: 'all', name: 'All Topics', icon: <Sparkles className="h-4 w-4" /> }
  ];

  // Get greeting based on time of day and child profile
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}!`;
    if (hour < 18) return `Good afternoon, ${name}!`;
    return `Good evening, ${name}!`;
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-6 sm:py-8 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {getGreeting()}
              </h1>
              {childProfile?.streak_days > 0 && (
                <div className="flex items-center mt-1.5">
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, childProfile.streak_days))].map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        className={`h-2 w-2 rounded-full ${i < childProfile.streak_days ? 'bg-wonderwhiz-gold' : 'bg-white/20'}`} 
                      />
                    ))}
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-white/70 text-xs ml-2"
                  >
                    {childProfile.streak_days} day learning streak!
                  </motion.p>
                </div>
              )}
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm px-3.5 py-2 rounded-xl border border-white/10">
              <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                <span className="text-white font-medium text-sm">
                  {childProfile?.sparks_balance || 0} Sparks
                </span>
              </div>
            </div>
          </motion.div>
          
          {/* Quick category filters */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-2"
          >
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-2 rounded-lg flex items-center justify-center transition-colors ${
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
