import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Settings, Eye } from 'lucide-react';

interface SimplifiedDashboardHeaderProps {
  childProfile: any;
  onSettingsClick: () => void;
  onAccessibilityClick: () => void;
}

const SimplifiedDashboardHeader: React.FC<SimplifiedDashboardHeaderProps> = ({
  childProfile,
  onSettingsClick,
  onAccessibilityClick
}) => {
  const isYoungChild = (childProfile?.age || 10) <= 8;
  
  return (
    <motion.div
      className="bg-[#1A0B2E] border-b-2 border-wonderwhiz-purple/40 p-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {isYoungChild ? `Hi ${childProfile?.name || 'Explorer'}! 🚀` : `Welcome back, ${childProfile?.name || 'Explorer'}`}
          </h1>
          <p className="text-white/80 text-sm mt-1">
            {isYoungChild ? 'Ready for an adventure?' : 'What would you like to explore today?'}
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onAccessibilityClick}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SimplifiedDashboardHeader;