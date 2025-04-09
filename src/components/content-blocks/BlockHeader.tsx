
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistEmoji, getSpecialistName, getSpecialistDescription } from './utils/specialistUtils';

interface BlockHeaderProps {
  specialistId: string;
  blockTitle: string;
  blockType: string;
  narrativePosition: 'beginning' | 'middle' | 'end';
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ 
  specialistId, 
  blockTitle, 
  blockType,
  narrativePosition
}) => {
  // Get specialist information
  const specialistEmoji = getSpecialistEmoji(specialistId);
  const specialistName = getSpecialistName(specialistId);
  
  // Generate a tailored tagline based on specialist and block type
  const getSpecialistTagline = (): string => {
    const baseTaglines = {
      nova: [
        "Ready for a cosmic journey of discovery? Let's blast off!",
        "I'm going to take you on an adventure through space and time!",
        "Every discovery expands our cosmic perspective!"
      ],
      spark: [
        "Let's spark your imagination with creative explorations!",
        "Every discovery is a chance to create something amazing!",
        "Fueling your creative inspiration!"
      ],
      prism: [
        "Let's conduct an experiment together to uncover amazing facts!",
        "Through the lens of science, ordinary things become extraordinary!",
        "Experiment with scientific creativity!"
      ],
      pixel: [
        "Let's explore the digital landscape of knowledge together!",
        "I've calculated precisely how much fun we're going to have: lots!",
        "Technology connects us to worlds of wonder!"
      ],
      atlas: [
        "Let me take you on a journey through time to discover amazing facts!",
        "History is full of fascinating stories waiting to be explored!",
        "Create with historical inspiration!"
      ],
      lotus: [
        "Let's take a peaceful journey through the wonders of our world!",
        "Nature's wisdom surrounds us - let's explore it together!",
        "With mindful curiosity, we can discover amazing connections!"
      ]
    };

    // Use different taglines based on narrative position
    const taglineIndex = 
      narrativePosition === 'beginning' ? 0 : 
      narrativePosition === 'middle' ? 1 : 2;
    
    return baseTaglines[specialistId as keyof typeof baseTaglines]?.[taglineIndex] || 
           "Let's explore this fascinating topic together!";
  };

  // Get specialist description based on block type and topic
  const getContextualSpecialistTitle = (): string => {
    const baseDescriptions = {
      nova: "Space Expert",
      spark: "Creative Genius",
      prism: "Science Whiz",
      pixel: "Tech Guru",
      atlas: "History Buff",
      lotus: "Nature Guide"
    };
    
    // Customize based on block type
    if (blockType === 'quiz') {
      return specialistId === 'prism' ? "Science Puzzle Master" : 
             specialistId === 'spark' ? "Creative Problem-Solver" :
             specialistId === 'pixel' ? "Tech Challenge Creator" :
             baseDescriptions[specialistId as keyof typeof baseDescriptions];
    }
    
    if (blockType === 'creative') {
      return specialistId === 'spark' ? "Imagination Catalyst" : 
             specialistId === 'prism' ? "Scientific Artist" :
             baseDescriptions[specialistId as keyof typeof baseDescriptions];
    }
    
    if (blockType === 'mindfulness') {
      return specialistId === 'lotus' ? "Mindfulness Guide" : 
             specialistId === 'nova' ? "Cosmic Awareness Guide" :
             baseDescriptions[specialistId as keyof typeof baseDescriptions];
    }
    
    return baseDescriptions[specialistId as keyof typeof baseDescriptions];
  };

  const specialistTagline = getSpecialistTagline();
  const specialistTitle = getContextualSpecialistTitle();

  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="text-2xl">{specialistEmoji}</div>
        <motion.div
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-medium text-white"
        >
          {specialistName}
        </motion.div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 mb-3 pl-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/80 text-sm"
        >
          {specialistTitle}
        </motion.div>
        
        <div className="hidden sm:block text-white/40">•</div>
        
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/70 text-sm italic"
        >
          {specialistTagline}
        </motion.div>
      </div>
    </div>
  );
};

export default BlockHeader;
