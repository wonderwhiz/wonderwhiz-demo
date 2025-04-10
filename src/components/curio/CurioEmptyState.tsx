
import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-8 sm:py-12 text-center"
    >
      <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-white/5 flex items-center justify-center mb-4 shadow-inner shadow-wonderwhiz-bright-pink/5">
        <Search className="h-5 w-5 sm:h-6 sm:w-6 text-white/30" />
      </div>
      
      <h3 className="text-lg sm:text-xl font-bold text-white mb-2 font-nunito">Nothing found yet</h3>
      
      <p className="text-white/60 max-w-sm mb-5 px-6 sm:px-0 text-sm font-inter">
        Try exploring something new to begin your wonder journey
      </p>
      
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
        className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20 text-sm font-medium transition-all duration-300"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-2 opacity-70" />
        <span>Try again</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
