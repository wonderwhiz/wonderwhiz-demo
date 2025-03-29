
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SparksBalance from './SparksBalance';
import SparksHistory from './SparksHistory';
import SparksMilestones from './SparksMilestones';
import StreakDisplay from './StreakDisplay';
import { useSparksSystem } from '@/hooks/useSparksSystem';

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

  return (
    <Card className={`bg-white/5 border-white/10 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <Sparkles className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
          Your Sparks
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <SparksBalance 
            childId={childId} 
            initialBalance={sparksBalance} 
            size="lg"
          />
          
          <StreakDisplay 
            streakDays={streakDays} 
            showBadgesOnly={true} 
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <button 
            onClick={() => toggleSection('history')} 
            className="flex justify-between items-center p-3 bg-white/10 rounded-lg text-left"
          >
            <span className="text-white font-medium">Sparks History</span>
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
                <SparksHistory childId={childId} limit={5} className="mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => toggleSection('milestones')} 
            className="flex justify-between items-center p-3 bg-white/10 rounded-lg text-left"
          >
            <span className="text-white font-medium">Sparks Milestones</span>
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
                <SparksMilestones sparksBalance={sparksBalance} className="mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <button 
            onClick={() => toggleSection('streak')} 
            className="flex justify-between items-center p-3 bg-white/10 rounded-lg text-left"
          >
            <span className="text-white font-medium">Daily Streak</span>
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
                <StreakDisplay streakDays={streakDays} className="mt-2" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

export default SparksOverview;
