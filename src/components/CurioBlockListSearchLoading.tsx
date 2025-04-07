
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const CurioBlockListSearchLoading = () => {
  return (
    <div className="text-center py-8 sm:py-12 text-white/80">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20 
        }}
        className="relative mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-blue-accent rounded-full opacity-20 blur-xl animate-pulse-gentle"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <Search className="h-10 w-10 sm:h-16 sm:w-16 text-wonderwhiz-cyan animate-float-gentle" />
        </div>
      </motion.div>
      <motion.h3 
        className="text-xl sm:text-2xl font-semibold mb-2 sm:mb-3 font-nunito"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Searching...
      </motion.h3>
      <motion.p 
        className="text-white/70 max-w-md mx-auto font-inter text-sm sm:text-base"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Looking for content that matches your search
      </motion.p>
    </div>
  );
};

export default CurioBlockListSearchLoading;
