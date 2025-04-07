
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, LightbulbIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioBlockListEmpty = () => {
  return (
    <motion.div 
      className="text-center py-10 px-4 text-white/70 max-w-md mx-auto"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-center mb-4">
        <motion.div 
          className="bg-wonderwhiz-purple/30 p-4 rounded-full relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-pink/20 to-wonderwhiz-gold/20 rounded-full"
            animate={{ 
              rotate: [0, 360],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <div className="relative z-10">
            <Sparkles className="w-8 h-8 text-wonderwhiz-vibrant-yellow" />
          </div>
        </motion.div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Start your adventure!</h3>
      <p className="text-sm font-inter mb-4">
        Ready to explore amazing wonders? Ask a question or pick a suggested topic to begin your discovery journey!
      </p>
      <div className="flex justify-center">
        <Button 
          variant="outline" 
          className="border-wonderwhiz-vibrant-yellow/50 text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/10 group"
        >
          <LightbulbIcon className="w-4 h-4 mr-2 group-hover:text-wonderwhiz-vibrant-yellow" />
          <span>Try a suggestion</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default CurioBlockListEmpty;
