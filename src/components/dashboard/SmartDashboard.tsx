
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Book, Rocket, Star, 
  Sparkles, TrendingUp, MessagesSquare,
  BookOpen, LightbulbIcon, Medal, Zap,
  BarChart3, Trophy, Flame
} from 'lucide-react';
import AnimatedCurioCard from './AnimatedCurioCard';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

// Map topics to appropriate types based on content
const getTopicType = (topic: string): 'science' | 'nature' | 'space' | 'history' | 'animals' | 'general' => {
  const topicLower = topic.toLowerCase();
  
  if (topicLower.includes('planet') || topicLower.includes('space') || 
      topicLower.includes('star') || topicLower.includes('galaxy')) {
    return 'space';
  } else if (topicLower.includes('animal') || topicLower.includes('dog') || 
             topicLower.includes('cat') || topicLower.includes('bird')) {
    return 'animals';
  } else if (topicLower.includes('history') || topicLower.includes('ancient') || 
             topicLower.includes('king') || topicLower.includes('queen')) {
    return 'history';
  } else if (topicLower.includes('plant') || topicLower.includes('tree') || 
             topicLower.includes('nature')) {
    return 'nature';
  } else if (topicLower.includes('science') || topicLower.includes('chemistry') || 
             topicLower.includes('physics')) {
    return 'science';
  } else {
    return 'general';
  }
};

// Get age-appropriate greeting based on child's profile
const getAgeAppropriateGreeting = (age?: number) => {
  if (!age) return "Hi there! What would you like to learn today?";
  
  if (age < 7) {
    return "Hello! Ready for fun learning adventures?";
  } else if (age < 10) {
    return "Hi explorer! What cool things do you want to discover today?";
  } else if (age < 13) {
    return "Welcome back! Ready to expand your knowledge?";
  } else {
    return "Hey there! What topics interest you today?";
  }
};

// Generate smart suggestions based on child's interests and past curios
const generateSmartSuggestions = (interests: string[], pastCurios: any[], age?: number) => {
  // Filter out topics child has already explored
  const pastTopics = pastCurios.map(curio => curio.title.toLowerCase());
  
  // Generate suggestions based on interests, age and what hasn't been explored yet
  const baseIdeas = [
    { title: "How do rockets fly to space?", type: "space", minAge: 6 },
    { title: "Why do leaves change color?", type: "nature", minAge: 5 },
    { title: "Who were the ancient Egyptians?", type: "history", minAge: 8 },
    { title: "How do computers work?", type: "science", minAge: 9 },
    { title: "Why do birds migrate?", type: "animals", minAge: 7 },
    { title: "What are black holes?", type: "space", minAge: 10 },
    { title: "How do caterpillars become butterflies?", type: "nature", minAge: 5 },
    { title: "What was the Roman Empire?", type: "history", minAge: 9 },
    { title: "Why is the ocean salty?", type: "science", minAge: 6 },
    { title: "How do bees make honey?", type: "animals", minAge: 6 }
  ];
  
  // Filter ideas based on age appropriateness
  const ageAppropriate = baseIdeas.filter(idea => !age || idea.minAge <= age);
  
  // Prioritize suggestions based on interests
  const prioritized = ageAppropriate.sort((a, b) => {
    const aMatchesInterest = interests.some(interest => 
      a.title.toLowerCase().includes(interest.toLowerCase()));
    const bMatchesInterest = interests.some(interest => 
      b.title.toLowerCase().includes(interest.toLowerCase()));
    
    if (aMatchesInterest && !bMatchesInterest) return -1;
    if (!aMatchesInterest && bMatchesInterest) return 1;
    return 0;
  });
  
  // Filter out topics that have already been explored
  return prioritized
    .filter(idea => !pastTopics.some(topic => 
      topic.includes(idea.title.toLowerCase()) || 
      idea.title.toLowerCase().includes(topic)
    ))
    .map(idea => idea.title)
    .slice(0, 6);
};

interface SmartDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
  selectedCategory?: string | null;
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios,
  selectedCategory
}) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const [showLearningStreaks, setShowLearningStreaks] = useState(true);
  
  // Generate smart suggestions based on child's profile
  useEffect(() => {
    if (childProfile?.interests && Array.isArray(childProfile.interests)) {
      const suggestions = generateSmartSuggestions(
        childProfile.interests, 
        pastCurios,
        childProfile.age
      );
      setSmartSuggestions(suggestions);
    }
  }, [childProfile, pastCurios]);
  
  // Filter suggestions based on selected category
  const getFilteredSuggestions = () => {
    if (!selectedCategory || selectedCategory === 'all') {
      return curioSuggestions.length > 0 ? curioSuggestions : smartSuggestions;
    }
    
    const allSuggestions = curioSuggestions.length > 0 ? curioSuggestions : smartSuggestions;
    return allSuggestions.filter(suggestion => 
      getTopicType(suggestion) === selectedCategory
    );
  };
  
  // Calculate knowledge areas and strengths based on past curios
  const calculateKnowledgeAreas = () => {
    if (!pastCurios || pastCurios.length === 0) {
      return {
        areas: [],
        strengths: []
      };
    }
    
    const topicCounts: Record<string, number> = {};
    
    pastCurios.forEach(curio => {
      const type = getTopicType(curio.title);
      topicCounts[type] = (topicCounts[type] || 0) + 1;
    });
    
    const areas = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([area]) => area);
      
    const strengths = areas.slice(0, 2);
    
    return { areas, strengths };
  };
  
  const { areas, strengths } = calculateKnowledgeAreas();
  
  // Get personalized message based on user's profile and history
  const getPersonalizedMessage = () => {
    if (!childProfile) return "";
    
    if (pastCurios.length === 0) {
      return "Let's start your learning journey! Choose a topic that interests you.";
    }
    
    if (strengths.length > 0) {
      const strength = strengths[0];
      if (strength === 'science') {
        return "You're becoming quite the scientist! Ready to learn more?";
      } else if (strength === 'space') {
        return "You're really into space exploration! Ready for more cosmic adventures?";
      } else if (strength === 'history') {
        return "You're a history buff! Ready to explore more of the past?";
      } else if (strength === 'nature') {
        return "You love learning about nature! Ready to discover more?";
      } else if (strength === 'animals') {
        return "You're an animal expert! Ready to learn about more creatures?";
      }
    }
    
    return "Ready to continue your learning adventure?";
  };
  
  const getFilteredPastCurios = () => {
    if (!selectedCategory || selectedCategory === 'all') {
      return pastCurios.slice(0, 3);
    }
    
    return pastCurios
      .filter(curio => getTopicType(curio.title) === selectedCategory)
      .slice(0, 3);
  };
  
  // Calculate learning streak data - days in a row with activity
  const getStreakData = () => {
    // Placeholder data - would be calculated from actual usage in a production app
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();
    
    const activityDays = [
      last7Days[0], 
      last7Days[2],
      last7Days[3],
      last7Days[6]
    ];
    
    return last7Days.map(day => ({
      date: day,
      active: activityDays.includes(day)
    }));
  };
  
  const streakData = getStreakData();
  
  return (
    <div className="px-0 max-w-5xl mx-auto space-y-6">
      {/* Intelligent dashboard tabs */}
      <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 grid grid-cols-3 bg-white/10">
          <TabsTrigger value="explore" className="data-[state=active]:bg-white/20">
            <div className="flex items-center">
              <LightbulbIcon className="h-4 w-4 mr-2" />
              <span>Explore</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="journey" className="data-[state=active]:bg-white/20">
            <div className="flex items-center">
              <Rocket className="h-4 w-4 mr-2" />
              <span>My Journey</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-white/20">
            <div className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              <span>Insights</span>
            </div>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="explore" className="pt-2">
          {showLearningStreaks && pastCurios.length > 0 && (
            <motion.div 
              className="mb-4 overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="p-3 bg-gradient-to-r from-wonderwhiz-deep-purple/50 to-wonderwhiz-bright-pink/50 rounded-lg border border-white/10 relative">
                <button 
                  className="absolute top-2 right-2 text-white/60 hover:text-white"
                  onClick={() => setShowLearningStreaks(false)}
                >
                  ×
                </button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex-shrink-0 bg-white/10 p-2 rounded-full">
                    <Flame className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm mb-1">Your learning streak</h4>
                    <div className="flex items-center space-x-1.5">
                      {streakData.map((day, i) => (
                        <div 
                          key={i}
                          className="flex flex-col items-center"
                        >
                          <div 
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              day.active ? 'bg-wonderwhiz-gold' : 'bg-white/10'
                            }`}
                          >
                            {day.active && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                          <span className="text-white/60 text-[10px] mt-1">
                            {['M','T','W','T','F','S','S'][new Date(day.date).getDay()]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-auto mt-2 sm:mt-0">
                    <Badge className="bg-wonderwhiz-gold text-wonderwhiz-deep-purple">
                      {childProfile?.streak_days || 0} Day Streak
                    </Badge>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div className="mb-4">
            <motion.h3 
              className="text-lg font-medium text-white mb-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getPersonalizedMessage()}
            </motion.h3>
            
            <motion.p 
              className="text-white/70 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              {pastCurios.length > 0 
                ? `You've explored ${pastCurios.length} topics so far. Keep going!` 
                : "Start your learning adventure by exploring these topics:"}
            </motion.p>
          </div>
          
          {/* Smart content recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {getFilteredSuggestions().map((suggestion, index) => (
              <AnimatedCurioCard
                key={`${suggestion}-${index}`}
                title={suggestion}
                onClick={() => onCurioSuggestionClick(suggestion)}
                index={index}
                type={getTopicType(suggestion)}
              />
            ))}
          </div>
          
          {/* Personalized content area */}
          {pastCurios.length > 0 && (
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
                Continue Your Learning
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {getFilteredPastCurios().map((curio, index) => (
                  <Card
                    key={curio.id}
                    className="border-white/10 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer relative overflow-hidden group"
                    onClick={() => {
                      window.location.href = `/curio/${childId}/${curio.id}`;
                    }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-wonderwhiz-pink to-wonderwhiz-gold" />
                    <div className="p-4">
                      <div className="flex items-start">
                        <div className="bg-white/10 p-2 rounded-full mr-3 flex-shrink-0">
                          <Book className="h-4 w-4 text-wonderwhiz-gold" />
                        </div>
                        <div>
                          <h4 className="font-medium text-white line-clamp-2">{curio.title}</h4>
                          <p className="text-xs text-white/60 mt-1">
                            {format(new Date(curio.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-wonderwhiz-deep-purple/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                      <span className="text-white text-xs font-medium px-2 py-1 bg-white/20 rounded-full">
                        Continue exploring
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </TabsContent>
        
        <TabsContent value="journey" className="pt-2">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Rocket className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
              Your Learning Journey
            </h3>
            
            {pastCurios.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">Progress</span>
                  <span className="text-white text-sm font-medium">
                    {pastCurios.length} topics explored
                  </span>
                </div>
                
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pastCurios.length * 5, 100)}%` }}
                    transition={{ duration: 0.8, type: "spring" }}
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <div className="flex-1">
                    <h4 className="text-white font-medium mb-3">Recent Explorations</h4>
                    
                    <div className="space-y-2">
                      {pastCurios.slice(0, 5).map((curio, index) => (
                        <motion.div 
                          key={curio.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className="bg-white/10 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-colors relative overflow-hidden group"
                          onClick={() => {
                            window.location.href = `/curio/${childId}/${curio.id}`;
                          }}
                        >
                          <div className="absolute top-0 left-0 w-1 h-full bg-wonderwhiz-gold" />
                          
                          <div className="flex items-center pl-2">
                            <div className="bg-white/10 p-1.5 rounded-full mr-3">
                              <Book className="h-3.5 w-3.5 text-wonderwhiz-gold" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white text-sm">{curio.title}</h4>
                              <p className="text-xs text-white/60">
                                {format(new Date(curio.created_at), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs bg-white/5">
                            {getTopicType(curio.title)}
                          </Badge>
                          
                          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-wonderwhiz-bright-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="w-full sm:w-64 flex-shrink-0">
                    <h4 className="text-white font-medium mb-3">Learning Stats</h4>
                    
                    <div className="space-y-3">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-white/70 text-xs">Total Topics</span>
                          <span className="text-white font-medium">{pastCurios.length}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-wonderwhiz-gold rounded-full" 
                            style={{ width: `${Math.min(pastCurios.length * 10, 100)}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-white/70 text-xs">Streak</span>
                          <span className="text-white font-medium">{childProfile?.streak_days || 0} days</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-wonderwhiz-vibrant-yellow rounded-full" 
                            style={{ width: `${Math.min((childProfile?.streak_days || 0) * 20, 100)}%` }} 
                          />
                        </div>
                      </div>
                      
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-white/70 text-xs">Sparks</span>
                          <span className="text-white font-medium">{childProfile?.sparks_balance || 0}</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-wonderwhiz-bright-pink rounded-full" 
                            style={{ width: `${Math.min((childProfile?.sparks_balance || 0) * 2, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/70">
                <Book className="h-10 w-10 mx-auto mb-3 text-white/40" />
                <p>Start exploring topics to build your learning journey!</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="pt-2">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <h3 className="text-lg font-medium text-white mb-3 flex items-center">
              <Brain className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
              Your Learning Insights
            </h3>
            
            {pastCurios.length > 0 ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/10 rounded-lg p-3 text-center"
                  >
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Topics Explored</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{pastCurios.length}</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/10 rounded-lg p-3 text-center"
                  >
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Learning Streak</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{childProfile?.streak_days || 0} days</p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white/10 rounded-lg p-3 text-center col-span-2 sm:col-span-1"
                  >
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Sparks Earned</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{childProfile?.sparks_balance || 0}</p>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {areas.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <BarChart3 className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
                        Your Knowledge Areas
                      </h4>
                      <div className="space-y-3">
                        {areas.map((area, index) => (
                          <div key={area} className="relative">
                            <div className="flex items-center justify-between mb-1.5">
                              <div className="flex items-center">
                                {area === 'science' && <Brain className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                {area === 'space' && <Rocket className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                {area === 'history' && <Book className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                {area === 'nature' && <LightbulbIcon className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                {area === 'animals' && <MessagesSquare className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                {area === 'general' && <Star className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                <span className="text-white text-xs capitalize">{area}</span>
                              </div>
                              <span className="text-white/70 text-xs">
                                {pastCurios.filter(c => getTopicType(c.title) === area).length} topics
                              </span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(pastCurios.filter(c => getTopicType(c.title) === area).length * 20, 100)}%` }}
                                transition={{ delay: 0.5 + (index * 0.1), duration: 0.8, type: "spring" }}
                                className={`h-full rounded-full ${
                                  index === 0 ? 'bg-wonderwhiz-gold' : 
                                  index === 1 ? 'bg-wonderwhiz-bright-pink' : 
                                  'bg-wonderwhiz-vibrant-yellow'
                                }`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {strengths.length > 0 && (
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <h4 className="text-white font-medium mb-3 flex items-center">
                        <Trophy className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                        Your Strengths
                      </h4>
                      <div className="space-y-3">
                        {strengths.map(strength => (
                          <motion.div 
                            key={strength} 
                            className="bg-white/10 rounded-lg p-3 flex items-center"
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                          >
                            <div className="bg-white/10 p-2 rounded-full mr-3">
                              {strength === 'science' && <Brain className="h-4 w-4 text-wonderwhiz-gold" />}
                              {strength === 'space' && <Rocket className="h-4 w-4 text-wonderwhiz-gold" />}
                              {strength === 'history' && <Book className="h-4 w-4 text-wonderwhiz-gold" />}
                              {strength === 'nature' && <LightbulbIcon className="h-4 w-4 text-wonderwhiz-gold" />}
                              {strength === 'animals' && <MessagesSquare className="h-4 w-4 text-wonderwhiz-gold" />}
                              {strength === 'general' && <Star className="h-4 w-4 text-wonderwhiz-gold" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-white text-sm capitalize">{strength}</h4>
                              <p className="text-xs text-white/60">
                                You've explored {pastCurios.filter(c => getTopicType(c.title) === strength).length} topics in this area
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <h4 className="text-white font-medium mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
                    Learning Recommendations
                  </h4>
                  
                  <div className="space-y-3">
                    {/* Personalized recommendations based on learning history */}
                    {strengths.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <h5 className="text-sm text-white/90 font-medium mb-2">
                          Based on your interest in <span className="text-wonderwhiz-gold capitalize">{strengths[0]}</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {[
                            strengths[0] === 'space' ? "Tell me about black holes" : 
                            strengths[0] === 'science' ? "How do magnets work?" :
                            strengths[0] === 'animals' ? "Show me amazing animal facts" :
                            "Tell me interesting facts about " + strengths[0],
                            
                            strengths[0] === 'space' ? "How big is the universe?" : 
                            strengths[0] === 'science' ? "Why do we have seasons?" :
                            strengths[0] === 'animals' ? "How do animals communicate?" :
                            "What are the most important discoveries about " + strengths[0]
                          ].map((suggestion, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="bg-white/10 hover:bg-white/15 rounded-lg p-2.5 text-left transition-colors"
                              onClick={() => onCurioSuggestionClick(suggestion)}
                            >
                              <p className="text-sm text-white">{suggestion}</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* New areas to explore */}
                    {areas.length > 0 && (
                      <div className="bg-white/10 rounded-lg p-3">
                        <h5 className="text-sm text-white/90 font-medium mb-2">
                          Explore new areas
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {['science', 'space', 'nature', 'history', 'animals']
                            .filter(area => !areas.includes(area))
                            .slice(0, 2)
                            .map((area, idx) => {
                              const suggestion = 
                                area === 'space' ? "Tell me about planets" : 
                                area === 'science' ? "How do things work?" :
                                area === 'animals' ? "Show me amazing animals" :
                                area === 'nature' ? "Tell me about rainforests" :
                                "What happened in ancient history?";
                                
                              return (
                                <motion.button
                                  key={idx}
                                  whileHover={{ scale: 1.03 }}
                                  whileTap={{ scale: 0.97 }}
                                  className="bg-white/10 hover:bg-white/15 rounded-lg p-2.5 text-left transition-colors"
                                  onClick={() => onCurioSuggestionClick(suggestion)}
                                >
                                  <div className="flex items-center">
                                    {area === 'science' && <Brain className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                    {area === 'space' && <Rocket className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                    {area === 'history' && <Book className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                    {area === 'nature' && <LightbulbIcon className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                    {area === 'animals' && <MessagesSquare className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1.5" />}
                                    <p className="text-sm text-white">Explore <span className="capitalize">{area}</span></p>
                                  </div>
                                </motion.button>
                              );
                            })
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-white/70">
                <Medal className="h-10 w-10 mx-auto mb-3 text-white/40" />
                <p>Start exploring to unlock your learning insights!</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartDashboard;
