
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistEmoji, getSpecialistName } from './utils/specialistUtils';

interface NarrativeGuideProps {
  specialistId: string;
  blockType: string;
  previousBlock?: any;
  nextBlock?: any;
}

const NarrativeGuide: React.FC<NarrativeGuideProps> = ({
  specialistId,
  blockType,
  previousBlock,
  nextBlock
}) => {
  const specialistEmoji = getSpecialistEmoji(specialistId);
  const specialistName = getSpecialistName(specialistId);
  
  // Generate a narrative message based on the block type and specialist
  const getNarrativeMessage = () => {
    if (blockType === 'fact' || blockType === 'funFact') {
      return `Let's explore an interesting fact about this topic!`;
    } else if (blockType === 'quiz') {
      return `Time to test your knowledge with a fun quiz!`;
    } else if (blockType === 'creative') {
      return `Let's get creative and express what we've learned!`;
    } else if (blockType === 'activity') {
      return `Ready for a hands-on activity to deepen your understanding?`;
    } else if (blockType === 'mindfulness') {
      return `Let's take a moment to reflect on what we've discovered.`;
    } else {
      return `I'm excited to guide you through this wonder journey!`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-3 text-sm text-white/80 italic flex items-center"
    >
      <span className="mr-2">{specialistEmoji}</span>
      <span>{getNarrativeMessage()}</span>
    </motion.div>
  );
};

export default NarrativeGuide;
