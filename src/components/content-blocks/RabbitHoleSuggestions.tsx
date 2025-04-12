
import React, { useState, useEffect } from 'react';
import { Sparkles, Search } from 'lucide-react';
import SpecialistAvatar from '../SpecialistAvatar';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  useEffect(() => {
    if (curioTitle) {
      // These are hardcoded suggestions based on the curio title
      // In a real implementation, you might generate these dynamically or fetch from an API
      const generateSuggestions = () => {
        const baseSuggestions = [
          `What causes ${curioTitle}?`,
          `How does ${curioTitle} work?`,
          `What are the most interesting facts about ${curioTitle}?`,
          `What's the history of ${curioTitle}?`,
          `How does ${curioTitle} impact our daily lives?`,
          `What are the future developments in ${curioTitle}?`
        ];
        
        // Shuffle and take 3-5 suggestions
        return baseSuggestions
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 3);
      };
      
      setSuggestions(generateSuggestions());
    }
  }, [curioTitle]);
  
  if (!suggestions.length) return null;
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-5 border border-white/10 mb-8">
      <div className="flex items-center mb-4">
        <div className="h-7 w-7 rounded-full bg-indigo-500/30 flex items-center justify-center mr-3">
          <Sparkles className="h-4 w-4 text-indigo-300" />
        </div>
        <h3 className="text-lg font-medium text-white">Continue your exploration</h3>
      </div>
      
      <p className="text-white/70 text-sm mb-4">
        Curious about related topics? Explore these questions to discover more!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          // Pick a specialist ID for this suggestion based on the available ones
          const specialistId = specialistIds.length > 0 
            ? specialistIds[index % specialistIds.length] 
            : 'nova';
            
          return (
            <button
              key={index}
              className="flex items-center p-3 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg border border-indigo-500/20 transition-colors text-left group"
              onClick={() => onSuggestionClick(suggestion)}
            >
              <SpecialistAvatar specialistId={specialistId} size="sm" className="mr-2 flex-shrink-0" />
              <span className="text-white text-sm">{suggestion}</span>
              <Search className="h-4 w-4 ml-auto text-white/40 group-hover:text-white/70 transition-colors flex-shrink-0" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RabbitHoleSuggestions;
