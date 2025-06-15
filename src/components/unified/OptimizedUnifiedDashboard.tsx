import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/use-user';
import { useChildProfile } from '@/hooks/use-child-profile';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import PersonalizedWelcome from './PersonalizedWelcome';
import StreamlinedSearchExperience from './StreamlinedSearchExperience';
import QuickDiscoveryCards from './QuickDiscoveryCards';
import CelebrationSystem from './CelebrationSystem';
import VoiceAssistant from './VoiceAssistant';
import MagicalBreadcrumbs from '@/components/navigation/MagicalBreadcrumbs';
import FloatingKidsMenu from '@/components/navigation/FloatingKidsMenu';
import EncyclopediaView from '@/components/wonderwhiz/EncyclopediaView';
import { LearningTopic } from '@/types/wonderwhiz';

const OptimizedUnifiedDashboard: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const { childProfile, isLoading: isLoadingProfile } = useChildProfile(childId);
  
  const [recentTopics, setRecentTopics] = useState<any[]>([]);
  const [streakDays, setStreakDays] = useState(0);
  const [explorationsCount, setExplorationsCount] = useState(0);
  const [isCreatingContent, setIsCreatingContent] = useState(false);
  const [activeSearchMode, setActiveSearchMode] = useState<'explore' | 'encyclopedia' | null>(null);
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

      setRecentTopics(topics || []);
      
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
    setActiveSearchMode('encyclopedia');
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
      setActiveSearchMode(null);
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
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink relative overflow-hidden">
      {/* Magical floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="relative z-10 p-4">
        <MagicalBreadcrumbs childId={childId!} />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeTopic ? (
            <motion.div
              key="encyclopedia"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <EncyclopediaView
                topic={activeTopic}
                childAge={childProfile?.age || 10}
                childProfile={childProfile}
                onBackToTopics={() => setActiveTopic(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="max-w-4xl mx-auto"
            >
              {/* Simplified Welcome */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <PersonalizedWelcome
                  childName={childProfile?.name || ''}
                  childAge={childProfile?.age || 10}
                  streakDays={streakDays}
                  sparksBalance={childProfile?.sparks_balance || 0}
                />
              </motion.div>

              {/* Streamlined Search */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
              >
                <StreamlinedSearchExperience
                  onSearch={handleUnifiedSearch}
                  isLoading={isCreatingContent}
                  childAge={childProfile?.age || 10}
                  recentTopics={[]}
                />
              </motion.div>

              {/* Content Generation Status */}
              <AnimatePresence>
                {isCreatingContent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="mb-8"
                  >
                    <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 border-2 border-wonderwhiz-bright-pink/30">
                      <motion.div 
                        className="flex items-center gap-4"
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <motion.div 
                          className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            ✨ Creating your magical encyclopedia...
                          </h3>
                          <p className="text-white/80 text-lg">
                            {searchQuery && `🔍 Working on: "${searchQuery}"`}
                          </p>
                          <p className="text-white/60 text-sm mt-1">
                            This usually takes just a few seconds! 🚀
                          </p>
                        </div>
                      </motion.div>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Minimal Celebration System */}
              <AnimatePresence>
                {(streakDays > 0 || explorationsCount > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mb-8"
                  >
                    <CelebrationSystem
                      childId={childId!}
                      streakDays={streakDays}
                      sparksBalance={childProfile?.sparks_balance || 0}
                      explorationsCount={explorationsCount}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Navigation Menu */}
      <FloatingKidsMenu childId={childId!} />

      {/* Voice Assistant */}
      <VoiceAssistant
        onVoiceQuery={handleVoiceQuery}
        childAge={childProfile?.age || 10}
      />
    </div>
  );
};

export default OptimizedUnifiedDashboard;
