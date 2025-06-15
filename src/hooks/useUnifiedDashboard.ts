
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { toast } from 'sonner';
import { LearningTopic } from '@/types/wonderwhiz';

export const useUnifiedDashboard = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile } = useChildProfile(childId);
  
  const [recentTopics, setRecentTopics] = useState<LearningTopic[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [explorationsCount, setExplorationsCount] = useState(0);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState<LearningTopic | null>(null);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
      return;
    }

    if (childProfile) {
      loadRecentActivity();
    }
  }, [user, childId, childProfile, navigate]);

  const loadRecentActivity = async () => {
    if (!childId) return;

    try {
      // Load recent Wonder Whiz topics
      const { data: topics } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('child_id', childId)
        .order('updated_at', { ascending: false })
        .limit(3);

      setRecentTopics((topics as LearningTopic[]) || []);
      
      // Set total explorations count
      const totalExplorations = (topics?.length || 0);
      setExplorationsCount(totalExplorations);

      // Calculate streak (simplified)
      const today = new Date().toDateString();
      const lastActivity = topics?.[0]?.updated_at;
      if (lastActivity) {
        const lastDate = new Date(lastActivity).toDateString();
        setStreakDays(lastDate === today ? 1 : 0);
      }
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const handleUnifiedSearch = async (query: string) => {
    if (!childId || !query.trim()) return;

    console.log('Search initiated, creating encyclopedia topic:', { query, childId });
    
    setIsCreatingContent(true);
    setSearchQuery(query);
    
    try {
      // Create Wonder Whiz topic and navigate
      console.log('Creating Wonder Whiz topic...');
      const { data: topicResponse, error } = await supabase.functions
        .invoke('generate-wonderwhiz-topic', {
          body: {
            topic: query,
            childAge: childProfile?.age || 10,
            childId
          }
        });

      if (error) {
        console.error('Wonder Whiz creation error:', error);
        throw error;
      }
      
      if (!topicResponse) {
        throw new Error('No topic data returned from function.');
      }

      console.log('Wonder Whiz topic created:', topicResponse);
      toast.success('Encyclopedia created! 📚');
      
      const newTopic = {
        ...topicResponse,
        status: topicResponse.status as 'planning' | 'in_progress' | 'completed'
      } as LearningTopic;

      setActiveTopic(newTopic);
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setIsCreatingContent(false);
      setSearchQuery('');
    }
  };

  const handleVoiceQuery = (query: string) => {
    if (query.toLowerCase().includes('hey wonderwhiz')) {
      const cleanQuery = query.replace(/hey wonderwhiz,?\s*/i, '');
      if (cleanQuery.trim()) {
        handleUnifiedSearch(cleanQuery.trim());
      }
    }
  };

  return {
    childId,
    childProfile,
    isLoadingProfile,
    streakDays,
    explorationsCount,
    isCreatingContent,
    searchQuery,
    activeTopic,
    recentTopics,
    handleUnifiedSearch,
    handleVoiceQuery,
    setActiveTopic
  };
};
