
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import PersonalizedWelcome from './PersonalizedWelcome';
import StreamlinedSearchExperience from './StreamlinedSearchExperience';

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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto relative"
    >
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-20 blur-sm"
        />
        <motion.div
          animate={{ 
            rotate: -360,
            y: [0, -20, 0]
          }}
          transition={{ 
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-32 left-16 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full opacity-25 blur-sm"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-32 w-20 h-20 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 blur-md"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
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
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
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
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <Card className="bg-gradient-to-r from-wonderwhiz-bright-pink/30 via-purple-500/25 to-wonderwhiz-vibrant-yellow/20 backdrop-blur-lg border-2 border-wonderwhiz-bright-pink/40 p-8 shadow-2xl overflow-hidden relative">
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12"
                />
              </div>
              
              <motion.div 
                className="flex items-center gap-6 relative z-10"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="relative">
                  <motion.div 
                    className="w-16 h-16 bg-gradient-to-r from-wonderwhiz-bright-pink via-purple-500 to-wonderwhiz-vibrant-yellow rounded-full flex items-center justify-center shadow-xl"
                    animate={{ 
                      rotate: 360,
                      boxShadow: [
                        "0 0 20px rgba(192, 0, 106, 0.3)",
                        "0 0 40px rgba(192, 0, 106, 0.6)",
                        "0 0 20px rgba(192, 0, 106, 0.3)"
                      ]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                      className="text-white text-2xl"
                    >
                      ✨
                    </motion.div>
                  </motion.div>
                  
                  {/* Orbiting sparkles */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0"
                  >
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs">⭐</div>
                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 text-pink-300 text-xs">💫</div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-blue-300 text-xs">✨</div>
                  </motion.div>
                </div>
                
                <div className="flex-1">
                  <motion.h3 
                    className="text-2xl font-bold text-white mb-2 drop-shadow-lg"
                    animate={{ textShadow: ["0 0 10px rgba(255,255,255,0.5)", "0 0 20px rgba(255,255,255,0.8)", "0 0 10px rgba(255,255,255,0.5)"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    🎨 Creating your magical encyclopedia...
                  </motion.h3>
                  {searchQuery && (
                    <motion.p 
                      className="text-white/95 text-lg font-semibold mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      🔍 Working on: <span className="text-wonderwhiz-vibrant-yellow font-bold">"{searchQuery}"</span>
                    </motion.p>
                  )}
                  <motion.p 
                    className="text-white/80 text-sm font-medium"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    Get ready for an amazing learning adventure! 🚀✨
                  </motion.p>
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-white/30 rounded-full"
                      style={{
                        left: `${20 + i * 15}%`,
                        top: `${30 + (i % 2) * 40}%`,
                      }}
                      animate={{
                        y: [-10, 10, -10],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 2 + i * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DashboardHomeView;
