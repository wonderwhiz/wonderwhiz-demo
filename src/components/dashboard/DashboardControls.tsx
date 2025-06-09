
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import MagicalSearchBar from './MagicalSearchBar';
import SparksBalance from '@/components/SparksBalance';

interface DashboardControlsProps {
  childName: string;
  childId: string;
  sparksBalance: number;
  streakDays: number;
  onSearch: (query: string) => void;
  isGenerating: boolean;
  onImageCapture?: (file: File) => void;
  childProfile?: any;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  childName,
  childId,
  sparksBalance,
  streakDays,
  onSearch,
  isGenerating,
  onImageCapture,
  childProfile
}) => {
  return (
    <div className="px-4 py-6 bg-gradient-to-r from-wonderwhiz-deep-purple/90 via-wonderwhiz-purple/90 to-wonderwhiz-light-purple/90 backdrop-blur-md border-b border-wonderwhiz-light-purple/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-0"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-white font-nunito">
              Welcome back, {childName}!
            </h1>
            <div className="flex items-center space-x-4 mt-1">
              <SparksBalance childId={childId} initialBalance={sparksBalance} size="md" />
              {streakDays > 0 && (
                <div className="flex items-center text-white/80 text-sm">
                  <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1" />
                  <span>{streakDays} day{streakDays !== 1 ? 's' : ''} streak!</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <MagicalSearchBar
            onSearch={onSearch}
            childProfile={childProfile}
            isLoading={isGenerating}
            placeholder="What do you want to learn about today?"
            onImageCapture={onImageCapture}
            size="lg"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardControls;
