
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSpecialistEmoji, getSpecialistName } from './utils/specialistUtils';

interface NarrativePromptProps {
  profileId: string;
  specialistId: string;
  onPromptClick?: (prompt: string) => void;
}

const NarrativePrompt: React.FC<NarrativePromptProps> = ({ 
  profileId, 
  specialistId, 
  onPromptClick 
}) => {
  const [creativePrompts, setCreativePrompts] = useState<string[]>([]);
  const specialistEmoji = getSpecialistEmoji(specialistId);
  const specialistName = getSpecialistName(specialistId);
  
  useEffect(() => {
    // Generate prompts based on specialist
    const prompts = [
      "I wonder what would happen if we applied this knowledge in a different way?",
      "What if we looked at this from a completely different perspective?",
      "How could we use this information to solve a real-world problem?",
      "What connections can we make between this and other topics we've explored?"
    ];
    
    // Add specialist-specific prompts
    if (specialistId === 'nova') {
      prompts.push("What would this look like in outer space?");
      prompts.push("How might aliens approach this differently?");
    } else if (specialistId === 'prism') {
      prompts.push("What scientific experiment could we design to test this?");
      prompts.push("How could this transform in different environmental conditions?");
    } else if (specialistId === 'spark') {
      prompts.push("How could we turn this into a story or artwork?");
      prompts.push("What sounds or music would represent this concept?");
    } else if (specialistId === 'atlas') {
      prompts.push("How might this have been different in ancient times?");
      prompts.push("What might this look like 100 years in the future?");
    }
    
    // Shuffle and select 2-3 prompts
    const shuffled = [...prompts].sort(() => 0.5 - Math.random());
    setCreativePrompts(shuffled.slice(0, 3));
  }, [specialistId]);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="my-8 p-4 bg-white/5 border border-white/10 rounded-lg"
    >
      <div className="flex items-center mb-3">
        <span className="text-xl mr-2">{specialistEmoji}</span>
        <h3 className="text-white font-medium">{specialistName} wonders...</h3>
      </div>
      
      <div className="space-y-2">
        {creativePrompts.map((prompt, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full justify-start text-left text-white/80 hover:text-white hover:bg-white/10"
            onClick={() => onPromptClick && onPromptClick(prompt)}
          >
            <ArrowRight className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{prompt}</span>
          </Button>
        ))}
      </div>
    </motion.div>
  );
};

export default NarrativePrompt;
