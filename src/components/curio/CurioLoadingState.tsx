
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Stars } from 'lucide-react';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ message = "Creating your learning adventure..." }) => {
  return (
    <div className="flex items-center justify-center h-full py-12">
      <motion.div 
        className="flex flex-col items-center text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative w-24 h-24 mb-6">
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow/60 blur-lg"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.7, 0.5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <div className="relative h-full flex items-center justify-center">
            <motion.div
              className="absolute"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-14 w-14 text-wonderwhiz-gold opacity-30" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="h-10 w-10 text-wonderwhiz-gold" />
            </motion.div>
            <motion.div 
              className="absolute -right-3 -top-3"
              animate={{ 
                y: [-4, 0, -4],
                x: [0, 2, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-6 w-6 text-wonderwhiz-vibrant-yellow" />
            </motion.div>
            <motion.div 
              className="absolute -left-2 -bottom-2"
              animate={{ 
                y: [0, -4, 0],
                x: [-2, 0, -2],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
            >
              <Stars className="h-5 w-5 text-wonderwhiz-bright-pink" />
            </motion.div>
          </div>
        </div>
        
        <motion.h3
          className="text-xl font-bold text-white mb-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {message}
        </motion.h3>
        
        <motion.p 
          className="text-white/60 text-sm max-w-xs"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Our learning specialists are creating an amazing experience just for you!
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CurioLoadingState;
