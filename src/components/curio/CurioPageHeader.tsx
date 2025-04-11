
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart2, RefreshCw, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioPageHeaderProps {
  curioTitle: string | null;
  handleBackToDashboard: () => void;
  handleToggleInsights: () => void;
  handleRefresh: () => void;
  refreshing: boolean;
  showInsights: boolean;
  profileId?: string;
  childName?: string;
}

const CurioPageHeader: React.FC<CurioPageHeaderProps> = ({
  curioTitle,
  handleBackToDashboard,
  handleToggleInsights,
  handleRefresh,
  refreshing,
  showInsights,
  profileId,
  childName
}) => {
  return (
    <motion.div
      className="sticky top-0 z-50 bg-gradient-to-r from-wonderwhiz-deep-purple/95 to-purple-950/95 backdrop-blur-sm py-3 px-4 border-b border-white/10"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToDashboard}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <h1 className="text-white font-medium text-lg truncate max-w-[200px] sm:max-w-md">
            {curioTitle || "Loading..."}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleToggleInsights}
            className={`bg-white/5 border-white/10 hover:bg-white/10 text-white ${
              showInsights ? 'bg-white/10 border-white/20' : ''
            }`}
          >
            <BarChart2 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioPageHeader;
