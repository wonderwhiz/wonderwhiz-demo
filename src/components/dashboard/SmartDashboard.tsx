
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, Book, Rocket, Star, 
  Sparkles, TrendingUp, MessagesSquare,
  BookOpen, LightbulbIcon, Medal
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
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios
}) => {
  const [activeTab, setActiveTab] = useState('explore');
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  
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
  
  return (
    <div className="px-4 max-w-5xl mx-auto space-y-6">
      {/* Personal greeting and stats */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            Hello, {childProfile?.name || 'Explorer'}!
          </h1>
          <p className="text-white/80 mt-1">
            {getAgeAppropriateGreeting(childProfile?.age)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {childProfile?.streak_days > 0 && (
            <div className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center">
              <Star className="h-4 w-4 text-wonderwhiz-gold mr-1.5" />
              <span className="text-white text-sm font-medium">{childProfile.streak_days} Day Streak</span>
            </div>
          )}
          
          <div className="bg-white/10 rounded-lg px-3 py-1.5 flex items-center">
            <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1.5" />
            <span className="text-white text-sm font-medium">{childProfile?.sparks_balance || 0} Sparks</span>
          </div>
        </div>
      </div>
      
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
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white mb-2">
              {getPersonalizedMessage()}
            </h3>
            
            <p className="text-white/70 text-sm">
              {pastCurios.length > 0 
                ? `You've explored ${pastCurios.length} topics so far. Keep going!` 
                : "Start your learning adventure by exploring these topics:"}
            </p>
          </div>
          
          {/* Smart content recommendations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {(curioSuggestions.length > 0 ? curioSuggestions : smartSuggestions).map((suggestion, index) => (
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
            <div className="mt-6">
              <h3 className="text-lg font-medium text-white mb-3 flex items-center">
                <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
                Continue Your Learning
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {pastCurios.slice(0, 3).map((curio, index) => (
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
                  </Card>
                ))}
              </div>
            </div>
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
                
                <div className="mt-4 space-y-3">
                  <h4 className="text-white font-medium">Recent Explorations</h4>
                  
                  {pastCurios.slice(0, 5).map((curio, index) => (
                    <div 
                      key={curio.id}
                      className="bg-white/10 rounded-lg p-3 flex items-center justify-between cursor-pointer hover:bg-white/15 transition-colors"
                      onClick={() => {
                        window.location.href = `/curio/${childId}/${curio.id}`;
                      }}
                    >
                      <div className="flex items-center">
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
                    </div>
                  ))}
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
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Topics Explored</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{pastCurios.length}</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3 text-center">
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Learning Streak</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{childProfile?.streak_days || 0} days</p>
                  </div>
                  
                  <div className="bg-white/10 rounded-lg p-3 text-center col-span-2 sm:col-span-1">
                    <h5 className="text-white text-xs uppercase tracking-wider mb-1 opacity-70">Sparks Earned</h5>
                    <p className="text-wonderwhiz-gold text-2xl font-bold">{childProfile?.sparks_balance || 0}</p>
                  </div>
                </div>
                
                {areas.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-white font-medium mb-3">Your Knowledge Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {areas.map(area => (
                        <div key={area} className="bg-wonderwhiz-purple/30 px-3 py-1.5 rounded-full flex items-center">
                          <div className="mr-1.5">
                            {area === 'science' && <Brain className="h-3.5 w-3.5 text-white" />}
                            {area === 'space' && <Rocket className="h-3.5 w-3.5 text-white" />}
                            {area === 'history' && <Book className="h-3.5 w-3.5 text-white" />}
                            {area === 'nature' && <LightbulbIcon className="h-3.5 w-3.5 text-white" />}
                            {area === 'animals' && <MessagesSquare className="h-3.5 w-3.5 text-white" />}
                            {area === 'general' && <Star className="h-3.5 w-3.5 text-white" />}
                          </div>
                          <span className="text-white text-xs capitalize">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {strengths.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-white font-medium mb-3">Your Strengths</h4>
                    <div className="space-y-3">
                      {strengths.map(strength => (
                        <div 
                          key={strength} 
                          className="bg-white/10 rounded-lg p-3 flex items-center"
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
                              You've explored {areas.length > 0 ? 
                                `${pastCurios.filter(c => getTopicType(c.title) === strength).length} topics` : 
                                'several topics'} in this area
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-5">
                  <h4 className="text-white font-medium mb-3">Learning Activity</h4>
                  <div className="flex items-center justify-center">
                    <div className="text-center py-2">
                      <TrendingUp className="h-10 w-10 mx-auto mb-2 text-wonderwhiz-gold" />
                      <p className="text-white text-sm">
                        {pastCurios.length < 5 
                          ? "You're just getting started! Keep exploring to see your learning patterns." 
                          : "You're making great progress! Keep up the good work."}
                      </p>
                    </div>
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
