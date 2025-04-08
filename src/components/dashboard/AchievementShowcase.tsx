
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Trophy, Star, BookOpen, Rocket, Brain, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  date?: string;
  progress?: {
    current: number;
    target: number;
  };
}

interface AchievementShowcaseProps {
  achievements: Achievement[];
  onViewAll?: () => void;
}

const AchievementShowcase: React.FC<AchievementShowcaseProps> = ({
  achievements = [],
  onViewAll
}) => {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  // Filter to show unlocked achievements first, then in-progress ones
  const sortedAchievements = [...achievements].sort((a, b) => {
    if (a.unlocked && !b.unlocked) return -1;
    if (!a.unlocked && b.unlocked) return 1;
    return 0;
  });
  
  // Take only the first 4 for display
  const displayAchievements = sortedAchievements.slice(0, 4);

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Trophy className="h-5 w-5 text-wonderwhiz-gold mr-2" />
          <h3 className="text-white font-medium">Your Achievements</h3>
        </div>
        
        {achievements.length > 4 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="text-white/70 hover:text-white"
          >
            View All
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {displayAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            className={`bg-white/10 rounded-lg p-3 border ${achievement.unlocked ? 'border-wonderwhiz-gold/50' : 'border-white/10'} cursor-pointer relative group`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedAchievement(achievement)}
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-2 rounded-full mb-2 ${achievement.unlocked ? 'bg-wonderwhiz-gold/20' : 'bg-white/10'}`}>
                {achievement.icon}
              </div>
              
              <h4 className={`text-sm font-medium ${achievement.unlocked ? 'text-wonderwhiz-gold' : 'text-white/70'}`}>
                {achievement.name}
              </h4>
              
              {achievement.progress && !achievement.unlocked && (
                <div className="mt-2 w-full">
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden w-full">
                    <motion.div 
                      className="h-full bg-white/30"
                      style={{ width: `${(achievement.progress.current / achievement.progress.target) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1">
                    {achievement.progress.current}/{achievement.progress.target}
                  </p>
                </div>
              )}
              
              {achievement.unlocked && (
                <div className="absolute -top-1 -right-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Star className="h-4 w-4 text-wonderwhiz-gold" />
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              className="bg-wonderwhiz-purple p-6 rounded-xl max-w-sm relative border border-white/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-3 right-3 text-white/60 hover:text-white"
                onClick={() => setSelectedAchievement(null)}
              >
                ✕
              </button>
              
              <div className="flex flex-col items-center text-center">
                <motion.div 
                  className={`p-4 rounded-full mb-4 ${selectedAchievement.unlocked ? 'bg-wonderwhiz-gold/20' : 'bg-white/10'}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                  {selectedAchievement.icon}
                </motion.div>
                
                <h3 className={`text-xl font-bold mb-2 ${selectedAchievement.unlocked ? 'text-wonderwhiz-gold' : 'text-white'}`}>
                  {selectedAchievement.name}
                </h3>
                
                <p className="text-white/70 mb-4">
                  {selectedAchievement.description}
                </p>
                
                {selectedAchievement.unlocked && selectedAchievement.date && (
                  <div className="bg-white/10 px-4 py-2 rounded-full">
                    <p className="text-sm text-white/90">Unlocked on {selectedAchievement.date}</p>
                  </div>
                )}
                
                {!selectedAchievement.unlocked && selectedAchievement.progress && (
                  <div className="w-full mb-4">
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden w-full mb-2">
                      <motion.div 
                        className="h-full bg-wonderwhiz-bright-pink"
                        initial={{ width: 0 }}
                        animate={{ width: `${(selectedAchievement.progress.current / selectedAchievement.progress.target) * 100}%` }}
                        transition={{ duration: 0.8, type: "spring" }}
                      />
                    </div>
                    <p className="text-sm text-white/70">
                      {selectedAchievement.progress.current}/{selectedAchievement.progress.target} completed
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AchievementShowcase;
