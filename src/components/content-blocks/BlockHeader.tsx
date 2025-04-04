
import React from 'react';
import { motion } from 'framer-motion';
import { SPECIALISTS } from '../SpecialistAvatar';

interface BlockHeaderProps {
  specialistId: string;
  blockTitle: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ specialistId, blockTitle }) => {
  const specialist = SPECIALISTS[specialistId] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };

  return (
    <>
      <div className="flex items-center mb-3 sm:mb-4">
        <motion.div 
          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${specialist.color} flex items-center justify-center flex-shrink-0 shadow-md`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        >
          {specialist.emoji}
        </motion.div>
        <div className="ml-2 min-w-0 flex-1">
          <h3 className="font-medium text-white text-sm sm:text-base truncate">{specialist.name}</h3>
          <p className="text-white/70 text-xs truncate">{specialist.description}</p>
        </div>
      </div>
      
      <motion.h4 
        className="text-base sm:text-lg font-bold text-white mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {blockTitle}
      </motion.h4>
    </>
  );
};

export default BlockHeader;
