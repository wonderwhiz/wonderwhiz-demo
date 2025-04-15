
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagicalSearchBar from './MagicalSearchBar';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import TasksSection from './TasksSection';

interface WelcomeViewProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  onRefreshSuggestions?: () => void; // Make this optional
  isLoadingSuggestions?: boolean; // Make this optional
}

// Define a mock task for UI demonstration
const demoTasks = [
  {
    id: '1',
    title: 'Explore a new topic',
    completed: false,
    type: 'explore' as const,
    duration: '10 min',
    reward: 5
  },
  {
    id: '2',
    title: 'Complete a quiz about space',
    completed: false,
    type: 'quiz' as const,
    reward: 10
  },
  {
    id: '3',
    title: 'Read about dinosaurs',
    completed: true,
    type: 'read' as const,
    duration: '15 min',
    reward: 8
  }
];

const WelcomeView: React.FC<WelcomeViewProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  onCurioSuggestionClick,
  onRefreshSuggestions,
  isLoadingSuggestions = false, // Provide default value
}) => {
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [tasks, setTasks] = useState(demoTasks);
  
  // Fetch pending tasks count
  useEffect(() => {
    const fetchPendingTasksCount = async () => {
      try {
        const { count, error } = await supabase
          .from('child_tasks')
          .select('*', { count: 'exact', head: true })
          .eq('child_profile_id', childId)
          .eq('status', 'pending');
          
        if (error) throw error;
        setPendingTasksCount(count || 0);
      } catch (error) {
        console.error('Error fetching pending tasks count:', error);
        setPendingTasksCount(0);
      }
    };
    
    if (childId) {
      fetchPendingTasksCount();
    }
    
    // Set up a subscription to listen for task updates
    const tasksSubscription = supabase
      .channel('public:child_tasks')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'child_tasks', filter: `child_profile_id=eq.${childId}` },
        () => {
          fetchPendingTasksCount();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(tasksSubscription);
    };
  }, [childId]);

  const handleTaskClick = (task: any) => {
    console.log('Task clicked:', task);
    // In a real implementation, this would navigate to the task or expand it
  };

  return (
    <div className="container mx-auto px-4 pt-8 pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white mb-2 font-nunito"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hello, {childProfile?.name || 'Explorer'}!
          </motion.h1>
          
          <motion.p 
            className="text-white/70 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            What would you like to discover today?
          </motion.p>
          
          {childProfile?.sparks_balance !== undefined && (
            <motion.div 
              className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full text-white text-sm mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-2" />
              <span>{childProfile.sparks_balance} Sparks</span>
            </motion.div>
          )}
        </div>
        
        {/* Search Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <MagicalSearchBar
            query={query}
            setQuery={setQuery}
            handleSubmitQuery={handleSubmitQuery}
            isGenerating={isGenerating}
            placeholder="What do you want to learn about?"
          />
        </motion.div>
        
        {/* Tasks Section - Intelligently blended into the experience */}
        {pendingTasksCount > 0 && (
          <TasksSection 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
            childId={childId} 
            pendingTasksCount={pendingTasksCount} 
          />
        )}
        
        {/* Curio Suggestions */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Discover Something New</h2>
            <Button 
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (onRefreshSuggestions) {
                  onRefreshSuggestions();
                } else {
                  onCurioSuggestionClick(curioSuggestions[Math.floor(Math.random() * curioSuggestions.length)]);
                }
              }}
              disabled={isLoadingSuggestions}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
              Surprise Me
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {curioSuggestions.slice(0, 4).map((suggestion, index) => (
              <motion.div
                key={`suggestion-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-all"
                onClick={() => onCurioSuggestionClick(suggestion)}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-white">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Curios */}
        {pastCurios && pastCurios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Recent Explorations</h2>
            <div className="space-y-3">
              {pastCurios.slice(0, 3).map((curio, index) => (
                <motion.div
                  key={`curio-${curio.id}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => onCurioSuggestionClick(curio.query || curio.title)}
                  whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-white font-medium">{curio.title}</p>
                  <p className="text-white/60 text-sm mt-1">{new Date(curio.created_at).toLocaleDateString()}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;
