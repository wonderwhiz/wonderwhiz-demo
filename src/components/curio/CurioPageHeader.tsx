
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioPageHeaderProps {
  curioTitle: string | null;
  handleBackToDashboard: () => void;
  handleToggleInsights: () => void;
  handleRefresh: () => void;
  refreshing: boolean;
  showInsights: boolean;
}

const CurioPageHeader: React.FC<CurioPageHeaderProps> = ({
  curioTitle,
  handleBackToDashboard,
  handleToggleInsights,
  handleRefresh,
  refreshing,
  showInsights
}) => {
  return (
    <motion.div 
      className="py-3 sm:py-6 px-4 sm:px-6 bg-gradient-to-r from-wonderwhiz-deep-purple/80 to-wonderwhiz-deep-purple/60 border-b border-white/10 backdrop-blur-md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToDashboard}
              className="mb-2 text-white/70 hover:text-white -ml-2 group transition-colors hidden sm:flex"
            >
              <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
              <span>Back to Dashboard</span>
            </Button>
            
            {/* Mobile back button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackToDashboard}
              className="mb-2 text-white/70 hover:text-white -ml-2 group transition-colors sm:hidden"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            </Button>
            
            {curioTitle && (
              <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight line-clamp-2 sm:line-clamp-none">
                {curioTitle}
              </h1>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleInsights}
                className={`text-white/90 border-white/20 hover:bg-white/10 bg-white/5 flex items-center backdrop-blur-md ${showInsights ? 'bg-white/10' : ''}`}
              >
                <Brain className="w-4 h-4 mr-1.5 text-wonderwhiz-bright-pink" />
                <span>Learning Insights</span>
              </Button>
            </motion.div>
            
            {/* Mobile insights button */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="sm:hidden"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleInsights}
                className={`text-white/90 border-white/20 hover:bg-white/10 bg-white/5 backdrop-blur-md ${showInsights ? 'bg-white/10' : ''}`}
              >
                <Brain className="w-4 h-4 text-wonderwhiz-bright-pink" />
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-white/70 hover:text-white hover:bg-white/10"
                title="Refresh content"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioPageHeader;
