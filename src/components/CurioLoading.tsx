
import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const CurioLoading: React.FC = () => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center relative">
        {/* Animated sparkles around the loader */}
        <motion.div
          className="absolute -top-8 -left-8"
          animate={{ 
            rotate: [0, 20, -20, 0],
            scale: [1, 1.2, 1, 1.1, 1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <Sparkles className="h-5 w-5 text-wonderwhiz-gold" />
        </motion.div>
        
        <motion.div
          className="absolute -bottom-8 -right-8"
          animate={{ 
            rotate: [0, -20, 20, 0],
            scale: [1, 1.1, 1, 1.2, 1]
          }}
          transition={{ duration: 3.5, repeat: Infinity }}
        >
          <Sparkles className="h-5 w-5 text-wonderwhiz-pink" />
        </motion.div>
        
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex items-center justify-center mb-3"
        >
          <Loader2 className="h-10 w-10 text-wonderwhiz-purple" />
        </motion.div>
        
        <motion.p 
          className="text-white text-md font-medium"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Preparing your magical curio...
        </motion.p>
        
        <motion.p 
          className="text-white/60 text-xs mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Our specialists are gathering the best information for you!
        </motion.p>
      </div>
    </motion.div>
  );
};

export default CurioLoading;
