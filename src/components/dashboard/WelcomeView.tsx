import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MagicalSearchInput from './MagicalSearchInput';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import TasksSection from './TasksSection';
import { useWhizzyChat } from '@/integrations/whizzychat';

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
  onRefreshSuggestions?: () => void;
  isLoadingSuggestions?: boolean;
}

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
  isLoadingSuggestions = false,
}) => {
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [tasks, setTasks] = useState(demoTasks);
  
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
  };

  const handleImageUpload = async (file: File) => {
    const mockQuery = "What is this beautiful mountain?";
    setQuery(mockQuery);
    handleSubmitQuery();
  };

  const handleVoiceInput = (transcript: string) => {
    setQuery(transcript);
    handleSubmitQuery();
  };

  const {
    isMuted,
    toggleMute,
    isListening,
    transcript,
    toggleVoice,
    isProcessing,
    chatHistory,
    voiceSupported
  } = useWhizzyChat({
    childAge: childProfile?.age,
    curioContext: childProfile?.name,
    onNewQuestionGenerated: (question) => onCurioSuggestionClick(question)
  });

  return (
    <div className="container mx-auto px-4 pt-8 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Hello, {childProfile?.name || 'Explorer'}!
          </motion.h1>
          
          <motion.p 
            className="text-white/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            What would you like to discover today?
          </motion.p>
        </motion.div>

        <div className="mb-12">
          <MagicalSearchInput
            onSearch={handleSubmitQuery}
            onImageUpload={handleImageUpload}
            onVoiceInput={handleVoiceInput}
            isProcessing={isGenerating}
            childAge={childProfile?.age}
            initialQuery={query}
            placeholder="What are you curious about today?"
          />
        </div>

        {pendingTasksCount > 0 && (
          <TasksSection 
            tasks={tasks} 
            onTaskClick={handleTaskClick} 
            childId={childId} 
            pendingTasksCount={pendingTasksCount} 
          />
        )}
        
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
              onClick={onRefreshSuggestions}
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
        
        {pastCurios && pastCurios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">Your Recent Explorations</h2>
            <div className="space-y-3">
              {pastCurios.slice(0, 3).map((curio) => (
                <motion.div
                  key={curio.id}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => onCurioSuggestionClick(curio.query || curio.title)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-white font-medium">{curio.title}</p>
                  <p className="text-white/60 text-sm mt-1">
                    {new Date(curio.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
        
        <WhizzyChat
          messages={chatHistory}
          onSend={(message) => onCurioSuggestionClick(message)}
          isListening={isListening}
          isProcessing={isProcessing}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onToggleVoice={toggleVoice}
          transcript={transcript}
          childAge={childProfile?.age}
        />
      </div>
    </div>
  );
};

export default WelcomeView;
