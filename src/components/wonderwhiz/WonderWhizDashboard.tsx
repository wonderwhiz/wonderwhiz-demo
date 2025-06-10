
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LearningTopic } from '@/types/wonderwhiz';
import TopicSearch from './TopicSearch';
import TopicGrid from './TopicGrid';
import EncyclopediaView from './EncyclopediaView';
import { Sparkles, BookOpen } from 'lucide-react';

interface WonderWhizDashboardProps {
  childProfile: any;
  onTopicCreate: (topic: LearningTopic) => void;
}

const WonderWhizDashboard: React.FC<WonderWhizDashboardProps> = ({
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
      setTopics(data || []);
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
      toast.loading('Creating your encyclopedia topic...');
      
      // Generate the topic with table of contents
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

      const newTopic = topicResponse as LearningTopic;
      
      // Generate content for the first section immediately
      if (newTopic.table_of_contents && newTopic.table_of_contents.length > 0) {
        try {
          await supabase.functions.invoke('generate-section-content', {
            body: {
              topicId: newTopic.id,
              sectionTitle: newTopic.table_of_contents[0].title,
              sectionNumber: 1,
              childAge: childProfile.age || 10,
              topicTitle: newTopic.title
            }
          });
        } catch (sectionError) {
          console.error('Section generation error:', sectionError);
          // Don't fail the whole process if section generation fails
        }
      }

      setTopics(prev => [newTopic, ...prev]);
      setSelectedTopic(newTopic);
      onTopicCreate(newTopic);
      
      toast.dismiss();
      toast.success('Encyclopedia topic created! 📚');
      
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.dismiss();
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
    loadTopics(); // Refresh topics when going back
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
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <BookOpen className="h-8 w-8 text-wonderwhiz-bright-pink" />
            <h1 className="text-4xl font-bold text-white">
              Wonder Whiz Encyclopedia
            </h1>
            <Sparkles className="h-8 w-8 text-wonderwhiz-bright-pink" />
          </motion.div>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Discover amazing topics through interactive, age-appropriate encyclopedia entries 
            designed just for you, {childProfile?.name}!
          </p>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <TopicSearch 
            onSearch={handleTopicSearch}
            isLoading={isCreatingTopic}
            childAge={childProfile?.age || 10}
          />
        </motion.div>

        {/* Topics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
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

export default WonderWhizDashboard;
