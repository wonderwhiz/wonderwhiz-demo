
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistName, getSpecialistEmoji } from './utils/specialistUtils';

interface BlockHeaderProps {
  specialistId: string;
  blockTitle: string;
  blockType?: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ 
  specialistId, 
  blockTitle,
  blockType = 'fact',
  narrativePosition
}) => {
  const specialistName = getSpecialistName(specialistId);
  const specialistEmoji = getSpecialistEmoji(specialistId);
  
  // Get appropriate color based on specialist
  const getSpecialistGradient = () => {
    switch (specialistId) {
      case 'nova':
        return 'from-blue-400 to-indigo-500';
      case 'spark':
        return 'from-pink-400 to-rose-500';
      case 'prism':
        return 'from-yellow-400 to-amber-500';
      case 'pixel':
        return 'from-cyan-400 to-blue-500';
      case 'atlas':
        return 'from-emerald-400 to-teal-500';
      case 'lotus':
        return 'from-purple-400 to-violet-500';
      default:
        return 'from-gray-400 to-slate-500';
    }
  };

  // Get appropriate animation based on block type
  const getBlockAnimation = () => {
    switch (blockType) {
      case 'quiz':
        return { scale: [1, 1.02, 1], rotate: [0, 1, 0] };
      case 'flashcard':
        return { y: [0, -2, 0] };
      case 'creative':
        return { scale: [1, 1.03, 1] };
      default:
        return { scale: [1, 1.01, 1] };
    }
  };

  // Get specialist tagline based on current topic or type
  const getSpecialistTagline = () => {
    const isAfghanistanRelated = blockTitle.toLowerCase().includes('afghanistan') || 
                                (blockType === 'quiz' && blockTitle.includes('Brain Teaser'));
    
    if (isAfghanistanRelated) {
      switch (specialistId) {
        case 'nova':
          return "Exploring how space tech monitors conflict zones";
        case 'spark':
          return "Creating awareness through art and storytelling";
        case 'prism':
          return "Analyzing the science behind regional dangers";
        case 'pixel':
          return "Using technology to navigate high-risk areas";
        case 'atlas':
          return "Revealing the historical context of conflicts";
        case 'lotus':
          return "Finding mindfulness amidst challenging environments";
        default:
          return specialistName;
      }
    }
    
    if (blockTitle.toLowerCase().includes('jupiter') || blockTitle.toLowerCase().includes('space')) {
      switch (specialistId) {
        case 'nova':
          return "Your cosmic guide to Jupiter's mysteries";
        case 'spark':
          return "Igniting creative curiosity about space";
        case 'prism':
          return "Revealing the science of gas giants";
        case 'pixel':
          return "Exploring space through technology";
        case 'atlas':
          return "Mapping Jupiter's historical discovery";
        case 'lotus':
          return "Connecting Earth's life to space";
        default:
          return specialistName;
      }
    }
    
    // Default taglines if not topic-specific
    switch (specialistId) {
      case 'nova':
        return "Every discovery expands our cosmic perspective!";
      case 'spark':
        return "Let's spark your imagination with creative explorations!";
      case 'prism':
        return "Let me take you on a scientific journey of discovery!";
      case 'pixel':
        return "Technology connects us to worlds of wonder!";
      case 'atlas':
        return "Let me take you on a journey through time!";
      case 'lotus':
        return "With mindful curiosity, we can discover amazing connections!";
      default:
        return specialistName;
    }
  };

  return (
    <div className="mb-3 flex items-center">
      <motion.div 
        className={`w-9 h-9 rounded-full bg-gradient-to-br ${getSpecialistGradient()} flex items-center justify-center text-white shadow-sm mr-3`}
        whileHover={getBlockAnimation()}
        transition={{ duration: 0.5, repeat: 0, repeatType: "reverse" }}
      >
        <span className="text-lg">{specialistEmoji}</span>
      </motion.div>
      
      <div>
        <h3 className="text-white text-sm font-medium leading-tight">{blockTitle}</h3>
        <p className="text-white/60 text-xs">{getSpecialistTagline()}</p>
      </div>
    </div>
  );
};

export default BlockHeader;
