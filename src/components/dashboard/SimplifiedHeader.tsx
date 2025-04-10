
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SimplifiedHeaderProps {
  childName: string;
  sparksBalance?: number;
  streakDays?: number;
}

const SimplifiedHeader: React.FC<SimplifiedHeaderProps> = ({
  childName,
  sparksBalance = 0,
  streakDays = 0
}) => {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-between px-4 py-3 backdrop-blur-sm border-b border-white/10"
    >
      <div className="flex items-center">
        <BookOpen className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
        <h1 className="text-lg font-medium text-white">{childName}'s Wonder Space</h1>
      </div>
      
      <div className="flex items-center space-x-3">
        {streakDays > 0 && (
          <div className="flex items-center bg-white/5 px-2 py-1 rounded-full">
            <Badge className="bg-transparent border-none p-0 text-white flex items-center gap-1">
              <div className="w-4 h-4 flex items-center justify-center rounded-full bg-wonderwhiz-vibrant-yellow/20">
                <div className="w-1.5 h-1.5 rounded-full bg-wonderwhiz-vibrant-yellow"></div>
              </div>
              <span className="text-xs">{streakDays}d</span>
            </Badge>
          </div>
        )}
        
        <div className="flex items-center space-x-1 bg-white/5 px-2 py-1 rounded-full">
          <Sparkles className="h-3.5 w-3.5 text-wonderwhiz-vibrant-yellow" />
          <span className="text-white text-xs">{sparksBalance}</span>
        </div>
      </div>
    </motion.header>
  );
};

export default SimplifiedHeader;
