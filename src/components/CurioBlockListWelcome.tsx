
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CurioBlockListWelcomeProps {
  childProfile: any;
}

const CurioBlockListWelcome = ({ childProfile }: CurioBlockListWelcomeProps) => {
  return (
    <motion.div 
      className="text-center py-8 sm:py-10 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="relative mx-auto w-16 h-16 sm:w-24 sm:h-24 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20, 
          delay: 0.2 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full opacity-20 blur-xl animate-pulse-gentle"></div>
        <div className="relative flex items-center justify-center w-full h-full">
          <Sparkles className="h-10 w-10 sm:h-16 sm:w-16 text-wonderwhiz-vibrant-yellow animate-float-gentle" />
        </div>
      </motion.div>
      
      <motion.h2 
        className="text-xl sm:text-2xl font-bold mb-2 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Welcome, {childProfile?.name || 'Explorer'}!
      </motion.h2>
      
      <motion.p 
        className="text-white/70 max-w-md mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        Your adventure is about to begin. Discover amazing things about our universe!
      </motion.p>
    </motion.div>
  );
};

export default CurioBlockListWelcome;
