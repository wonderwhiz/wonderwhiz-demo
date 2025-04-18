
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Trophy, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SparksOverview from '@/components/SparksOverview';

interface SparksPanelProps {
  childId: string;
  sparksBalance: number;
  streakDays: number;
  onClose?: () => void;
}

const SparksPanel: React.FC<SparksPanelProps> = ({ 
  childId, 
  sparksBalance, 
  streakDays, 
  onClose 
}) => {
  return (
    <div className="px-4 py-3">
      {/* Panel header with back button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-white/70 hover:text-white"
              onClick={onClose}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h2 className="text-xl font-bold text-white flex items-center">
            <Star className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
            Sparks & Achievements
          </h2>
        </div>
      </div>
      
      {/* Sparks dashboard content */}
      <div className="space-y-4">
        {/* Streak Banner */}
        <motion.div 
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg p-4 border border-amber-500/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Flame className="h-6 w-6 text-amber-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-bold text-white">{streakDays} Day Streak!</h3>
                <p className="text-white/70 text-sm">Keep learning every day</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-400">
              {streakDays >= 7 ? '🔥' : '✨'}
            </div>
          </div>
        </motion.div>
        
        {/* Hero stats */}
        <motion.div 
          className="bg-white/5 backdrop-blur-md rounded-lg p-4 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-white/70 mb-1">Total Sparks</h3>
              <p className="text-3xl font-bold text-wonderwhiz-gold flex items-center">
                {sparksBalance}
                <Star className="ml-2 h-5 w-5" />
              </p>
            </div>
            <div>
              <h3 className="text-sm text-white/70 mb-1">Level</h3>
              <p className="text-3xl font-bold text-wonderwhiz-cyan flex items-center">
                {Math.floor(sparksBalance / 50) + 1}
                <Trophy className="ml-2 h-5 w-5" />
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Full Sparks Overview */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mt-4"
        >
          <SparksOverview 
            childId={childId} 
            sparksBalance={sparksBalance} 
            className="border-none"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default SparksPanel;
