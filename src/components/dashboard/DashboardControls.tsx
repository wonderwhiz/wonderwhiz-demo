
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MagicalSearchBar from './MagicalSearchBar';
import SparksBalance from '@/components/SparksBalance';

interface DashboardControlsProps {
  childName: string;
  childId: string;
  sparksBalance: number;
  streakDays: number;
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  childName,
  childId,
  sparksBalance,
  streakDays,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating
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
              <SparksBalance 
                childId={childId}
                initialBalance={sparksBalance}
                size="md"
              />
              {streakDays > 0 && (
                <div className="flex items-center text-white/80 text-sm">
                  <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1" />
                  <span>{streakDays} day{streakDays !== 1 ? 's' : ''} streak!</span>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex space-x-2"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 border border-white/10"
              onClick={() => {
                const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
                if (inputElement) inputElement.focus();
              }}
            >
              <Search className="h-4 w-4 mr-2" />
              Ask a question
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="bg-wonderwhiz-bright-pink/20 text-white hover:bg-wonderwhiz-bright-pink/30 border border-wonderwhiz-bright-pink/30"
              onClick={() => window.location.href = `/profile/${childId}`}
            >
              <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-bright-pink" />
              Your Journey
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full"
        >
          <MagicalSearchBar
            query={query}
            setQuery={setQuery}
            handleSubmitQuery={handleSubmitQuery}
            isGenerating={isGenerating}
            placeholder="What do you want to learn about today?"
          />
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardControls;
