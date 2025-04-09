
import React from 'react';
import { motion } from 'framer-motion';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ message = "Loading content..." }) => {
  return (
    <div className="flex items-center justify-center h-full py-12">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full bg-wonderwhiz-gold/20 blur-lg animate-pulse"></div>
          <div className="relative flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-wonderwhiz-gold/30 border-t-wonderwhiz-gold rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-white/80 text-center">{message}</p>
      </motion.div>
    </div>
  );
};

export default CurioLoadingState;
