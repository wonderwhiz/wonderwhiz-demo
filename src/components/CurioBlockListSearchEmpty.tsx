
import React from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioBlockListSearchEmpty = () => {
  return (
    <motion.div 
      className="text-center py-10 px-4 text-white/70 max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className="bg-wonderwhiz-cyan/20 p-4 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Search className="w-8 h-8 text-wonderwhiz-cyan" />
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No results found</h3>
      <p className="text-sm font-inter mb-4">
        Hmm, that's a tricky one! Try another search term or explore one of our suggested topics.
      </p>
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="border-wonderwhiz-cyan text-wonderwhiz-cyan hover:bg-wonderwhiz-cyan/10 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span>Back to Exploring</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default CurioBlockListSearchEmpty;
