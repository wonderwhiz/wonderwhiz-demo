
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import WelcomeHeader from './WelcomeHeader';
import EnhancedSearchInput from './EnhancedSearchInput';
import RecommendedWonders from './RecommendedWonders';
import TasksSection from './TasksSection';
import { BookOpen, Rocket, Lightbulb, Compass, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface ModernDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
}

const ModernDashboard: React.FC<ModernDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  
  // Sample tasks data
  const tasks = [
    {
      id: '1',
      title: 'Complete today\'s science challenge',
      completed: false,
      type: 'quiz' as const,
      duration: '5 min',
      reward: 10
    },
    {
      id: '2',
      title: 'Explore a new topic',
      completed: false,
      type: 'explore' as const,
      duration: '10 min',
      reward: 15
    },
    {
      id: '3',
      title: 'Read about dinosaurs',
      completed: true,
      type: 'read' as const,
      reward: 10
    },
    {
      id: '4',
      title: 'Create a space drawing',
      completed: true,
      type: 'create' as const,
      reward: 20
    }
  ];
  
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };
  
  const handleImageCapture = (file: File) => {
    setSelectedImage(file);
    
    // Simulate image recognition
    setTimeout(() => {
      handleSearch("What are volcanoes and how do they work?");
      toast.success("I identified a volcano in your image!");
    }, 1500);
  };
  
  const handleVoiceCapture = (transcript: string) => {
    setQuery(transcript);
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };
  
  const handleTaskClick = (task: any) => {
    if (!task.completed) {
      toast.success(`Starting: ${task.title}`);
      
      if (task.type === 'explore') {
        const randomSuggestion = curioSuggestions[Math.floor(Math.random() * curioSuggestions.length)];
        onCurioSuggestionClick(randomSuggestion);
      }
    }
  };
  
  const getRecentCurios = () => {
    return pastCurios.slice(0, 3).map(curio => ({
      id: curio.id,
      title: curio.title || 'Untitled Wonder',
      date: new Date(curio.created_at).toLocaleDateString(),
      type: getTopicType(curio.title || '')
    }));
  };
  
  const getTopicType = (topic: string): string => {
    const lowercased = topic.toLowerCase();
    
    if (lowercased.includes('space') || lowercased.includes('planet') || lowercased.includes('star')) {
      return 'space';
    } else if (lowercased.includes('animal') || lowercased.includes('dinosaur')) {
      return 'animals';
    } else if (lowercased.includes('history')) {
      return 'history';
    } else if (lowercased.includes('science')) {
      return 'science';
    }
    
    return 'general';
  };
  
  const childAge = childProfile?.age ? Number(childProfile.age) : 10;
  const recentCurios = getRecentCurios();
  
  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Welcome Header */}
      <WelcomeHeader 
        childName={childProfile?.name || 'Explorer'} 
        streakDays={childProfile?.streak_days || 0}
        sparksBalance={childProfile?.sparks_balance || 0}
        childAge={childAge}
      />
      
      {/* Enhanced Search */}
      <div className="mb-8">
        <EnhancedSearchInput
          onSearch={handleSearch}
          onImageCapture={handleImageCapture}
          onVoiceCapture={handleVoiceCapture}
          placeholder="What are you curious about today?"
          initialQuery={query}
          isProcessing={isGenerating}
          childAge={childAge}
        />
      </div>
      
      {/* Recommendations and Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <RecommendedWonders
            suggestions={curioSuggestions}
            isLoading={isLoadingSuggestions}
            onSuggestionClick={onCurioSuggestionClick}
            onRefresh={handleRefreshSuggestions}
          />
        </div>
        
        <div className="md:col-span-1">
          <TasksSection 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
          />
        </div>
      </div>
      
      {/* Recent Journeys and Learning Paths */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Journeys */}
        <Card className="bg-gradient-to-br from-indigo-500/20 to-blue-600/20 border-indigo-500/30 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center mr-3">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-medium text-white">Recent Journeys</h2>
            </div>
            
            <div className="space-y-3">
              {recentCurios.length > 0 ? (
                recentCurios.map((curio, index) => (
                  <motion.div
                    key={curio.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-colors"
                    onClick={() => onCurioSuggestionClick(curio.title)}
                  >
                    <div className="flex items-start">
                      <div className="p-2 rounded-full bg-white/10 mr-3">
                        {curio.type === 'space' && <Rocket className="h-4 w-4 text-blue-400" />}
                        {curio.type === 'animals' && <Compass className="h-4 w-4 text-green-400" />}
                        {(curio.type === 'general' || curio.type === 'science') && <Lightbulb className="h-4 w-4 text-amber-400" />}
                        {curio.type === 'history' && <BookOpen className="h-4 w-4 text-orange-400" />}
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm line-clamp-1">{curio.title}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/60 text-xs">{curio.date}</span>
                          <ArrowRight className="h-3 w-3 text-white/60" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4 text-white/60">
                  No journeys yet. Start exploring!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Learning Paths */}
        <Card className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 border-pink-500/30 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center mr-3">
                <Compass className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-lg font-medium text-white">Learning Paths</h2>
            </div>
            
            <div className="space-y-3">
              {['Space Exploration', 'Animal Kingdom', 'Earth Science', 'History Adventures'].map((path, index) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-3 cursor-pointer transition-colors group"
                  onClick={() => onCurioSuggestionClick(path)}
                >
                  <div className="flex justify-between items-center">
                    <p className="text-white font-medium">{path}</p>
                    <ArrowRight className="h-4 w-4 text-white/60 group-hover:translate-x-1 transition-transform" />
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ModernDashboard;
