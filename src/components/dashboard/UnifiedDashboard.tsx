
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import UnifiedSearchBar from './UnifiedSearchBar';
import KnowledgeJourney from './KnowledgeJourney';
import IntelligentTasks from './IntelligentTasks';
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
    .slice(0, 3)
    .map(curio => curio.query || curio.title)
    .filter(Boolean);
  
  // Simple notification state
  const [pendingTasksCount] = useState(1);
  
  // Default to 'explore' tab
  const [activeTab, setActiveTab] = useState("explore");
  
  // Handle topic click - reuse query input
  const handleTopicClick = (topic: string) => {
    setQuery(topic);
    setTimeout(() => handleSubmitQuery(), 100);
  };
  
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = childProfile?.name || 'Explorer';
    
    if (hour < 12) return `Good morning, ${name}`;
    if (hour < 18) return `Good afternoon, ${name}`;
    return `Good evening, ${name}`;
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.12
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto px-4 py-6"
    >
      {/* Header - Simplified */}
      <motion.div 
        variants={itemVariants}
        className="mb-6 flex flex-col md:flex-row md:items-center justify-between"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-nunito font-bold text-white">{getGreeting()}</h1>
        </div>
        
        <div className="flex items-center space-x-3 mt-3 md:mt-0">
          <div className="flex items-center space-x-1.5 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
            <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-vibrant-yellow" />
            <span className="text-white font-medium text-sm">
              {childProfile?.sparks_balance || 0}
            </span>
          </div>
          
          {childProfile?.streak_days > 0 && (
            <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              <Badge variant="outline" className="bg-transparent border-none text-white/90 flex items-center gap-1.5 p-0">
                <Rocket className="h-3.5 w-3.5 text-wonderwhiz-vibrant-yellow" />
                <span className="text-sm">{childProfile.streak_days}d</span>
              </Badge>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Search Experience - Simplified */}
      <motion.div variants={itemVariants}>
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
      
      {/* Content Tabs - Streamlined */}
      <motion.div variants={itemVariants} className="mt-6">
        <Tabs defaultValue="explore" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-5 w-full max-w-md mx-auto bg-white/5 border border-white/10 rounded-full">
            <TabsTrigger 
              value="explore" 
              className="data-[state=active]:bg-wonderwhiz-bright-pink/30 rounded-full relative font-medium text-sm"
            >
              Explore & Learn
            </TabsTrigger>
            <TabsTrigger 
              value="tasks" 
              className="data-[state=active]:bg-wonderwhiz-vibrant-yellow/30 rounded-full relative font-medium text-sm"
            >
              <span>Tasks</span>
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-wonderwhiz-bright-pink text-[10px] text-white font-medium">
                  {pendingTasksCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="explore" className="mt-0">
            <div className="space-y-4">
              <KnowledgeJourney
                childId={childId}
                childProfile={childProfile}
                onTopicClick={handleTopicClick}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="tasks" className="mt-0">
            <div className="space-y-4">
              <IntelligentTasks
                childId={childId}
                childProfile={childProfile}
                onTaskAction={handleTopicClick}
                onPendingTasksCount={() => {}}
              />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default UnifiedDashboard;
