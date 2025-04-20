
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface DashboardHeaderProps {
  childName: string;
  streakDays?: number;
  childAge?: number;
  profileId?: string;
  lastActiveDate?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  childName,
  streakDays = 0,
  childAge = 10,
  profileId,
  lastActiveDate
}) => {
  // Format the last active date
  const formatLastActive = () => {
    if (!lastActiveDate) return "Today";
    
    const date = new Date(lastActiveDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-wonderwhiz-deep-purple via-wonderwhiz-purple to-wonderwhiz-light-purple border-b border-wonderwhiz-light-purple/30 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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
          
          <div className="flex flex-wrap items-center gap-2">
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
            
            <motion.div 
              className="flex items-center bg-white/10 px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              <Calendar className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
              <span className="text-white font-nunito">Last active: {formatLastActive()}</span>
            </motion.div>
            
            {profileId && (
              <Link to={`/profile/${profileId}`}>
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white rounded-full">
                  <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
                  <span>Your Journey</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
