
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ message = "Crafting your learning experience..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="relative mb-6"
      >
        <div className="absolute -inset-4 rounded-full bg-wonderwhiz-bright-pink/20 blur-lg animate-pulse"></div>
        <Sparkles className="w-12 h-12 text-wonderwhiz-bright-pink" />
      </motion.div>
      
      <h3 className="text-xl font-bold text-white mb-2 font-nunito">{message}</h3>
      
      <p className="text-white/60 max-w-md">
        Gathering wonders and fascinating insights just for you...
      </p>
      
      <div className="mt-8 space-y-2">
        <div className="h-2 w-64 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CurioLoadingState;
