
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistEmoji } from './utils/specialistUtils';

interface StoryTransitionProps {
  message: string;
  specialistId: string;
}

const StoryTransition: React.FC<StoryTransitionProps> = ({ message, specialistId }) => {
  const emoji = getSpecialistEmoji(specialistId);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="my-6 text-center text-white/60 italic text-sm flex items-center justify-center space-x-2"
    >
      <span className="text-lg">{emoji}</span>
      <span>{message}</span>
      <span className="text-lg">{emoji}</span>
    </motion.div>
  );
};

export default StoryTransition;
