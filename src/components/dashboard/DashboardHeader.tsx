
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';

interface DashboardHeaderProps {
  childName: string;
  streakDays?: number;
  childAge?: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  childName,
  streakDays = 0,
  childAge = 10
}) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-light-purple border-b border-wonderwhiz-light-purple/30 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-nunito">
              Welcome back, {childName}!
            </h1>
            <p className="text-white/70 mt-1 font-inter">
              {childAge < 8 ? "Let's explore something amazing today!" :
               childAge < 12 ? "What would you like to discover?" :
               "Ready to expand your knowledge?"}
            </p>
          </div>
          
          {streakDays > 0 && (
            <motion.div 
              className="flex items-center bg-wonderwhiz-bright-pink/20 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Star className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
              <span className="text-white font-nunito">
                {streakDays} day{streakDays !== 1 ? 's' : ''} streak!
              </span>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
