
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { toast } from 'sonner';
import { Sparkles, BookOpen, Compass, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PersonalizedWelcome from './PersonalizedWelcome';
import EnhancedUnifiedSearchBar from './EnhancedUnifiedSearchBar';
import QuickStartOnboarding from './QuickStartOnboarding';
import RecentExplorations from './RecentExplorations';
import SuggestedTopics from './SuggestedTopics';
import CelebrationSystem from './CelebrationSystem';
import SparksBalance from '@/components/SparksBalance';
import VoiceAssistant from './VoiceAssistant';

const UnifiedChildDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile } = useChildProfile(childId);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recentCurios, setRecentCurios] = useState<any[]>([]);
  const [recentTopics, setRecentTopics] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [explorationsCount, setExplorationsCount] = useState(0);
  const [isCreatingContent, setIsCreatingContent] = useState(false);

  useEffect(() => {
    if (user && !childId) {
      navigate('/profiles');
      return;
    }

    if (childProfile) {
      loadRecentActivity();
      checkFirstTimeUser();
    }
  }, [user, childId, childProfile, navigate]);

  const loadRecentActivity = async () => {
    if (!childId) return;

    try {
      // Load recent curios
      const { data: curios } = await supabase
        .from('curios')
        .select('*')
        .eq('child_id', childId)
        .order('last_updated_at', { ascending: false })
        .limit(3);

      // Load recent Wonder Whiz topics
      const { data: topics } = await supabase
        .from('learning_topics')
        .select('*')
        .eq('child_id', childId)
        .order('updated_at', { ascending: false })
        .limit(3);

      setRecentCurios(curios || []);
      setRecentTopics(topics || []);
      
      // Set total explorations count
      const totalExplorations = (curios?.length || 0) + (topics?.length || 0);
      setExplorationsCount(totalExplorations);

      // Calculate streak (simplified)
      const today = new Date().toDateString();
      const lastActivity = curios?.[0]?.last_updated_at || topics?.[0]?.updated_at;
      if (lastActivity) {
        const lastDate = new Date(lastActivity).toDateString();
        setStreakDays(lastDate === today ? 1 : 0);
      }
    } catch (error) {
      console.error('Error loading recent activity:', error);
    }
  };

  const checkFirstTimeUser = async () => {
    if (!childId) return;

    const totalContent = recentCurios.length + recentTopics.length;
    if (totalContent === 0) {
      setShowOnboarding(true);
    }
  };

  const handleUnifiedSearch = async (query: string, mode: 'explore' | 'encyclopedia' = 'explore') => {
    if (!childId || !query.trim()) return;

    setIsCreatingContent(true);
    
    try {
      if (mode === 'encyclopedia') {
        // Create Wonder Whiz topic
        const { data: topicResponse, error } = await supabase.functions
          .invoke('generate-wonderwhiz-topic', {
            body: {
              topic: query,
              childAge: childProfile?.age || 10,
              childId
            }
          });

        if (error) throw error;

        toast.success('Encyclopedia created! 📚');
        navigate(`/wonderwhiz/${childId}`);
      } else {
        // Create Curio exploration
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: childId,
            title: query,
            query: query
          })
          .select('id')
          .single();

        if (error) throw error;

        toast.success('Exploration started! 🚀');
        navigate(`/wonderwhiz/${childId}?topic=${encodeURIComponent(query)}`);
      }
    } catch (error) {
      console.error('Error creating content:', error);
      toast.error('Something went wrong. Try again!');
    } finally {
      setIsCreatingContent(false);
    }
  };

  const handleQuickStart = (topic: string) => {
    handleUnifiedSearch(topic, 'explore');
  };

  const handleRecentCurioClick = (id: string) => {
    const curio = recentCurios.find(c => c.id === id);
    if (curio) {
      navigate(`/wonderwhiz/${childId}?topic=${encodeURIComponent(curio.title)}`);
    }
  };

  const handleRecentTopicClick = (id: string) => {
    navigate(`/wonderwhiz/${childId}?topicId=${id}`);
  };

  const handleVoiceQuery = (query: string) => {
    if (query.toLowerCase().includes('hey wonderwhiz')) {
      const cleanQuery = query.replace(/hey wonderwhiz,?\s*/i, '');
      if (cleanQuery.trim()) {
        handleUnifiedSearch(cleanQuery.trim(), 'explore');
      }
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink"></div>
            <div>
              <h2 className="text-xl font-bold text-white">Loading your adventure...</h2>
              <p className="text-white/70">Getting everything ready!</p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!childProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8">
          <div className="text-center">
            <h2 className="text-xl font-bold text-white mb-4">Profile not found</h2>
            <Button onClick={() => navigate('/profiles')} className="bg-wonderwhiz-bright-pink">
              Back to Profiles
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Enhanced Personalized Welcome */}
        <PersonalizedWelcome
          childName={childProfile.name}
          childAge={childProfile.age || 10}
          streakDays={streakDays}
          sparksBalance={childProfile.sparks_balance || 0}
        />

        {/* Enhanced Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <EnhancedUnifiedSearchBar
            onSearch={handleUnifiedSearch}
            isLoading={isCreatingContent}
            childAge={childProfile.age || 10}
            placeholder="What sparks your curiosity today?"
          />
        </motion.div>

        {/* Celebration System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <CelebrationSystem
            childId={childId!}
            streakDays={streakDays}
            sparksBalance={childProfile.sparks_balance || 0}
            explorationsCount={explorationsCount}
          />
        </motion.div>

        {/* Quick Start Onboarding */}
        <AnimatePresence>
          {showOnboarding && (
            <QuickStartOnboarding
              onTopicSelect={handleQuickStart}
              onDismiss={() => setShowOnboarding(false)}
              childAge={childProfile.age || 10}
            />
          )}
        </AnimatePresence>

        {/* Recent Activity */}
        {(recentCurios.length > 0 || recentTopics.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <RecentExplorations
              curios={recentCurios}
              topics={recentTopics}
              onCurioClick={handleRecentCurioClick}
              onTopicClick={handleRecentTopicClick}
            />
          </motion.div>
        )}

        {/* Suggested Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SuggestedTopics
            childAge={childProfile.age || 10}
            onTopicSelect={handleQuickStart}
          />
        </motion.div>
      </div>

      {/* Voice Assistant */}
      <VoiceAssistant
        onVoiceQuery={handleVoiceQuery}
        childAge={childProfile.age || 10}
      />
    </div>
  );
};

export default UnifiedChildDashboard;
