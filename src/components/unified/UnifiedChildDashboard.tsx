
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
import UnifiedSearchBar from './UnifiedSearchBar';
import QuickStartOnboarding from './QuickStartOnboarding';
import RecentExplorations from './RecentExplorations';
import SuggestedTopics from './SuggestedTopics';
import SparksBalance from '@/components/SparksBalance';

const UnifiedChildDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile } = useChildProfile(childId);
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recentCurios, setRecentCurios] = useState<any[]>([]);
  const [recentTopics, setRecentTopics] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(0);
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
        .order('updated_at', { ascending: false })
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

      // Calculate streak (simplified)
      const today = new Date().toDateString();
      const lastActivity = curios?.[0]?.updated_at || topics?.[0]?.updated_at;
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
        navigate(`/curio/${childId}/${newCurio.id}`);
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Hey {childProfile.name}! 👋
            </h1>
            <div className="flex items-center gap-4">
              <SparksBalance childId={childId} size="md" />
              {streakDays > 0 && (
                <div className="flex items-center gap-1 text-white/80">
                  <Star className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">{streakDays} day streak!</span>
                </div>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/profiles')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            Switch Profile
          </Button>
        </motion.div>

        {/* Main Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <UnifiedSearchBar
            onSearch={handleUnifiedSearch}
            isLoading={isCreatingContent}
            childAge={childProfile.age || 10}
            placeholder="What do you want to explore today?"
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
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <RecentExplorations
              curios={recentCurios}
              topics={recentTopics}
              onCurioClick={(id) => navigate(`/curio/${childId}/${id}`)}
              onTopicClick={() => navigate(`/wonderwhiz/${childId}`)}
            />
          </motion.div>
        )}

        {/* Suggested Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SuggestedTopics
            childAge={childProfile.age || 10}
            onTopicSelect={handleQuickStart}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default UnifiedChildDashboard;
