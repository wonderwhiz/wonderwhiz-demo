
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronDown, ChevronUp, Award, Flame, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SparksBalance from './SparksBalance';
import SparksHistory from './SparksHistory';
import SparksMilestones from './SparksMilestones';
import StreakDisplay from './StreakDisplay';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { Badge } from '@/components/ui/badge';

interface SparksOverviewProps {
  childId: string;
  sparksBalance: number;
  className?: string;
}

const SparksOverview: React.FC<SparksOverviewProps> = ({ 
  childId, 
  sparksBalance, 
  className = '' 
}) => {
  const [activeSection, setActiveSection] = useState<'history' | 'milestones' | 'streak' | null>(null);
  const { streakDays } = useSparksSystem(childId);

  const toggleSection = (section: 'history' | 'milestones' | 'streak') => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const getNextMilestoneLabel = () => {
    if (sparksBalance < 50) return `${50 - sparksBalance} more to Spark Explorer`;
    if (sparksBalance < 100) return `${100 - sparksBalance} more to Spark Adventurer`;
    if (sparksBalance < 250) return `${250 - sparksBalance} more to Spark Master`;
    if (sparksBalance < 500) return `${500 - sparksBalance} more to Spark Champion`;
    return "Spark Champion achieved!";
  };

  const nextMilestone = getNextMilestoneLabel();

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
          Your Wonder Journey
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <SparksBalance 
              childId={childId} 
              initialBalance={sparksBalance} 
              size="lg"
            />
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/50 text-xs"
            >
              {nextMilestone}
            </motion.div>
          </div>
          
          <Badge variant="outline" className="bg-wonderwhiz-gold/20 border-wonderwhiz-gold/30 text-wonderwhiz-gold flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            {streakDays} day streak
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center text-white font-medium">
                <Zap className="h-4 w-4 mr-1.5 text-wonderwhiz-bright-pink" />
                Learning Progress
              </span>
              <span className="text-white/60 text-sm">{Math.min(100, sparksBalance/5)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full">
              <motion.div 
                className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-gold rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, sparksBalance/5)}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>
          </div>
          
          <button 
            onClick={() => toggleSection('streak')} 
            className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors"
          >
            <span className="text-white font-medium flex items-center">
              <Flame className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
              Learning Streak
            </span>
            {activeSection === 'streak' ? 
              <ChevronUp className="h-5 w-5 text-white/60" /> : 
              <ChevronDown className="h-5 w-5 text-white/60" />
            }
          </button>
          
          <AnimatePresence>
            {activeSection === 'streak' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <StreakDisplay streakDays={streakDays} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => toggleSection('milestones')} 
            className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors"
          >
            <span className="text-white font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
              Achievements
            </span>
            {activeSection === 'milestones' ? 
              <ChevronUp className="h-5 w-5 text-white/60" /> : 
              <ChevronDown className="h-5 w-5 text-white/60" />
            }
          </button>
          
          <AnimatePresence>
            {activeSection === 'milestones' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <SparksMilestones sparksBalance={sparksBalance} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => toggleSection('history')} 
            className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors"
          >
            <span className="text-white font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-cyan" />
              Recent Rewards
            </span>
            {activeSection === 'history' ? 
              <ChevronUp className="h-5 w-5 text-white/60" /> : 
              <ChevronDown className="h-5 w-5 text-white/60" />
            }
          </button>
          
          <AnimatePresence>
            {activeSection === 'history' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <SparksHistory childId={childId} limit={5} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default SparksOverview;
