
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { RefreshCw, Star, BookOpen, Lightbulb, Rocket, Calendar, Brain, Award, Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import StreakDisplay from '@/components/StreakDisplay';
import AnimatedMascot from './AnimatedMascot';
import AnimatedCurioCard from './AnimatedCurioCard';
import LearningPathProgress from './LearningPathProgress';
import AchievementShowcase from './AchievementShowcase';
import { toast } from 'sonner';

interface EnhancedPersonalizedDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
}

// Map topics to icon types
const getTopicType = (topic: string): 'science' | 'nature' | 'space' | 'history' | 'animals' | 'general' => {
  const topicLower = topic.toLowerCase();
  if (topicLower.includes('planet') || topicLower.includes('space') || topicLower.includes('star') || topicLower.includes('galaxy') || topicLower.includes('universe')) {
    return 'space';
  } else if (topicLower.includes('animal') || topicLower.includes('dog') || topicLower.includes('cat') || topicLower.includes('bird') || topicLower.includes('fish')) {
    return 'animals';
  } else if (topicLower.includes('history') || topicLower.includes('ancient') || topicLower.includes('war') || topicLower.includes('king') || topicLower.includes('queen')) {
    return 'history';
  } else if (topicLower.includes('plant') || topicLower.includes('tree') || topicLower.includes('flower') || topicLower.includes('forest') || topicLower.includes('nature')) {
    return 'nature';
  } else if (topicLower.includes('science') || topicLower.includes('chemistry') || topicLower.includes('physics') || topicLower.includes('biology') || topicLower.includes('experiment')) {
    return 'science';
  } else {
    return 'general';
  }
};

const EnhancedPersonalizedDashboard: React.FC<EnhancedPersonalizedDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios
}) => {
  const [activeTab, setActiveTab] = useState('discover');
  const [recentTopics, setRecentTopics] = useState<string[]>([]);
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Sample achievements data - in a real app, this would come from the backend
  const achievements = [
    {
      id: '1',
      name: 'First Exploration',
      description: 'Started your first exploration journey',
      icon: <Rocket className="h-6 w-6 text-wonderwhiz-gold" />,
      unlocked: pastCurios.length > 0,
      date: pastCurios.length > 0 ? format(new Date(pastCurios[pastCurios.length - 1].created_at), 'MMMM do, yyyy') : undefined
    },
    {
      id: '2',
      name: 'Curious Mind',
      description: 'Asked 10 different questions',
      icon: <Brain className="h-6 w-6 text-wonderwhiz-gold" />,
      unlocked: pastCurios.length >= 10,
      progress: {
        current: pastCurios.length,
        target: 10
      }
    },
    {
      id: '3',
      name: 'Knowledge Seeker',
      description: 'Maintain a 7-day learning streak',
      icon: <Award className="h-6 w-6 text-wonderwhiz-gold" />,
      unlocked: (childProfile?.streak_days || 0) >= 7,
      progress: {
        current: childProfile?.streak_days || 0,
        target: 7
      }
    },
    {
      id: '4',
      name: 'Spark Collector',
      description: 'Earn 100 sparks through learning',
      icon: <Star className="h-6 w-6 text-wonderwhiz-gold" />,
      unlocked: (childProfile?.sparks_balance || 0) >= 100,
      progress: {
        current: childProfile?.sparks_balance || 0,
        target: 100
      }
    }
  ];
  
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
    
    // Show confetti effect on initial load if the user has a streak
    if (childProfile?.streak_days > 0) {
      setTimeout(() => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
      }, 1000);
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
  
  const handleMascotInteraction = () => {
    const funFacts = [
      "Did you know? A day on Venus is longer than a year on Venus!",
      "Octopuses have three hearts and blue blood!",
      "The Eiffel Tower can be 15 cm taller during the summer!",
      "Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old.",
      "A group of flamingos is called a 'flamboyance'!"
    ];
    
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Fun Fact!</span> 
        <span className="text-sm">{randomFact}</span>
      </div>,
      {
        position: "bottom-center",
        duration: 5000,
        className: "bg-wonderwhiz-purple text-white",
        icon: "✨"
      }
    );
  };
  
  return (
    <div className="px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header greeting */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 relative"
        >
          <div className="flex flex-col-reverse md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                {getTimeBasedGreeting()}, {childProfile?.name || 'Explorer'}!
              </h1>
              <p className="text-white/70 text-base">
                {getInterestBasedMessage()}
              </p>
              {lastActiveDate && (
                <div className="mt-1 text-sm text-white/50 flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Last explored: {lastActiveDate}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              <AnimatedMascot 
                childName={childProfile?.name} 
                streakDays={childProfile?.streak_days || 0}
                onInteract={handleMascotInteraction}
              />
              
              <StreakDisplay
                streakDays={childProfile?.streak_days || 0}
                showBadgesOnly={false}
                className="hidden md:block"
              />
            </div>
          </div>
          
          {/* Floating elements */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
            {[...Array(10)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-wonderwhiz-gold rounded-full opacity-70"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.8, 0.3]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        </motion.div>
        
        {/* Dashboard Tabs */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 sm:space-x-3 justify-start pb-2">
            <Button
              variant={activeTab === 'discover' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('discover')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Star className="w-4 h-4" />
              <span>Discover</span>
            </Button>
            <Button
              variant={activeTab === 'progress' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('progress')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Rocket className="w-4 h-4" />
              <span>My Progress</span>
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
              variant={activeTab === 'rewards' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('rewards')}
              className="text-sm flex items-center gap-1 whitespace-nowrap"
            >
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </Button>
          </div>
        </div>
        
        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white flex items-center">
                  <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
                  Explore These Wonder Topics
                </h3>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {curioSuggestions.map((suggestion, index) => (
                  <AnimatedCurioCard 
                    key={`${suggestion}-${index}`}
                    title={suggestion}
                    onClick={() => onCurioSuggestionClick(suggestion)}
                    index={index}
                    type={getTopicType(suggestion)}
                  />
                ))}
              </div>
              
              <AchievementShowcase achievements={achievements} />
            </motion.div>
          )}
          
          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LearningPathProgress 
                streakDays={childProfile?.streak_days || 0}
                interests={childProfile?.interests || []}
                completedTopics={pastCurios.length}
                sparksBalance={childProfile?.sparks_balance || 0}
              />
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
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
                Continue Your Exploration
              </h3>
              
              {recentTopics.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
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
          
          {activeTab === 'rewards' && (
            <motion.div
              key="rewards"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                <Gift className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
                Your Sparks Rewards
              </h3>
              
              <div className="bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-white font-bold text-xl flex items-center">
                      <Star className="h-5 w-5 text-wonderwhiz-gold mr-2" />
                      {childProfile?.sparks_balance || 0} Sparks
                    </h4>
                    <p className="text-white/70 text-sm">Collect sparks by learning and exploring!</p>
                  </div>
                  
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-white border-none"
                    onClick={() => {
                      toast.success(
                        <div className="flex flex-col">
                          <span className="font-medium">Sparks Rewards</span> 
                          <span className="text-sm">Keep learning to earn more sparks!</span>
                        </div>,
                        {
                          position: "bottom-center",
                          duration: 5000,
                          className: "bg-wonderwhiz-purple text-white",
                          icon: "✨"
                        }
                      );
                    }}
                  >
                    Spend Sparks
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <h5 className="text-white font-medium mb-1">Next Reward</h5>
                    <p className="text-wonderwhiz-gold">{200 - (childProfile?.sparks_balance || 0)} sparks to go</p>
                  </div>
                  
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <h5 className="text-white font-medium mb-1">Daily Streak</h5>
                    <p className="text-wonderwhiz-gold">{childProfile?.streak_days || 0} days</p>
                  </div>
                  
                  <div className="bg-white/10 p-3 rounded-lg text-center">
                    <h5 className="text-white font-medium mb-1">Topics Explored</h5>
                    <p className="text-wonderwhiz-gold">{pastCurios.length}</p>
                  </div>
                </div>
              </div>
              
              <AchievementShowcase achievements={achievements} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Confetti effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-wonderwhiz-gold rounded-full opacity-80"
                style={{
                  top: '-5%',
                  left: `${Math.random() * 100}%`
                }}
                animate={{
                  y: ['0vh', '120vh'],
                  x: [`${Math.random() * 20 - 10}%`, `${Math.random() * 40 - 20}%`],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)]
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  ease: "easeOut",
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedPersonalizedDashboard;
