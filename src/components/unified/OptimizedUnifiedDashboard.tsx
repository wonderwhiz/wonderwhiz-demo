
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUnifiedDashboard } from '@/hooks/useUnifiedDashboard';
import MagicalBackground from './MagicalBackground';
import DashboardLoadingState from './DashboardLoadingState';
import MagicalBreadcrumbs from '@/components/navigation/MagicalBreadcrumbs';
import EncyclopediaView from '@/components/wonderwhiz/EncyclopediaView';
import DashboardHomeView from './DashboardHomeView';
import FloatingKidsMenu from '@/components/navigation/FloatingKidsMenu';
import VoiceAssistant from './VoiceAssistant';

const OptimizedUnifiedDashboard: React.FC = () => {
  const {
    childId,
    childProfile,
    isLoadingProfile,
    streakDays,
    explorationsCount,
    isCreatingContent,
    searchQuery,
    activeTopic,
    handleUnifiedSearch,
    handleVoiceQuery,
    setActiveTopic,
  } = useUnifiedDashboard();

  if (isLoadingProfile || !childProfile) {
    return <DashboardLoadingState isLoading={isLoadingProfile} childProfile={childProfile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink relative overflow-hidden">
      <MagicalBackground />

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
            <DashboardHomeView
              childProfile={childProfile}
              streakDays={streakDays}
              explorationsCount={explorationsCount}
              handleUnifiedSearch={handleUnifiedSearch}
              isCreatingContent={isCreatingContent}
              searchQuery={searchQuery}
            />
          )}
        </AnimatePresence>
      </div>

      <FloatingKidsMenu childId={childId!} />

      <VoiceAssistant
        onVoiceQuery={handleVoiceQuery}
        childAge={childProfile?.age || 10}
      />
    </div>
  );
};

export default OptimizedUnifiedDashboard;

