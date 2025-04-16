
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PieChart, RefreshCcw, Home, Sparkles } from 'lucide-react';
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
  childName
}) => {
  return (
    <motion.header 
      className="sticky top-0 z-50 bg-gradient-to-b from-wonderwhiz-deep-purple to-indigo-950/95 backdrop-blur-md py-4 border-b border-white/10 shadow-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10 transition-all duration-300 shadow-glow-brand"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {curioTitle && (
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-white font-nunito truncate max-w-[200px] sm:max-w-md">
                {curioTitle}
              </h1>
              <div className="hidden sm:flex items-center">
                <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow animate-pulse" />
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleInsights}
            className={`bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10 transition-all duration-300 shadow-glow-brand ${
              showInsights ? 'bg-white/20 text-wonderwhiz-bright-pink shadow-glow-brand-pink' : ''
            }`}
          >
            <PieChart className="h-5 w-5" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10 transition-all duration-300 shadow-glow-brand"
          >
            <RefreshCcw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToDashboard}
            className="bg-white/10 hover:bg-white/20 text-white rounded-xl h-10 w-10 transition-all duration-300 shadow-glow-brand sm:hidden"
          >
            <Home className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default CurioPageHeader;
