
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
import ParentTasksSection from '@/components/dashboard/ParentTasksSection';
import WonderWhizLogo from '@/components/WonderWhizLogo';

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

  const animationProps = {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -20 },
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-bright-pink relative overflow-hidden">
      <MagicalBackground />

      <div className="relative z-10 p-4 flex justify-between items-center">
        <MagicalBreadcrumbs childId={childId!} />
        <WonderWhizLogo className="h-8 text-white" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 relative z-10">
        <AnimatePresence mode="wait">
          {activeTopic ? (
            <motion.div key="encyclopedia" {...animationProps}>
              <EncyclopediaView
                topic={activeTopic}
                childAge={childProfile?.age || 10}
                childProfile={childProfile}
                onBackToTopics={() => setActiveTopic(null)}
              />
            </motion.div>
          ) : (
            <motion.div key="dashboard-home" {...animationProps}>
              <DashboardHomeView
                childProfile={childProfile}
                streakDays={streakDays}
                explorationsCount={explorationsCount}
                handleUnifiedSearch={handleUnifiedSearch}
                isCreatingContent={isCreatingContent}
                searchQuery={searchQuery}
              />
              <div className="mt-6">
                <ParentTasksSection childId={childId!} />
              </div>
            </motion.div>
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
