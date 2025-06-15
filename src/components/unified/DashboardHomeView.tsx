
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import PersonalizedWelcome from './PersonalizedWelcome';
import StreamlinedSearchExperience from './StreamlinedSearchExperience';
import CelebrationSystem from './CelebrationSystem';

interface DashboardHomeViewProps {
  childProfile: any;
  streakDays: number;
  explorationsCount: number;
  handleUnifiedSearch: (query: string) => void;
  isCreatingContent: boolean;
  searchQuery: string;
}

const DashboardHomeView: React.FC<DashboardHomeViewProps> = ({
  childProfile,
  streakDays,
  explorationsCount,
  handleUnifiedSearch,
  isCreatingContent,
  searchQuery,
}) => {
  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="max-w-4xl mx-auto"
    >
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

      <AnimatePresence>
        {(streakDays > 0 || explorationsCount > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <CelebrationSystem
              childId={childProfile.id!}
              streakDays={streakDays}
              sparksBalance={childProfile?.sparks_balance || 0}
              explorationsCount={explorationsCount}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardHomeView;

