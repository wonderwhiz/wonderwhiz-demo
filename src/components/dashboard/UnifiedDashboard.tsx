
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Badge } from '@/components/ui/badge';
import { Rocket, Sparkles, Star } from 'lucide-react';
import UnifiedSearchBar from './UnifiedSearchBar';
import KnowledgeJourney from './KnowledgeJourney';
import IntelligentTasks from './IntelligentTasks';
import DailyChallenge from './DailyChallenge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UnifiedDashboardProps {
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

const UnifiedDashboard: React.FC<UnifiedDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating
}) => {
  // Format recent queries for search history
  const recentQueries = pastCurios
    .slice(0, 5)
    .map(curio => curio.query || curio.title)
    .filter(Boolean);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };
  
  // Handle when a user clicks on a task
  const handleTaskAction = (task: string) => {
    setQuery(task);
    setTimeout(() => handleSubmitQuery(), 100);
  };
  
  // Handle when a topic is clicked in the knowledge journey
  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setTimeout(() => handleSubmitQuery(), 100);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-6"
    >
      {/* Header with greeting and stats */}
      <motion.div 
        variants={sectionVariants}
        className="mb-6 flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-white">{getGreeting()}</h1>
          <p className="text-white/70 mt-1">What will you discover today?</p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
            <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />
            <span className="text-white font-medium text-sm">
              {childProfile?.sparks_balance || 0}
            </span>
          </div>
          
          {childProfile?.streak_days > 0 && (
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <Badge variant="outline" className="bg-transparent border-none text-white/90 flex items-center gap-1.5 p-0">
                <Rocket className="h-4 w-4 text-wonderwhiz-gold" />
                <span>{childProfile.streak_days} day streak</span>
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Unified search experience - The focal point */}
      <motion.div variants={sectionVariants}>
        <UnifiedSearchBar
          query={query}
          setQuery={setQuery}
          handleSubmitQuery={handleSubmitQuery}
          isGenerating={isGenerating}
          recentQueries={recentQueries}
          childId={childId}
          childProfile={childProfile}
        />
      </motion.div>
      
      {/* Main content area - Two clear tabs: Explore and Tasks */}
      <motion.div variants={sectionVariants}>
        <Tabs defaultValue="explore" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-full max-w-sm mx-auto bg-white/10 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="explore" className="data-[state=active]:bg-white/15">
              Explore & Learn
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-white/15">
              Tasks & Challenges
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Knowledge journey - spans two columns on larger screens */}
              <div className="lg:col-span-2">
                <KnowledgeJourney
                  childId={childId}
                  childProfile={childProfile}
                  onTopicClick={handleTopicClick}
                />
              </div>
              
              {/* Daily Challenges - one column */}
              <div>
                <DailyChallenge 
                  childId={childId}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {/* Parent-assigned tasks integrated right into the main experience */}
              <IntelligentTasks
                childId={childId}
                childProfile={childProfile}
                onTaskAction={handleTaskAction}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedDashboard;
