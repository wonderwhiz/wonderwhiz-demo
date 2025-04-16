
import React from 'react';
import { motion } from 'framer-motion';

interface VoiceIndicatorProps {
  isActive: boolean;
  waveform?: boolean;
}

export const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isActive, waveform = false }) => {
  if (!isActive) return null;

  return (
    <motion.div 
      className="flex items-center justify-center space-x-1"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 h-4 bg-wonderwhiz-bright-pink rounded-full"
          animate={{
            scaleY: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2
          }}
        />
      ))}
    </motion.div>
  );
};
