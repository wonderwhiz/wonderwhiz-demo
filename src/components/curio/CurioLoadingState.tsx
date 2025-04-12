
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ message = "Creating your discovery..." }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <motion.div
        className="relative mb-6"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-lg"></div>
        <Sparkles className="w-14 h-14 text-white/80" />
      </motion.div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-nunito">{message}</h3>
      
      <p className="text-white/70 max-w-md px-6 sm:px-0">
        Preparing something amazing just for you...
      </p>
      
      <div className="mt-8 space-y-2">
        <div className="h-1.5 w-64 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
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
