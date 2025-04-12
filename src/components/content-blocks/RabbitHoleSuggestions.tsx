import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import SpecialistAvatar from '@/components/SpecialistAvatar';

interface RabbitHoleSuggestionsProps {
  curioTitle: string;
  profileId: string;
  onSuggestionClick: (question: string) => void;
  specialistIds: string[];
}

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  curioTitle,
  profileId,
  onSuggestionClick,
  specialistIds = []
}) => {
  // Generate related suggestions based on the curio title
  const generateSuggestions = () => {
    const basicSuggestions = [
      `How do ${curioTitle.toLowerCase()} impact our daily lives?`,
      `What are the most interesting facts about ${curioTitle.toLowerCase()}?`,
      `The history of ${curioTitle.toLowerCase()} explained`,
      `What science is behind ${curioTitle.toLowerCase()}?`,
      `The future of ${curioTitle.toLowerCase()}`
    ];
    
    // Keep a subset of suggestions
    return basicSuggestions.slice(0, 3);
  };
  
  const suggestions = generateSuggestions();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-indigo-600/20 backdrop-blur-md border border-indigo-500/30 rounded-lg p-4 mb-6"
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600/50 flex items-center justify-center mr-3">
          <Compass className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-white">Continue Your Exploration</h2>
      </div>
      
      <p className="text-white/70 text-sm mb-4">
        What would you like to discover next? Here are some interesting paths to follow.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          // Get a specialist ID for this suggestion
          const specialistId = specialistIds[index % specialistIds.length] || 'nova';
          
          return (
            <motion.button
              key={index}
              className="flex items-start bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg border border-white/10 text-left group"
              onClick={() => onSuggestionClick(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SpecialistAvatar specialistId={specialistId} size="sm" className="mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-white text-sm group-hover:text-indigo-200 transition-colors">
                  {suggestion}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RabbitHoleSuggestions;
