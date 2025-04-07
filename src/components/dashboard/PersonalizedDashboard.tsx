
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Star, BookOpen, Lightbulb, Rocket, Calendar } from 'lucide-react';
import CurioSuggestion from '@/components/CurioSuggestion';
import { format } from 'date-fns';
import ChildTaskList from '@/components/ChildTaskList';
import DailyChallenge from './DailyChallenge';
import { Card, CardContent } from '@/components/ui/card';
import StreakDisplay from '@/components/StreakDisplay';
import { supabase } from '@/integrations/supabase/client';

interface PersonalizedDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
}

const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios
}) => {
  const [activeTab, setActiveTab] = useState('recommendations');
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  
  useEffect(() => {
    // Extract recent topics from past curios
    if (pastCurios && pastCurios.length > 0) {
      const topics = pastCurios
        .slice(0, 3)
        .map(curio => curio.title);
      setRecentTopics(topics);
    }
    
    // Format the last active date
    if (childProfile?.last_active) {
      try {
        const date = new Date(childProfile.last_active);
        setLastActiveDate(format(date, 'MMMM do'));
      } catch (error) {
        console.error('Error formatting date:', error);
      }
    }
  }, [pastCurios, childProfile]);
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };
  
  const getInterestBasedMessage = () => {
    if (!childProfile?.interests || childProfile.interests.length === 0) {
      return "What would you like to explore today?";
    }
    
    const randomInterest = childProfile.interests[Math.floor(Math.random() * childProfile.interests.length)];
    return `Ready to discover more about ${randomInterest.toLowerCase()} today?`;
  };
  
  return (
    <div className="px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-center md:text-left"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {getTimeBasedGreeting()}, {childProfile?.name || 'Explorer'}!
              </h1>
              <p className="text-white/70">
                {getInterestBasedMessage()}
              </p>
              {lastActiveDate && (
                <div className="mt-1 text-sm text-white/50 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Last explored: {lastActiveDate}</span>
                </div>
              )}
            </div>
            <StreakDisplay
              streakDays={childProfile?.streak_days || 0}
              showBadgesOnly={false}
              className="mt-4 md:mt-0"
            />
          </div>
        </motion.div>
        
        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="flex space-x-2 justify-center sm:justify-start overflow-x-auto pb-2">
            <Button
              variant={activeTab === 'recommendations' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('recommendations')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Star className="w-4 h-4" />
              <span>Recommendations</span>
            </Button>
            <Button
              variant={activeTab === 'recent' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('recent')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>Recent Topics</span>
            </Button>
            <Button
              variant={activeTab === 'challenges' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('challenges')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Rocket className="w-4 h-4" />
              <span>Challenges</span>
            </Button>
          </div>
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">We think you'll like these</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white hover:text-wonderwhiz-gold transition-colors" 
                  onClick={handleRefreshSuggestions} 
                  disabled={isLoadingSuggestions}
                >
                  <motion.div 
                    animate={isLoadingSuggestions ? { rotate: 360 } : {}} 
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                    className={isLoadingSuggestions ? "animate-spin" : ""}
                  >
                    <RefreshCw className="h-5 w-5" />
                  </motion.div>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                {curioSuggestions.map((suggestion, index) => (
                  <CurioSuggestion 
                    key={`${suggestion}-${index}`} 
                    suggestion={suggestion} 
                    onClick={onCurioSuggestionClick} 
                    index={index} 
                    directGenerate={true} 
                    profileId={childId}
                  />
                ))}
              </div>
            </motion.div>
          )}
          
          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-white mb-4">Pick up where you left off</h3>
              
              {recentTopics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {pastCurios.slice(0, 6).map((curio, index) => (
                    <Card 
                      key={curio.id} 
                      className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group"
                      onClick={() => {
                        // Navigate to the curio page
                        window.location.href = `/curio/${childId}/${curio.id}`;
                      }}
                    >
                      <motion.div 
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-gold"
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                      <CardContent className="p-4">
                        <div className="flex items-start">
                          <div className="bg-white/10 p-2 rounded-full mr-3">
                            <Lightbulb className="h-4 w-4 text-wonderwhiz-gold" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white line-clamp-2">{curio.title}</h4>
                            <p className="text-xs text-white/60 mt-1">
                              {format(new Date(curio.created_at), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-8">
                  <p>Start exploring topics to see them here!</p>
                </div>
              )}
            </motion.div>
          )}
          
          {activeTab === 'challenges' && (
            <motion.div
              key="challenges"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyChallenge childId={childId} />
                
                <Card className="border-white/10 bg-white/5">
                  <CardContent className="p-4">
                    <h3 className="text-lg font-medium text-white mb-4">Your Tasks</h3>
                    <ChildTaskList childId={childId} />
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
