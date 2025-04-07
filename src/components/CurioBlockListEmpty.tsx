
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const CurioBlockListEmpty = () => {
  return (
    <motion.div 
      className="text-center py-8 text-white/70"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-3">
        <div className="bg-wonderwhiz-purple/20 p-2 rounded-full">
          <Sparkles className="w-5 h-5 text-wonderwhiz-vibrant-yellow" />
        </div>
      </div>
      <p className="text-sm font-inter">
        No content found. Start your discovery journey!
      </p>
    </motion.div>
  );
};

export default CurioBlockListEmpty;
