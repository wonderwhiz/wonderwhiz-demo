
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface DashboardHeaderProps {
  childName: string;
  streakDays: number;
  childAge: number;
  profileId: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  childName,
  streakDays,
  childAge,
  profileId
}) => {
  return (
    <div className="px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-10 h-10 rounded-xl bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="h-5 w-5 text-white" />
          </motion.div>
          
          <div>
            <motion.h1 
              className="text-lg font-bold text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              WonderWhiz
            </motion.h1>
          </div>
        </div>

        {streakDays > 0 && (
          <motion.div 
            className="flex items-center gap-2 bg-wonderwhiz-bright-pink/20 px-3 py-1.5 rounded-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Star className="h-4 w-4 text-wonderwhiz-bright-pink" />
            <span className="text-wonderwhiz-bright-pink text-sm font-medium">
              {streakDays} day streak!
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
