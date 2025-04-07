
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  BookOpen, 
  Rocket, 
  Brain,
  Star
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import CurioSuggestion from '@/components/CurioSuggestion';
import { Button } from '@/components/ui/button';
import MagicalBorder from '@/components/MagicalBorder';
import { useIsMobile } from '@/hooks/use-mobile';
import { getBackgroundColor } from '@/components/BlockStyleUtils';

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
  const [recentInterests, setRecentInterests] = useState<string[]>([]);
  const [popularTopics, setPopularTopics] = useState<{topic: string, count: number}[]>([]);
  const [achievements, setAchievements] = useState<{title: string, description: string, icon: string}[]>([]);
  const [userStreakDays, setUserStreakDays] = useState(childProfile?.streak_days || 0);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const isMobile = useIsMobile();

  // Initialize the time of day
  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
  }, []);

  // Generate welcome message based on profile and time of day
  useEffect(() => {
    if (!childProfile) return;
    
    const name = childProfile.name;
    const messages = {
      morning: [
        `Good morning, ${name}! Ready for a day of discovery?`,
        `Rise and shine, ${name}! What shall we explore today?`,
        `Hello ${name}! The morning is full of wonders to discover!`
      ],
      afternoon: [
        `Good afternoon, ${name}! What are you curious about today?`,
        `Hi ${name}! The afternoon is perfect for exploration!`,
        `Hello ${name}! What amazing things shall we learn this afternoon?`
      ],
      evening: [
        `Good evening, ${name}! There's still time for one more adventure!`,
        `Hi ${name}! The evening sky is full of wonders to explore!`,
        `Hello ${name}! Ready for some evening curiosity?`
      ]
    };
    
    const randomIndex = Math.floor(Math.random() * messages[timeOfDay].length);
    setWelcomeMessage(messages[timeOfDay][randomIndex]);
  }, [childProfile, timeOfDay]);

  // Extract recent interests from past curios
  useEffect(() => {
    if (!pastCurios || pastCurios.length === 0) return;
    
    // Simple NLP-like approach to extract topics
    const allWords = pastCurios
      .map(curio => curio.query.toLowerCase())
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 3) // Filter out short words
      .filter(word => !['what', 'when', 'where', 'which', 'who', 'why', 'how', 'does', 'did', 'will', 'could', 'should', 'would', 'about', 'with', 'from', 'have', 'this', 'that', 'there', 'their', 'they', 'were', 'because'].includes(word));
    
    // Count word frequencies
    const wordCounts: Record<string, number> = {};
    allWords.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
    });
    
    // Sort and get top topics
    const sortedTopics = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));
    
    setPopularTopics(sortedTopics);
    
    // Extract unique interests
    const interests = Array.from(new Set(allWords.slice(0, 20)));
    setRecentInterests(interests.slice(0, 5));
  }, [pastCurios]);

  // Generate achievements based on profile data
  useEffect(() => {
    if (!childProfile) return;
    
    const newAchievements = [];
    
    // Streak achievement
    if (childProfile.streak_days >= 3) {
      newAchievements.push({
        title: 'Curiosity Streak',
        description: `You've explored for ${childProfile.streak_days} days in a row!`,
        icon: 'fire'
      });
    }
    
    // Sparks achievement
    if (childProfile.sparks_balance >= 50) {
      newAchievements.push({
        title: 'Spark Collector',
        description: `You've earned ${childProfile.sparks_balance} sparks!`,
        icon: 'sparkles'
      });
    }
    
    // Questions achievement
    if (pastCurios && pastCurios.length >= 5) {
      newAchievements.push({
        title: 'Question Master',
        description: `You've asked ${pastCurios.length} questions!`,
        icon: 'brain'
      });
    }
    
    setAchievements(newAchievements);
  }, [childProfile, pastCurios]);

  // Animated background items
  const backgroundItems = [
    { icon: '✨', delay: 0, x: '10%', y: '10%' },
    { icon: '🌟', delay: 2, x: '80%', y: '15%' },
    { icon: '💫', delay: 1, x: '60%', y: '70%' },
    { icon: '⭐', delay: 3, x: '20%', y: '80%' },
    { icon: '🔭', delay: 2.5, x: '85%', y: '60%' },
  ];

  const getColorForIndex = (index: number) => {
    const colors = [
      'bg-wonderwhiz-deep-purple/40',
      'bg-wonderwhiz-bright-pink/30', 
      'bg-wonderwhiz-cyan/30',
      'bg-wonderwhiz-blue-accent/30',
      'bg-wonderwhiz-vibrant-yellow/30',
    ];
    return colors[index % colors.length];
  };
  
  return (
    <div className="py-6 sm:py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Animated background elements */}
      {backgroundItems.map((item, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl sm:text-4xl pointer-events-none"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0.5, 0.8, 0.5], 
            scale: [0.8, 1.2, 0.8],
            x: [`calc(${item.x} - 20px)`, `calc(${item.x} + 20px)`, `calc(${item.x} - 20px)`],
            y: [`calc(${item.y} - 20px)`, `calc(${item.y} + 20px)`, `calc(${item.y} - 20px)`]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 15, 
            delay: item.delay,
            ease: "easeInOut" 
          }}
          style={{ left: item.x, top: item.y }}
        >
          {item.icon}
        </motion.div>
      ))}

      {/* Main content */}
      <motion.div 
        className="max-w-4xl mx-auto relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Personalized welcome section */}
        <motion.div 
          className="mb-12 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-nunito mb-4">
            {welcomeMessage}
          </h1>
          
          {childProfile?.streak_days > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-wonderwhiz-gold/20 rounded-full text-wonderwhiz-gold">
              <TrendingUp className="h-4 w-4" />
              <span className="font-medium">
                {childProfile.streak_days} day{childProfile.streak_days !== 1 ? 's' : ''} streak!
              </span>
            </div>
          )}
        </motion.div>

        {/* Personal insights section */}
        {(pastCurios?.length > 0 || popularTopics.length > 0 || recentInterests.length > 0) && (
          <motion.div 
            className="mb-10"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-white font-nunito mb-4 flex items-center">
              <Brain className="mr-2 h-5 w-5 text-wonderwhiz-bright-pink" />
              Your Learning Journey
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Popular topics */}
              {popularTopics.length > 0 && (
                <motion.div 
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-white mb-2">Your Top Interests</h3>
                  <div className="space-y-2">
                    {popularTopics.slice(0, 3).map((topic, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-white/80 text-sm capitalize">{topic.topic}</span>
                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${index === 0 ? 'bg-wonderwhiz-bright-pink' : index === 1 ? 'bg-wonderwhiz-cyan' : 'bg-wonderwhiz-vibrant-yellow'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((topic.count / popularTopics[0].count) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 + (index * 0.2) }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Recent achievements */}
              {achievements.length > 0 && (
                <motion.div 
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-white mb-2">Recent Achievements</h3>
                  <div className="space-y-2">
                    {achievements.slice(0, 2).map((achievement, index) => (
                      <div key={index} className="flex items-center bg-white/10 p-2 rounded-lg">
                        <div className="bg-wonderwhiz-gold/20 p-2 rounded-full mr-3">
                          {achievement.icon === 'sparkles' && <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />}
                          {achievement.icon === 'fire' && <TrendingUp className="h-4 w-4 text-wonderwhiz-gold" />}
                          {achievement.icon === 'brain' && <Brain className="h-4 w-4 text-wonderwhiz-gold" />}
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">{achievement.title}</div>
                          <div className="text-white/70 text-xs">{achievement.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {/* Recent curios */}
              {pastCurios?.length > 0 && (
                <motion.div 
                  className="p-4 rounded-xl bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-lg font-medium text-white mb-2">Recent Explorations</h3>
                  <div className="space-y-2">
                    {pastCurios.slice(0, 3).map((curio, index) => (
                      <div key={index} className="bg-white/10 p-2 rounded-lg">
                        <div className="flex items-center">
                          <div className="bg-wonderwhiz-cyan/20 p-1.5 rounded-full mr-2.5">
                            <Lightbulb className="h-3.5 w-3.5 text-wonderwhiz-cyan" />
                          </div>
                          <div className="text-white text-sm line-clamp-1">{curio.query}</div>
                        </div>
                        <div className="text-white/50 text-xs mt-1 pl-7">
                          {new Date(curio.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* Personalized suggestions section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white font-nunito flex items-center">
              <Rocket className="mr-2 h-5 w-5 text-wonderwhiz-cyan" />
              Explore These Wonders
            </h2>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-wonderwhiz-gold transition-colors" 
              onClick={handleRefreshSuggestions} 
              disabled={isLoadingSuggestions}
            >
              <motion.div 
                animate={isLoadingSuggestions ? { rotate: 360 } : {}} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Lightbulb className="h-5 w-5 mr-2" />
              </motion.div>
              <span>New Ideas</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <AnimatePresence mode="wait">
              {isLoadingSuggestions ? (
                <motion.div 
                  className="col-span-full flex justify-center py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-bright-pink mb-3"></div>
                    <p className="text-white/80 text-sm font-nunito">Brewing magical ideas for you...</p>
                  </div>
                </motion.div>
              ) : (
                curioSuggestions.map((suggestion, index) => (
                  <motion.div
                    key={`${suggestion}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    <MagicalBorder active={index === 0} type={index === 0 ? 'rainbow' : 'static'}>
                      <div 
                        className={`flip-card h-28 sm:h-32 rounded-xl overflow-hidden ${getBackgroundColor(index)}`}
                        onClick={() => onCurioSuggestionClick(suggestion)}
                      >
                        <div className="flip-card-inner">
                          <div className="flip-card-front p-4 flex items-center justify-center">
                            <p className="text-white text-center font-medium text-base sm:text-lg font-nunito">
                              {suggestion}
                            </p>
                          </div>
                          <div className="flip-card-back p-4 flex flex-col items-center justify-center">
                            <Star className="h-5 w-5 text-wonderwhiz-gold mb-2" />
                            <p className="text-white text-center text-sm">Tap to explore!</p>
                          </div>
                        </div>
                      </div>
                    </MagicalBorder>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>
        
        {/* Daily challenge section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white font-nunito mb-4 flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            Daily Challenge
          </h2>
          
          <div className="bg-gradient-to-br from-wonderwhiz-deep-purple/60 to-wonderwhiz-bright-pink/40 rounded-xl p-5 border border-white/10">
            <div className="flex items-center mb-3">
              <div className="bg-wonderwhiz-vibrant-yellow/20 p-2 rounded-full mr-3">
                <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
              </div>
              <h3 className="text-white font-bold text-lg">Today's Wonder</h3>
            </div>
            
            <p className="text-white/90 mb-4">
              Why can birds fly but humans can't? Discover the amazing science behind flight!
            </p>
            
            <Button 
              className="bg-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/90 text-wonderwhiz-deep-purple font-medium" 
              onClick={() => onCurioSuggestionClick("Why can birds fly but humans can't?")}
            >
              Start Exploring
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PersonalizedDashboard;
