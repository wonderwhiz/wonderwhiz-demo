
import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const CurioBlockListSearchError = () => {
  return (
    <motion.div 
      className="text-center py-8 text-white/70"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-3">
        <div className="bg-red-500/20 p-2 rounded-full">
          <AlertTriangle className="w-5 h-5 text-red-500" />
        </div>
      </div>
      <p className="text-sm font-inter">
        Something went wrong with your search. Please try again!
      </p>
    </motion.div>
  );
};

export default CurioBlockListSearchError;
