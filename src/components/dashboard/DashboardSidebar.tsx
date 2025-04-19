
import React from 'react';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/ui/animated-background';

interface DashboardSidebarProps {
  childId: string;
  sparksBalance: number;
  pastCurios: any[];
  onCurioSelect: () => void;
}

const DashboardSidebar = ({ childId, sparksBalance, pastCurios, onCurioSelect }: DashboardSidebarProps) => {
  return (
    <motion.aside 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-72 h-screen overflow-y-auto border-r border-white/10 relative"
    >
      <AnimatedBackground />
      <div className="relative z-10 p-4">
        <div className="mb-6">
          <h2 className="text-lg font-nunito font-bold text-white">Dashboard</h2>
          <p className="text-sm text-white/70 font-inter">Explore your learning journey</p>
        </div>
        
        {/* Sparks balance */}
        <div className="mb-6 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70 font-inter">Sparks Balance</span>
            <motion.span 
              className="text-lg font-bold text-wonderwhiz-vibrant-yellow font-nunito"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
            >
              ✨ {sparksBalance}
            </motion.span>
          </div>
        </div>
        
        {/* Past curios section */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/70 mb-2 font-inter">Recent Explorations</h3>
          {pastCurios.length === 0 ? (
            <div className="text-center p-4 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
              <p className="text-sm text-white/50 font-inter">Start exploring to see your journey here!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Render past curios here */}
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  );
};

export default DashboardSidebar;
