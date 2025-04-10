
import React from 'react';
import { motion } from 'framer-motion';
import SparksOverview from '@/components/SparksOverview';
import ChildDashboardTasks from '@/components/ChildDashboardTasks';

interface DiscoverySectionProps {
  childId: string;
  sparksBalance: number;
  onSparkEarned: (amount: number) => void;
}

const DiscoverySection: React.FC<DiscoverySectionProps> = ({ childId, sparksBalance, onSparkEarned }) => {
  return (
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-white/10">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">Discover More</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <motion.div 
            id="sparks-overview" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <SparksOverview childId={childId} sparksBalance={sparksBalance} />
          </motion.div>
          
          <motion.div 
            id="tasks-section" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <ChildDashboardTasks childId={childId} onSparkEarned={onSparkEarned} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverySection;
