import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Sparkles, BookOpen, Plus, TrendingUp, Clock, Users, Star, Lightbulb, Zap, Target, Trophy, Brain, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LearningTopic } from '@/types/wonderwhiz';
import ElevatedEncyclopediaView from './ElevatedEncyclopediaView';

interface ElevatedStreamlinedDashboardProps {
  childProfile: any;
  onTopicCreate: (topic: LearningTopic) => void;
}

const ElevatedStreamlinedDashboard: React.FC<ElevatedStreamlinedDashboardProps> = ({
  childProfile,
  onTopicCreate
}) => {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '50%']);

  const isYoungChild = (childProfile?.age || 10) <= 8;

  const suggestedTopics = [
    { title: "How do dinosaurs become fossils?", icon: "🦕", category: "Science", difficulty: "Beginner" },
    { title: "Why is the ocean blue?", icon: "🌊", category: "Nature", difficulty: "Easy" },
    { title: "How do airplanes fly?", icon: "✈️", category: "Technology", difficulty: "Intermediate" },
    { title: "What makes a rainbow?", icon: "🌈", category: "Physics", difficulty: "Easy" },
    { title: "How do plants grow?", icon: "🌱", category: "Biology", difficulty: "Beginner" },
    { title: "Why do we dream?", icon: "😴", category: "Psychology", difficulty: "Intermediate" },
    { title: "How does the internet work?", icon: "🌐", category: "Technology", difficulty: "Advanced" },
    { title: "What are black holes?", icon: "🕳️", category: "Space", difficulty: "Intermediate" }
  ];

  useEffect(() => {
    if (childProfile?.id) {
      loadTopics();
    }
  }, [childProfile?.id]);

  const loadTopics = async () => {
    if (!childProfile?.id) return;

    try {
      const { data, error } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('child_id', childProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const typedTopics = (data || []).map(topic => ({
        ...topic,
        status: topic.status as 'planning' | 'in_progress' | 'completed'
      })) as LearningTopic[];
      
      setTopics(typedTopics);
    } catch (error) {
      console.error('Error loading topics:', error);
      toast.error('Failed to load learning topics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSearch = async (query: string) => {
    if (!childProfile?.id || isCreatingTopic || !query.trim()) return;

    setIsCreatingTopic(true);
    
    try {
      const { data: topicResponse, error: topicError } = await supabase.functions
        .invoke('generate-wonderwhiz-topic', {
          body: {
            topic: query,
            childAge: childProfile.age || 10,
            childId: childProfile.id
          }
        });

      if (topicError) throw new Error('Failed to create topic');
      if (!topicResponse) throw new Error('No topic data returned');

      const newTopic = {
        ...topicResponse,
        status: topicResponse.status as 'planning' | 'in_progress' | 'completed'
      } as LearningTopic;
      
      setTopics(prev => [newTopic, ...prev]);
      setSelectedTopic(newTopic);
      onTopicCreate(newTopic);
      setSearchQuery('');
      
      toast.success('🎉 Encyclopedia created! Ready to explore!');
      
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create encyclopedia topic. Please try again.');
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleSuggestionClick = (suggestion: any) => {
    setSearchQuery(suggestion.title);
    setShowSuggestions(false);
    handleTopicSearch(suggestion.title);
  };

  if (selectedTopic) {
    return (
      <ElevatedEncyclopediaView
        topic={selectedTopic}
        childAge={childProfile?.age || 10}
        childProfile={childProfile}
        onBackToTopics={() => {
          setSelectedTopic(null);
          loadTopics();
        }}
        onTopicUpdate={setSelectedTopic}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Parallax Background */}
      <motion.div 
        className="fixed inset-0 z-0"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-deep to-secondary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.1)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.05)_0%,transparent_50%)]" />
        
        {/* Floating Elements */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{ 
              y: [null, Math.random() * window.innerHeight - 100],
              x: [null, Math.random() * window.innerWidth],
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <motion.div 
              className="inline-flex items-center gap-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-glow"
                whileHover={{ rotate: 10 }}
              >
                <BookOpen className="h-8 w-8 text-white" />
              </motion.div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white mb-1">
                  {isYoungChild ? `Hey ${childProfile?.name}! 👋` : `Welcome, ${childProfile?.name}`}
                </h1>
                <p className="text-white/80 text-lg">
                  {isYoungChild ? "What amazing thing do you want to learn today?" : "Ready to explore the world of knowledge?"}
                </p>
              </div>
            </motion.div>

            {/* Enhanced Search Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative"
            >
              <Card className="bg-glass border-white/20 p-2 rounded-2xl backdrop-blur-xl shadow-glow">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                    <Input
                      type="text"
                      placeholder={isYoungChild ? "Ask me anything! Like 'Why is the sky blue?'" : "What would you like to explore today?"}
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(e.target.value.length > 0);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !isCreatingTopic) {
                          handleTopicSearch(searchQuery);
                        }
                      }}
                      className="pl-12 pr-4 py-4 text-lg bg-transparent border-none text-white placeholder:text-white/50 focus:ring-0"
                      disabled={isCreatingTopic}
                    />
                  </div>
                  <Button
                    onClick={() => handleTopicSearch(searchQuery)}
                    disabled={isCreatingTopic || !searchQuery.trim()}
                    className="bg-accent hover:bg-accent-glow text-white px-6 py-4 rounded-xl font-semibold shadow-lg"
                  >
                    {isCreatingTopic ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </Card>

              {/* Smart Suggestions */}
              <AnimatePresence>
                {showSuggestions && searchQuery.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 z-50"
                  >
                    <Card className="bg-glass border-white/20 backdrop-blur-xl rounded-xl overflow-hidden shadow-2xl">
                      <div className="p-4">
                        <div className="text-white/70 text-sm mb-3 flex items-center gap-2">
                          <Lightbulb className="h-4 w-4" />
                          Suggested topics
                        </div>
                        <div className="space-y-2">
                          {suggestedTopics
                            .filter(topic => topic.title.toLowerCase().includes(searchQuery.toLowerCase()))
                            .slice(0, 3)
                            .map((suggestion, index) => (
                              <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="w-full p-3 text-left rounded-lg bg-white/5 hover:bg-white/10 transition-all border border-white/10 hover:border-accent/30"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="text-2xl">{suggestion.icon}</div>
                                  <div className="flex-1">
                                    <div className="text-white font-medium">{suggestion.title}</div>
                                    <div className="text-white/60 text-sm flex items-center gap-2">
                                      <span>{suggestion.category}</span>
                                      <span>•</span>
                                      <span>{suggestion.difficulty}</span>
                                    </div>
                                  </div>
                                </div>
                              </motion.button>
                            ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { icon: Brain, label: "Topics Explored", value: topics.length, color: "from-blue-400 to-blue-600" },
              { icon: Target, label: "Sections Read", value: topics.reduce((acc, topic) => acc + (topic.current_section || 0), 0), color: "from-green-400 to-green-600" },
              { icon: Trophy, label: "Achievements", value: topics.filter(t => t.status === 'completed').length, color: "from-yellow-400 to-yellow-600" },
              { icon: Rocket, label: "Learning Streak", value: "5 days", color: "from-purple-400 to-purple-600" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-glass border-white/10 p-6 rounded-2xl text-center hover:shadow-glow transition-all">
                  <motion.div 
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <stat.icon className="h-6 w-6 text-white" />
                  </motion.div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Topics Grid */}
          <div className="space-y-8">
            {topics.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <BookOpen className="h-6 w-6 text-accent" />
                  Your Encyclopedia Collection
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topics.map((topic, index) => {
                    const progress = topic.current_section && topic.total_sections 
                      ? (topic.current_section / topic.total_sections) * 100 
                      : 0;
                    
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="cursor-pointer"
                        onClick={() => setSelectedTopic(topic)}
                      >
                        <Card className="bg-glass border-white/10 p-6 rounded-2xl hover:border-accent/30 transition-all hover:shadow-glow group">
                          <div className="flex items-start justify-between mb-4">
                            <motion.div 
                              className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-accent-glow flex items-center justify-center shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <BookOpen className="h-6 w-6 text-white" />
                            </motion.div>
                            {topic.status === 'completed' && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"
                              >
                                <motion.div
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  ✓
                                </motion.div>
                              </motion.div>
                            )}
                          </div>
                          
                          <h3 className="font-bold text-white text-lg mb-2 group-hover:text-accent transition-colors line-clamp-2">
                            {topic.title}
                          </h3>
                          
                          <p className="text-white/70 text-sm mb-4 line-clamp-2">
                            {topic.description}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-white/50 mb-4">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {topic.total_sections} sections
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              Age {topic.child_age}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/60">
                              <span>Progress</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-accent to-accent-glow rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, delay: index * 0.1 }}
                              />
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Suggested Topics */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-accent" />
                Popular Topics to Explore
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {suggestedTopics.slice(0, 8).map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Card 
                      className="bg-glass border-white/10 p-4 rounded-xl hover:border-accent/30 transition-all cursor-pointer hover:shadow-glow group"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-3">{suggestion.icon}</div>
                        <h4 className="font-medium text-white text-sm mb-2 group-hover:text-accent transition-colors line-clamp-2">
                          {suggestion.title}
                        </h4>
                        <div className="flex justify-center gap-2 text-xs text-white/50">
                          <span>{suggestion.category}</span>
                          <span>•</span>
                          <span>{suggestion.difficulty}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElevatedStreamlinedDashboard;