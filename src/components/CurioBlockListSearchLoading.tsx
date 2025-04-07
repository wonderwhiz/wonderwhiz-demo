
import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const CurioBlockListSearchLoading = () => {
  return (
    <motion.div 
      className="text-center py-8 text-white/70"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-3">
        <motion.div 
          className="bg-wonderwhiz-cyan/20 p-2 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="w-5 h-5 text-wonderwhiz-cyan" />
        </motion.div>
      </div>
      <p className="text-sm font-inter">
        Searching for wonders...
      </p>
    </motion.div>
  );
};

export default CurioBlockListSearchLoading;
