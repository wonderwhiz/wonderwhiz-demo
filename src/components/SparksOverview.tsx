import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronDown, ChevronUp, Award, Flame, Zap, Brain, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SparksBalance from './SparksBalance';
import SparksHistory from './SparksHistory';
import SparksMilestones from './SparksMilestones';
import StreakDisplay from './StreakDisplay';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
  const {
    streakDays
  } = useSparksSystem(childId);
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

  // Get engaging achievements based on sparks balance
  const getAchievementStatus = () => {
    const achievements = [{
      name: "Curious Explorer",
      threshold: 10,
      icon: <Star className="h-4 w-4 text-wonderwhiz-gold" />
    }, {
      name: "Knowledge Seeker",
      threshold: 50,
      icon: <Brain className="h-4 w-4 text-wonderwhiz-bright-pink" />
    }, {
      name: "Wonder Master",
      threshold: 100,
      icon: <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />
    }, {
      name: "Learning Champion",
      threshold: 250,
      icon: <Award className="h-4 w-4 text-wonderwhiz-cyan" />
    }];
    return achievements.map(achievement => ({
      ...achievement,
      achieved: sparksBalance >= achievement.threshold,
      progress: Math.min(100, sparksBalance / achievement.threshold * 100)
    }));
  };
  const achievements = getAchievementStatus();
  const nextUnachieved = achievements.find(a => !a.achieved);
  return <Card className={`bg-white/5 backdrop-blur-sm border-white/10 shadow-glow-sm ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
          Your Wonder Journey
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-5">
          
          
          <Badge variant="outline" className="bg-wonderwhiz-gold/20 border-wonderwhiz-gold/30 text-wonderwhiz-gold flex items-center gap-1">
            <Flame className="h-3.5 w-3.5" />
            {streakDays} day streak
          </Badge>
        </div>
        
        {/* Primary achievement display */}
        {nextUnachieved && <motion.div initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="bg-white/10 rounded-lg p-4 mb-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                {nextUnachieved.icon}
                <span className="ml-2 text-white font-medium">{nextUnachieved.name}</span>
              </div>
              <span className="text-white/60 text-sm">{Math.round(nextUnachieved.progress)}%</span>
            </div>
            
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-gold rounded-full" initial={{
            width: 0
          }} animate={{
            width: `${nextUnachieved.progress}%`
          }} transition={{
            duration: 1,
            delay: 0.5
          }} />
            </div>
            
            <motion.div className="absolute -right-4 -top-4 opacity-10" initial={{
          scale: 0.8,
          rotate: -10
        }} animate={{
          scale: [0.8, 0.9, 0.8],
          rotate: [-10, 0, -10]
        }} transition={{
          duration: 5,
          repeat: Infinity
        }}>
              <Award className="h-24 w-24 text-wonderwhiz-gold" />
            </motion.div>
          </motion.div>}
        
        {/* Simplified activity sections */}
        <div className="space-y-3">
          <button onClick={() => toggleSection('streak')} className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors group">
            <span className="text-white font-medium flex items-center">
              <Flame className="h-4 w-4 mr-2 text-wonderwhiz-gold group-hover:scale-110 transition-transform" />
              Learning Streak
            </span>
            {activeSection === 'streak' ? <ChevronUp className="h-5 w-5 text-white/60" /> : <ChevronDown className="h-5 w-5 text-white/60" />}
          </button>
          
          <AnimatePresence>
            {activeSection === 'streak' && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="overflow-hidden">
                <StreakDisplay streakDays={streakDays} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>}
          </AnimatePresence>
          
          <button onClick={() => toggleSection('milestones')} className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors group">
            <span className="text-white font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow group-hover:scale-110 transition-transform" />
              Achievements
            </span>
            {activeSection === 'milestones' ? <ChevronUp className="h-5 w-5 text-white/60" /> : <ChevronDown className="h-5 w-5 text-white/60" />}
          </button>
          
          <AnimatePresence>
            {activeSection === 'milestones' && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="overflow-hidden">
                <SparksMilestones sparksBalance={sparksBalance} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>}
          </AnimatePresence>
          
          <button onClick={() => toggleSection('history')} className="w-full flex justify-between items-center p-3 bg-white/10 rounded-lg text-left hover:bg-white/15 transition-colors group">
            <span className="text-white font-medium flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-cyan group-hover:scale-110 transition-transform" />
              Recent Rewards
            </span>
            {activeSection === 'history' ? <ChevronUp className="h-5 w-5 text-white/60" /> : <ChevronDown className="h-5 w-5 text-white/60" />}
          </button>
          
          <AnimatePresence>
            {activeSection === 'history' && <motion.div initial={{
            height: 0,
            opacity: 0
          }} animate={{
            height: 'auto',
            opacity: 1
          }} exit={{
            height: 0,
            opacity: 0
          }} className="overflow-hidden">
                <SparksHistory childId={childId} limit={5} className="p-3 bg-white/5 rounded-lg" />
              </motion.div>}
          </AnimatePresence>
        </div>
        
        {/* Call to action */}
        <motion.div className="mt-4 pt-4 border-t border-white/10 text-center" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.8
      }}>
          <Button variant="ghost" className="text-white/60 hover:text-white text-sm">
            <Star className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-gold" />
            View All Achievements
          </Button>
        </motion.div>
      </CardContent>
    </Card>;
};
export default SparksOverview;