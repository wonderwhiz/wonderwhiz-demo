
import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-6 sm:py-8 text-center"
    >
      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white/40" />
      </div>
      
      <h3 className="text-base sm:text-lg font-bold text-white mb-1.5 font-nunito">No wonders found</h3>
      
      <p className="text-white/60 max-w-sm mb-4 px-4 sm:px-0 text-xs sm:text-sm">
        Try searching for something new to explore
      </p>
      
      <Button 
        variant="default"
        onClick={() => window.location.reload()}
        className="bg-white/10 hover:bg-white/15 text-white text-sm"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
        <span>Try again</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
