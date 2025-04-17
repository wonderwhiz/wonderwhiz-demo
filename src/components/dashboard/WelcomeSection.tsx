import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import EnhancedSearchInput from './EnhancedSearchInput';
import TasksSection from './TasksSection';
import PersonalizedRecommendations from './PersonalizedRecommendations';
import { toast } from 'sonner';
import SparksOverview from '@/components/SparksOverview';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';

interface WelcomeSectionProps {
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  handleRefreshSuggestions: () => void;
  handleCurioSuggestionClick: (suggestion: string) => void;
  childProfile: any;
  pastCurios: any[];
  childId: string;
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  curioSuggestions,
  isLoadingSuggestions,
  handleRefreshSuggestions,
  handleCurioSuggestionClick,
  childProfile,
  pastCurios,
  childId,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [pendingTasksCount, setPendingTasksCount] = React.useState(pastCurios.length > 0 ? 2 : 1);
  
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const handleFormSubmit = () => {
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
    } else if (!query.trim()) {
      toast.error("Please enter a question first");
    }
  };

  const handleTaskClick = (task: any) => {
    // Handle task click implementation
    console.log('Task clicked:', task);
  };

  // Fetch tasks from parent-assigned tasks
  React.useEffect(() => {
    const fetchParentAssignedTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('child_tasks')
          .select(`
            id,
            status,
            task:tasks (id, title, description, sparks_reward)
          `)
          .eq('child_profile_id', childId)
          .eq('status', 'pending');
        
        if (error) throw error;
        
        if (data) {
          setPendingTasksCount(data.length);
        }
      } catch (error) {
        console.error('Error fetching parent-assigned tasks:', error);
      }
    };
    
    if (childId) {
      fetchParentAssignedTasks();
    }
  }, [childId]);

  // Sample tasks data - in a real implementation, this would come from the database
  const tasks = [
    {
      id: '1',
      title: 'Explore a new topic about science',
      completed: false,
      type: 'explore' as const,
      duration: '10 min',
      reward: 5
    },
    {
      id: '2',
      title: 'Complete the volcano quiz',
      completed: false,
      type: 'quiz' as const,
      reward: 10
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-5xl mx-auto">
        {/* Header with greeting */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl md:text-3xl font-nunito font-bold text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {getTimeBasedGreeting()}, {childProfile?.name || 'Explorer'}!
          </motion.h1>
          <p className="text-white/70">What would you like to discover today?</p>
        </motion.div>

        <div className={`grid grid-cols-1 ${isMobile ? '' : 'md:grid-cols-3'} gap-6`}>
          <div className={`${isMobile ? '' : 'md:col-span-2'} space-y-6`}>
            {/* Main search input */}
            <div className="mb-6">
              <EnhancedSearchInput
                onSearch={(q) => {
                  setQuery(q);
                  setTimeout(() => handleSubmitQuery(), 100);
                }}
                onImageCapture={(file) => {
                  const mockQuery = "What is this in the image?";
                  setQuery(mockQuery);
                  handleSubmitQuery();
                }}
                onVoiceCapture={(transcript) => {
                  setQuery(transcript);
                  if (transcript.trim()) {
                    setTimeout(() => handleSubmitQuery(), 300);
                  }
                }}
                isProcessing={isGenerating}
                childAge={childProfile?.age}
                initialQuery={query}
                placeholder="What are you curious about today?"
              />
            </div>

            {/* Tasks section - prominently displayed */}
            {pendingTasksCount > 0 && (
              <TasksSection 
                tasks={tasks} 
                onTaskClick={handleTaskClick} 
                childId={childId} 
                pendingTasksCount={pendingTasksCount} 
              />
            )}
            
            {/* Personalized recommendations - based on user interests, likes, and past curios */}
            <PersonalizedRecommendations
              childId={childId}
              childProfile={childProfile}
              suggestions={curioSuggestions}
              isLoading={isLoadingSuggestions}
              onSuggestionClick={handleCurioSuggestionClick}
              onRefresh={handleRefreshSuggestions}
              pastCurios={pastCurios}
            />
          </div>
          
          {/* Right sidebar with sparks and progress - Only show on larger screens or at the bottom on mobile */}
          {!isMobile ? (
            <div className="space-y-6">
              <SparksOverview 
                childId={childId} 
                sparksBalance={childProfile?.sparks_balance || 0} 
              />
              
              {/* Quick actions */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Star className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                  Quick Actions
                </h3>
                
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-white bg-white/10 border-white/10 hover:bg-white/20"
                    onClick={() => handleCurioSuggestionClick("Tell me a fun fact")}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                    Discover a fun fact
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-white bg-white/10 border-white/10 hover:bg-white/20"
                    onClick={() => navigate('/knowledge-map/' + childId)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-pink" />
                    View knowledge map
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <SparksOverview 
                childId={childId} 
                sparksBalance={childProfile?.sparks_balance || 0} 
              />
              
              {/* Quick actions for mobile */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mt-4">
                <h3 className="text-white font-medium mb-3 flex items-center">
                  <Star className="h-4 w-4 text-wonderwhiz-gold mr-2" />
                  Quick Actions
                </h3>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 justify-center text-white bg-white/10 border-white/10 hover:bg-white/20"
                    onClick={() => handleCurioSuggestionClick("Tell me a fun fact")}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                    Fun Fact
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex-1 justify-center text-white bg-white/10 border-white/10 hover:bg-white/20"
                    onClick={() => navigate('/knowledge-map/' + childId)}
                  >
                    <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-pink" />
                    Knowledge Map
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomeSection;
