
import React from 'react';
import { Sparkles, Star, Medal, Trophy, Award, Gift, CheckCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface SparksMilestoneProps {
  sparksBalance: number;
  className?: string;
}

interface Milestone {
  sparks: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SparksMilestones: React.FC<SparksMilestoneProps> = ({ 
  sparksBalance,
  className = ''
}) => {
  const milestones: Milestone[] = [
    {
      sparks: 50,
      title: 'Spark Collector',
      description: 'You\'ve started your sparks collection!',
      icon: <Sparkles className="h-6 w-6 text-wonderwhiz-gold" />
    },
    {
      sparks: 100,
      title: 'Rising Star',
      description: 'You\'re on your way to becoming a star!',
      icon: <Star className="h-6 w-6 text-wonderwhiz-gold" />
    },
    {
      sparks: 250,
      title: 'Bronze Medal',
      description: 'You\'ve earned the bronze medal for your efforts!',
      icon: <Medal className="h-6 w-6 text-wonderwhiz-gold" />
    },
    {
      sparks: 500,
      title: 'Silver Medal',
      description: 'You\'ve achieved the silver medal rank!',
      icon: <Award className="h-6 w-6 text-wonderwhiz-gold" />
    },
    {
      sparks: 1000,
      title: 'Gold Trophy',
      description: 'You\'ve reached the gold level! Amazing work!',
      icon: <Trophy className="h-6 w-6 text-wonderwhiz-gold" />
    },
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-xl font-bold text-white flex items-center">
        <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
        Sparks Milestones
      </h2>
      
      <div className="grid gap-3">
        {milestones.map((milestone, index) => {
          const isAchieved = sparksBalance >= milestone.sparks;
          const nextMilestone = !isAchieved && index > 0 && 
            sparksBalance >= milestones[index-1].sparks;
          
          return (
            <motion.div
              key={milestone.title}
              className={`relative p-4 rounded-lg border ${
                isAchieved 
                  ? 'bg-wonderwhiz-purple/20 border-wonderwhiz-purple/40' 
                  : nextMilestone
                  ? 'bg-white/10 border-white/20 border-dashed' 
                  : 'bg-white/5 border-white/10'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center mr-4 ${
                  isAchieved ? 'bg-wonderwhiz-purple/30' : 'bg-white/10'
                }`}>
                  {isAchieved ? milestone.icon : <Lock className="h-5 w-5 text-white/50" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className={`font-semibold ${isAchieved ? 'text-white' : 'text-white/70'}`}>
                      {milestone.title}
                    </h3>
                    {isAchieved && (
                      <CheckCircle className="ml-2 h-4 w-4 text-green-400" />
                    )}
                  </div>
                  <p className={isAchieved ? 'text-white/80' : 'text-white/50'}>
                    {milestone.description}
                  </p>
                </div>
                
                <div className={`text-lg font-mono ${
                  isAchieved ? 'text-wonderwhiz-gold' : 'text-white/50'
                }`}>
                  {milestone.sparks}
                </div>
              </div>
              
              {nextMilestone && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">
                      Progress to next milestone
                    </span>
                    <span className="text-sm font-semibold text-wonderwhiz-gold">
                      {sparksBalance} / {milestone.sparks}
                    </span>
                  </div>
                  <div className="mt-1 h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-gold"
                      initial={{ width: 0 }}
                      animate={{ 
                        width: `${Math.min(100, (sparksBalance / milestone.sparks) * 100)}%` 
                      }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SparksMilestones;
