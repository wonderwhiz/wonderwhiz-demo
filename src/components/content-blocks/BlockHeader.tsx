
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
  
  // Generate a tailored tagline based on specialist, block type, and narrative position
  const getSpecialistTagline = (): string => {
    // Base taglines mapped to narrative positions
    const narrativeTaglines = {
      beginning: {
        nova: "Let's start our cosmic journey of discovery!",
        spark: "I'm going to spark your imagination with a creative exploration!",
        prism: "Let's begin with some fascinating scientific facts!",
        pixel: "I'll introduce you to the technology behind this topic!",
        atlas: "Let's journey through time to discover how this began!",
        lotus: "Let's take a peaceful journey into this fascinating topic!"
      },
      middle: {
        nova: "Now that we've started exploring, let's dig deeper!",
        spark: "Let's build on what we've learned with some creative thinking!",
        prism: "Now let's experiment with these scientific concepts!",
        pixel: "Let's see how technology helps us understand this better!",
        atlas: "Now let's explore how this changed throughout history!",
        lotus: "Let's deepen our understanding with mindful observation!"
      },
      end: {
        nova: "Let's bring our cosmic journey to an illuminating conclusion!",
        spark: "Let's use our creativity to apply what we've learned!",
        prism: "Let's connect these scientific discoveries to our daily lives!",
        pixel: "Let's think about how this technology shapes our future!",
        atlas: "Let's reflect on what this history teaches us today!",
        lotus: "Let's find a meaningful connection with what we've learned!"
      }
    };
    
    // Block type adjustments
    const blockTypeAdjustments = {
      quiz: "Think carefully about what we've learned so far!",
      creative: "Let's express our learning through creativity!",
      activity: "Let's learn by doing something hands-on!",
      mindfulness: "Take a moment to reflect on what we've discovered!",
      task: "Apply your learning with this challenge!"
    };
    
    // Select the base tagline based on narrative position and specialist
    const baseTagline = narrativeTaglines[narrativePosition]?.[specialistId as keyof typeof narrativeTaglines.beginning] || 
                        "Let's explore this fascinating topic together!";
    
    // If this is a special block type, maybe override with a more specific tagline
    if (blockType in blockTypeAdjustments && Math.random() > 0.5) {
      return blockTypeAdjustments[blockType as keyof typeof blockTypeAdjustments];
    }
    
    return baseTagline;
  };

  // Get specialist title based on block type and topic
  const getContextualSpecialistTitle = (): string => {
    const baseDescriptions = {
      nova: "Space Expert",
      spark: "Creative Genius",
      prism: "Science Whiz",
      pixel: "Tech Guru",
      atlas: "History Buff",
      lotus: "Nature Guide"
    };
    
    // Adjust title based on block type
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
    
    // Adjust title based on narrative position
    if (narrativePosition === 'beginning') {
      return specialistId === 'atlas' ? "Historical Explorer" :
             specialistId === 'prism' ? "Scientific Investigator" :
             baseDescriptions[specialistId as keyof typeof baseDescriptions];
    }
    
    if (narrativePosition === 'end') {
      return specialistId === 'lotus' ? "Wisdom Guide" :
             specialistId === 'spark' ? "Innovation Inspirer" :
             baseDescriptions[specialistId as keyof typeof baseDescriptions];
    }
    
    return baseDescriptions[specialistId as keyof typeof baseDescriptions];
  };

  const specialistTagline = getSpecialistTagline();
  const specialistTitle = getContextualSpecialistTitle();

  // Animation variants for a more dynamic introduction
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="mb-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="flex items-center gap-2 mb-1"
        variants={itemVariants}
      >
        <div className="text-2xl">{specialistEmoji}</div>
        <div className="font-medium text-white">{specialistName}</div>
      </motion.div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-x-2 gap-y-1 mb-3 pl-8">
        <motion.div
          variants={itemVariants}
          className="text-white/80 text-sm"
        >
          {specialistTitle}
        </motion.div>
        
        <div className="hidden sm:block text-white/40">•</div>
        
        <motion.div
          variants={itemVariants}
          className="text-white/70 text-sm italic"
        >
          {specialistTagline}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlockHeader;
