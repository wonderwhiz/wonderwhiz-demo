
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PieChart, RefreshCcw, Home } from 'lucide-react';
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
    <motion.header 
      className="sticky top-0 z-50 bg-gradient-to-b from-indigo-950/95 to-indigo-950/85 backdrop-blur-sm py-3 px-4 sm:px-6 border-b border-white/10 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="mr-3 bg-white/5 hover:bg-white/10 text-white rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {curioTitle && (
            <h1 className="text-lg sm:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {curioTitle}
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleInsights}
            className={`bg-white/5 hover:bg-white/10 text-white rounded-full h-9 w-9 ${showInsights ? 'bg-white/15 shadow-inner' : ''}`}
          >
            <PieChart className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-9 w-9"
          >
            <RefreshCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-9 w-9 sm:hidden"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default CurioPageHeader;
