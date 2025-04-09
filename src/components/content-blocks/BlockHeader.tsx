
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistName, getSpecialistEmoji, getRelevantSpecialist } from './utils/specialistUtils';

interface BlockHeaderProps {
  specialistId: string;
  blockTitle: string;
  blockType?: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
  topicKeywords?: string[];
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ 
  specialistId, 
  blockTitle,
  blockType = 'fact',
  narrativePosition,
  topicKeywords = []
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
      case 'riddle':
        return { scale: [1, 1.02, 1], rotate: [0, 1, 0] };
      case 'flashcard':
        return { y: [0, -2, 0] };
      case 'creative':
        return { scale: [1, 1.03, 1] };
      default:
        return { scale: [1, 1.01, 1] };
    }
  };

  // Get specialist display title based on their role and expertise
  const getSpecialistTitle = () => {
    switch (specialistId) {
      case 'nova':
        return 'Space Expert';
      case 'spark':
        return 'Creative Genius';
      case 'prism':
        return 'Science Whiz';
      case 'pixel':
        return 'Tech Guru';
      case 'atlas':
        return 'History Buff';
      case 'lotus':
        return 'Nature Guide';
      default:
        return '';
    }
  };

  // Get directly relevant tagline based on topic and specialist expertise
  const getSpecialistTagline = () => {
    const topic = blockTitle.toLowerCase();
    const keywords = topicKeywords.map(k => k.toLowerCase());
    const allKeywords = [topic, ...keywords];

    // Extract general topic
    const isFoodRelated = allKeywords.some(k => 
      k.includes('food') || k.includes('spicy') || k.includes('taste') || k.includes('flavor')
    );
    const isBollywoodRelated = allKeywords.some(k => 
      k.includes('bollywood') || k.includes('movie') || k.includes('film') || k.includes('cinema')
    );
    const isAfghanistanRelated = allKeywords.some(k => 
      k.includes('afghanistan') || k.includes('danger')
    );
    const isSpaceRelated = allKeywords.some(k => 
      k.includes('space') || k.includes('planet') || k.includes('star') || k.includes('galaxy')
    );
    const isTechRelated = allKeywords.some(k => 
      k.includes('robot') || k.includes('tech') || k.includes('computer') || k.includes('digital')
    );
    const isAnimalRelated = allKeywords.some(k => 
      k.includes('animal') || k.includes('wildlife') || k.includes('creature')
    );
    
    // Block type context for more specific taglines
    const isBrainTeaser = blockType === 'quiz' || blockType === 'riddle';
    const isCreative = blockType === 'creative' || blockType === 'task';
    const isFactual = blockType === 'fact' || blockType === 'funFact';
    
    // Food-related taglines
    if (isFoodRelated) {
      switch (specialistId) {
        case 'nova':
          return "Exploring the science of flavor perception!";
        case 'spark':
          return "Creating culinary inspirations!";
        case 'prism':
          return "Revealing the chemistry of taste sensations!";
        case 'pixel':
          return "Analyzing flavor with scientific precision!";
        case 'atlas':
          return "Uncovering the history of spices and flavors!";
        case 'lotus':
          return "Connecting mindfulness to our sense of taste!";
        default:
          return "Discovering food science!";
      }
    }
    
    // Bollywood-specific taglines
    if (isBollywoodRelated) {
      switch (specialistId) {
        case 'nova':
          return "Exploring how technology transforms entertainment";
        case 'spark':
          return "Celebrating the colors and creativity of cinema";
        case 'prism':
          return "Analyzing the science behind music and dance";
        case 'pixel':
          return "Discovering how digital tools enhance storytelling";
        case 'atlas':
          return "Revealing the rich history of Indian cinema";
        case 'lotus':
          return "Finding cultural connections through art";
        default:
          return "Exploring cinema and culture";
      }
    }
    
    // Afghanistan-specific taglines
    if (isAfghanistanRelated) {
      switch (specialistId) {
        case 'nova':
          return "Exploring geographical features and challenges";
        case 'spark':
          return "Understanding cultural complexities through art";
        case 'prism':
          return "Analyzing environmental and societal factors";
        case 'pixel':
          return "Using data to understand regional situations";
        case 'atlas':
          return "Providing historical context for today's challenges";
        case 'lotus':
          return "Finding perspective on complex global issues";
        default:
          return "Exploring regional knowledge";
      }
    }
    
    // Space-specific taglines
    if (isSpaceRelated) {
      switch (specialistId) {
        case 'nova':
          return "Your cosmic guide to space mysteries";
        case 'spark':
          return "Igniting creative curiosity about space";
        case 'prism':
          return "Revealing the science of celestial bodies";
        case 'pixel':
          return "Exploring space through technology";
        case 'atlas':
          return "Mapping the history of space discovery";
        case 'lotus':
          return "Connecting Earth's life to the cosmos";
        default:
          return "Exploring the cosmos";
      }
    }
    
    // Technology-specific taglines
    if (isTechRelated) {
      switch (specialistId) {
        case 'nova':
          return "Exploring the future of technology";
        case 'spark':
          return "Creating art with technological tools";
        case 'prism':
          return "Understanding the science behind gadgets";
        case 'pixel':
          return "Navigating the digital world with expertise";
        case 'atlas':
          return "Revealing how technology changed history";
        case 'lotus':
          return "Finding balance in our tech-filled world";
        default:
          return "Exploring technology";
      }
    }
    
    // Animal-specific taglines
    if (isAnimalRelated) {
      switch (specialistId) {
        case 'nova':
          return "Discovering creatures across the universe";
        case 'spark':
          return "Creating art inspired by amazing creatures";
        case 'prism':
          return "Exploring the science of animal adaptations";
        case 'pixel':
          return "Using technology to protect wildlife";
        case 'atlas':
          return "Tracing the history of animals through time";
        case 'lotus':
          return "Learning mindfulness from nature's creatures";
        default:
          return "Exploring the animal kingdom";
      }
    }
    
    // Block type specific taglines
    if (isBrainTeaser) {
      switch (specialistId) {
        case 'nova':
          return "Challenging your cosmic thinking!";
        case 'spark':
          return "Sparking your creative problem-solving!";
        case 'prism':
          return "Testing your scientific knowledge!";
        case 'pixel':
          return "Puzzling through tech mysteries!";
        case 'atlas':
          return "Exploring historical riddles!";
        case 'lotus':
          return "Cultivating mindful curiosity!";
        default:
          return "Test your knowledge!";
      }
    }
    
    if (isCreative) {
      switch (specialistId) {
        case 'nova':
          return "Time for cosmic creativity!";
        case 'spark':
          return "Let's get creative together!";
        case 'prism':
          return "Experiment with scientific creativity!";
        case 'pixel':
          return "Let's design something amazing!";
        case 'atlas':
          return "Create with historical inspiration!";
        case 'lotus':
          return "Express yourself mindfully!";
        default:
          return "Time to create!";
      }
    }
    
    if (isFactual) {
      switch (specialistId) {
        case 'nova':
          return "Expanding your cosmic knowledge!";
        case 'spark':
          return "Fueling your creative inspiration!";
        case 'prism':
          return "Revealing fascinating scientific facts!";
        case 'pixel':
          return "Uncovering tech wonders!";
        case 'atlas':
          return "Journey through time with amazing facts!";
        case 'lotus':
          return "Connecting us through nature's wisdom!";
        default:
          return "Discover something amazing!";
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
        return "Let's explore together!";
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
        <h3 className="text-white text-sm font-medium leading-tight flex items-center">
          {specialistName}
          <span className="mx-1.5 text-white/40">•</span>
          <span className="text-white/80 text-xs">{getSpecialistTitle()}</span>
        </h3>
        <p className="text-white/60 text-xs">{getSpecialistTagline()}</p>
      </div>
    </div>
  );
};

export default BlockHeader;
