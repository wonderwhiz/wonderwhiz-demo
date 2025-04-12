
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center py-10 sm:py-16 text-center"
    >
      <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center mb-5 shadow-inner">
        <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-white/70" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-nunito">Ready for Discovery</h3>
      
      <p className="text-white/70 max-w-sm mb-6 px-6 sm:px-0 text-sm sm:text-base font-inter">
        Your next wonder journey awaits. What would you like to explore today?
      </p>
      
      <Button 
        variant="outline"
        onClick={() => window.location.reload()}
        className="bg-white/10 hover:bg-white/15 text-white border-white/10 hover:border-white/20 text-sm font-medium transition-all duration-300"
      >
        <RefreshCw className="h-3.5 w-3.5 mr-2 opacity-80" />
        <span>Begin Exploring</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
