
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const CurioBlockListSearchEmpty = () => {
  return (
    <motion.div 
      className="text-center py-8 text-white/70"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-3">
        <div className="bg-wonderwhiz-cyan/20 p-2 rounded-full">
          <Search className="w-5 h-5 text-wonderwhiz-cyan" />
        </div>
      </div>
      <p className="text-sm font-inter">
        No results found for your search. Try something else!
      </p>
    </motion.div>
  );
};

export default CurioBlockListSearchEmpty;
