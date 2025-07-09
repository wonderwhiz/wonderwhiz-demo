import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import KidsFriendlyDashboard from '@/components/dashboard/KidsFriendlyDashboard';
import QuickTopicOverview from './QuickTopicOverview';
import SimpleEncyclopedia from './SimpleEncyclopedia';
import RelatedTopics from './RelatedTopics';
import { Trophy, Home, Sparkles } from 'lucide-react';

interface StreamlinedWonderWhizProps {
  childId: string;
}

type ViewState = 'dashboard' | 'topic-overview' | 'learning' | 'completed' | 'explore-more';

const StreamlinedWonderWhiz: React.FC<StreamlinedWonderWhizProps> = ({ childId }) => {
  const [viewState, setViewState] = useState<ViewState>('dashboard');
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  
  const {
    childProfile,
    isLoadingProfile,
    activeTopic,
    handleUnifiedSearch,
    handleVoiceQuery,
    setActiveTopic
  } = useUnifiedDashboard();

  // Monitor for new topics being created
  useEffect(() => {
    if (activeTopic && viewState === 'dashboard') {
      setSelectedTopic(activeTopic);
      setViewState('topic-overview');
    }
  }, [activeTopic, viewState]);

  const handleSearch = async (query: string) => {
    await handleUnifiedSearch(query);
  };

  const handleImageUpload = async (file: File) => {
    // Create a descriptive query from the image filename for now
    const query = `Tell me about this image: ${file.name.split('.')[0]}`;
    await handleUnifiedSearch(query);
  };

  const handleStartLearning = () => {
    setViewState('learning');
  };

  const handleFinishTopic = () => {
    setViewState('explore-more');
  };

  const handleExploreComplete = () => {
    setViewState('completed');
  };

  const handleGoHome = () => {
    setViewState('dashboard');
    setSelectedTopic(null);
    setActiveTopic(null);
  };

  const handleGoBackToSearch = () => {
    setViewState('dashboard');
    setSelectedTopic(null);
  };

  const handleTryAnother = () => {
    setViewState('dashboard');
    setSelectedTopic(null);
    setActiveTopic(null);
  };

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔮</div>
          <div className="text-white text-xl">Getting ready...</div>
        </div>
      </div>
    );
  }

  // Completion celebration screen
  if (viewState === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-purple flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
        >
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm p-8 text-center max-w-md">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl mb-6"
            >
              🏆
            </motion.div>
            
            <h1 className="text-3xl font-bold text-white mb-4">
              Amazing Work!
            </h1>
            
            <p className="text-white/80 text-lg mb-6">
              {childProfile?.age <= 8
                ? "You learned so much! You're super smart! 🌟"
                : "You've completed another learning adventure! Keep up the great work!"
              }
            </p>

            <div className="flex items-center justify-center gap-2 mb-6 bg-white/10 px-4 py-2 rounded-full">
              <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
              <span className="text-white font-bold">+10 Sparks earned!</span>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleTryAnother}
                className="w-full bg-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/80 text-white font-bold"
              >
                {childProfile?.age <= 8 ? "Another Adventure!" : "Learn Something New!"}
              </Button>
              
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {viewState === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <KidsFriendlyDashboard
              childProfile={childProfile}
              onSearch={handleSearch}
              onImageUpload={handleImageUpload}
              isGenerating={false}
              streakDays={childProfile?.streak_days || 0}
              sparksBalance={childProfile?.sparks_balance || 0}
            />
          </motion.div>
        )}

        {viewState === 'topic-overview' && selectedTopic && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <QuickTopicOverview
              topic={selectedTopic}
              childAge={childProfile?.age || 10}
              onStart={handleStartLearning}
              onGoBack={handleGoBackToSearch}
            />
          </motion.div>
        )}

        {viewState === 'learning' && selectedTopic && (
          <motion.div
            key="learning"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <SimpleEncyclopedia
              topic={selectedTopic}
              childAge={childProfile?.age || 10}
              onFinish={handleFinishTopic}
              onGoHome={handleGoHome}
            />
          </motion.div>
        )}

        {viewState === 'explore-more' && selectedTopic && (
          <motion.div
            key="explore-more"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <RelatedTopics
              currentTopic={selectedTopic}
              childAge={childProfile?.age || 10}
              childProfile={childProfile}
              onNewTopicSelected={handleExploreComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StreamlinedWonderWhiz;