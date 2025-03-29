
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Award, Sparkles, Star, Gift, Crown, Medal } from 'lucide-react';

interface SparksMilestonesProps {
  sparksBalance: number;
  className?: string;
}

// Define milestone levels
const MILESTONES = [
  { level: 10, icon: <Star className="h-5 w-5" />, title: 'Spark Starter', description: 'You earned your first 10 sparks!' },
  { level: 50, icon: <Medal className="h-5 w-5" />, title: 'Curious Explorer', description: 'You reached 50 sparks!' },
  { level: 100, icon: <Award className="h-5 w-5" />, title: 'Knowledge Seeker', description: 'You reached 100 sparks!' },
  { level: 250, icon: <Gift className="h-5 w-5" />, title: 'Wonder Wizard', description: 'You reached 250 sparks!' },
  { level: 500, icon: <Crown className="h-5 w-5" />, title: 'Curiosity Champion', description: 'You reached 500 sparks!' },
  { level: 1000, icon: <Trophy className="h-5 w-5" />, title: 'Wisdom Master', description: 'You reached 1000 sparks!' },
];

const SparksMilestones: React.FC<SparksMilestonesProps> = ({ sparksBalance, className = '' }) => {
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);
  
  // Find next milestone
  const nextMilestone = MILESTONES.find(milestone => milestone.level > sparksBalance) || MILESTONES[MILESTONES.length - 1];
  const nextMilestoneProgress = nextMilestone ? Math.min(100, (sparksBalance / nextMilestone.level) * 100) : 100;
  
  const toggleMilestone = (level: number) => {
    setExpandedMilestone(expandedMilestone === level ? null : level);
  };
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Next milestone progress */}
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
            <span className="text-white font-medium">Next Milestone</span>
          </div>
          <span className="text-white/70 text-sm">{sparksBalance} / {nextMilestone.level}</span>
        </div>
        
        <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
          <motion.div 
            className="h-full bg-gradient-to-r from-wonderwhiz-gold to-wonderwhiz-pink"
            initial={{ width: 0 }}
            animate={{ width: `${nextMilestoneProgress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex items-center">
          <motion.div
            className="p-2 bg-white/10 rounded-full text-wonderwhiz-gold mr-3"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {nextMilestone.icon}
          </motion.div>
          <div>
            <p className="text-white font-medium">{nextMilestone.title}</p>
            <p className="text-white/70 text-sm">{nextMilestone.description}</p>
          </div>
        </div>
      </div>
      
      {/* All milestones */}
      <div className="space-y-2">
        {MILESTONES.map((milestone, index) => {
          const isAchieved = sparksBalance >= milestone.level;
          const isExpanded = expandedMilestone === milestone.level;
          
          return (
            <motion.div
              key={milestone.level}
              className={`rounded-lg overflow-hidden cursor-pointer ${
                isAchieved 
                  ? 'bg-gradient-to-r from-wonderwhiz-purple/30 to-wonderwhiz-gold/10'
                  : 'bg-white/5'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggleMilestone(milestone.level)}
            >
              <div className="flex items-center p-3">
                <motion.div 
                  className={`p-1.5 rounded-full mr-3 flex-shrink-0 ${
                    isAchieved 
                      ? 'bg-gradient-to-r from-wonderwhiz-gold/80 to-amber-500/80 text-white'
                      : 'bg-white/10 text-white/50'
                  }`}
                  whileHover={{ scale: 1.1, rotate: isAchieved ? 10 : 0 }}
                  animate={isAchieved && !isExpanded ? { 
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, 0]
                  } : {}}
                  transition={{ 
                    duration: 3, 
                    repeat: isAchieved && !isExpanded ? Infinity : 0,
                    repeatDelay: 5
                  }}
                >
                  {milestone.icon}
                </motion.div>
                <div className="flex-1">
                  <p className={`font-medium ${
                    isAchieved ? 'text-white' : 'text-white/60'
                  }`}>
                    {milestone.title}
                  </p>
                  <div className="flex items-center">
                    <Sparkles className={`h-3 w-3 mr-1 ${
                      isAchieved ? 'text-wonderwhiz-gold' : 'text-white/40'
                    }`} />
                    <span className={`text-sm ${
                      isAchieved ? 'text-wonderwhiz-gold' : 'text-white/40'
                    }`}>
                      {milestone.level} sparks
                    </span>
                  </div>
                </div>
                {isAchieved && (
                  <motion.div 
                    className="bg-wonderwhiz-gold/20 p-1 rounded-full text-wonderwhiz-gold"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 10 }}
                  >
                    <Trophy className="h-4 w-4" />
                  </motion.div>
                )}
              </div>
              
              {/* Expanded content */}
              {isExpanded && (
                <motion.div 
                  className="px-3 pb-3 pt-1 border-t border-white/10"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <p className="text-white/70 text-sm">{milestone.description}</p>
                  {isAchieved ? (
                    <p className="text-wonderwhiz-gold text-sm mt-2">
                      🎉 Achievement unlocked!
                    </p>
                  ) : (
                    <div className="mt-2">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-white/30"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (sparksBalance / milestone.level) * 100)}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                      <p className="text-white/60 text-xs mt-1">
                        {sparksBalance} / {milestone.level} sparks
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SparksMilestones;
