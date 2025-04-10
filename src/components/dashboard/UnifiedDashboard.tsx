
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import { Badge } from '@/components/ui/badge';
import { Rocket, Sparkles, Star, Bell, MessageSquare } from 'lucide-react';
import UnifiedSearchBar from './UnifiedSearchBar';
import KnowledgeJourney from './KnowledgeJourney';
import IntelligentTasks from './IntelligentTasks';
import DailyChallenge from './DailyChallenge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

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
  
  // Get task counts for notification badges
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [newChallengesCount, setNewChallengesCount] = useState(1); // Default to 1 for demo
  
  // Handle task count updates
  const handleTaskCountUpdate = (count: number) => {
    setPendingTasksCount(count);
  };
  
  // Handle challenge count updates
  const handleChallengeCountUpdate = (count: number) => {
    setNewChallengesCount(count);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15
      }
    }
  };
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
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
  
  // Default to 'explore' tab
  const [activeTab, setActiveTab] = useState("explore");
  
  // Handle tab change to clear notification counts
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Clear notification counts when visiting the tab
    if (value === "tasks") {
      setPendingTasksCount(0);
    }
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
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-white font-medium text-sm">
              {childProfile?.sparks_balance || 0}
            </span>
          </div>
          
          {childProfile?.streak_days > 0 && (
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
              <Badge variant="outline" className="bg-transparent border-none text-white/90 flex items-center gap-1.5 p-0">
                <Rocket className="h-4 w-4 text-amber-400" />
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
      
      {/* Main content area with tabs */}
      <motion.div variants={sectionVariants}>
        <Tabs defaultValue="explore" value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-full max-w-md mx-auto bg-white/10 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="explore" className="data-[state=active]:bg-indigo-600/70 relative">
              Explore & Learn
            </TabsTrigger>
            <TabsTrigger value="tasks" className="data-[state=active]:bg-indigo-600/70 relative">
              <span>Tasks & Challenges</span>
              {(pendingTasksCount > 0 || newChallengesCount > 0) && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {pendingTasksCount + newChallengesCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="mt-0">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Knowledge journey - spans two columns */}
              <div className="lg:col-span-2">
                <KnowledgeJourney
                  childId={childId}
                  childProfile={childProfile}
                  onTopicClick={handleTopicClick}
                />
              </div>
              
              {/* Current tab only shows challenges if on explore tab */}
              <div>
                <DailyChallenge 
                  childId={childId}
                  onNewChallenges={handleChallengeCountUpdate} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="grid grid-cols-1 gap-6">
              {/* Full-width tasks section when on tasks tab */}
              <IntelligentTasks
                childId={childId}
                childProfile={childProfile}
                onTaskAction={handleTaskAction}
                onPendingTasksCount={handleTaskCountUpdate}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedDashboard;
