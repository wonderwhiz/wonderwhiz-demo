
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LearningTopic } from '@/types/wonderwhiz';
import EnhancedTopicSearch from './EnhancedTopicSearch';
import TopicGrid from './TopicGrid';
import EncyclopediaView from './EncyclopediaView';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamlinedDashboardProps {
  childProfile: any;
  onTopicCreate: (topic: LearningTopic) => void;
}

const StreamlinedDashboard: React.FC<StreamlinedDashboardProps> = ({
  childProfile,
  onTopicCreate
}) => {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingTopic, setIsCreatingTopic] = useState(false);

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
    if (!childProfile?.id || isCreatingTopic) return;

    setIsCreatingTopic(true);
    
    try {
      console.log('Creating topic for query:', query);
      
      const { data: topicResponse, error: topicError } = await supabase.functions
        .invoke('generate-wonderwhiz-topic', {
          body: {
            topic: query,
            childAge: childProfile.age || 10,
            childId: childProfile.id
          }
        });

      if (topicError) {
        console.error('Topic generation error:', topicError);
        throw new Error('Failed to create topic');
      }

      if (!topicResponse) {
        throw new Error('No topic data returned');
      }

      const newTopic = {
        ...topicResponse,
        status: topicResponse.status as 'planning' | 'in_progress' | 'completed'
      } as LearningTopic;
      
      console.log('Topic created successfully:', newTopic);
      
      setTopics(prev => [newTopic, ...prev]);
      setSelectedTopic(newTopic);
      onTopicCreate(newTopic);
      
      toast.success('Encyclopedia topic created! 📚');
      
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create encyclopedia topic. Please try again.');
    } finally {
      setIsCreatingTopic(false);
    }
  };

  const handleTopicSelect = (topic: LearningTopic) => {
    setSelectedTopic(topic);
  };

  const handleBackToTopics = () => {
    setSelectedTopic(null);
    loadTopics();
  };

  const handleRefresh = () => {
    loadTopics();
  };

  if (selectedTopic) {
    return (
      <EncyclopediaView
        topic={selectedTopic}
        childAge={childProfile?.age || 10}
        childProfile={childProfile}
        onBackToTopics={handleBackToTopics}
      />
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          {topics.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleRefresh}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>

        <EnhancedTopicSearch 
          onSearch={handleTopicSearch}
          isLoading={isCreatingTopic}
          childAge={childProfile?.age || 10}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <TopicGrid
            topics={topics}
            isLoading={isLoading}
            onTopicSelect={handleTopicSelect}
            childAge={childProfile?.age || 10}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StreamlinedDashboard;
