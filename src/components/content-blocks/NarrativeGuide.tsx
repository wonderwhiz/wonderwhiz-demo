
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
  const specialistName = getSpecialistName(specialistId);
  const specialistEmoji = getSpecialistEmoji(specialistId);
  
  // Guide messages by specialist
  const getGuideMessage = () => {
    const isFirstBlock = !previousBlock;
    const messages = {
      nova: [
        "Ready for a cosmic journey of discovery? Let's blast off!",
        "I'm going to take you on an adventure through space and time!",
        "Prepare for liftoff into a universe of knowledge!"
      ],
      prism: [
        "Let's conduct an experiment together to uncover amazing facts!",
        "My scientific curiosity is tingling! Ready to make discoveries?",
        "Through the lens of science, ordinary things become extraordinary!"
      ],
      atlas: [
        "History is full of fascinating stories waiting to be explored!",
        "Let me take you on a journey through time to discover amazing facts!",
        "The past holds secrets that can illuminate our present!"
      ],
      spark: [
        "Let's spark your imagination with creative explorations!",
        "Art and creativity can help us see the world in wonderful new ways!",
        "Every discovery is a chance to create something amazing!"
      ],
      pixel: [
        "Technology connects us to worlds of wonder and discovery!",
        "Let's explore the digital landscape of knowledge together!",
        "I've calculated precisely how much fun we're going to have: lots!"
      ],
      lotus: [
        "Nature's wisdom surrounds us - let's explore it together!",
        "With mindful curiosity, we can discover amazing connections!",
        "Let's take a peaceful journey through the wonders of our world!"
      ]
    };
    
    // Get random message for this specialist
    const specialistMessages = messages[specialistId as keyof typeof messages] || messages.nova;
    const randomIndex = Math.floor(Math.random() * specialistMessages.length);
    return specialistMessages[randomIndex];
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-4 p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-wonderwhiz-purple to-wonderwhiz-deep-purple flex items-center justify-center border-2 border-white/20">
          <span className="text-xl">{specialistEmoji}</span>
        </div>
        
        <div>
          <h4 className="text-white font-medium text-sm">{specialistName}</h4>
          <p className="text-white/80 text-sm mt-1">{getGuideMessage()}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default NarrativeGuide;
