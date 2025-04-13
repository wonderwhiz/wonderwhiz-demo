
import React from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RabbitHoleSuggestionsProps {
  currentQuestion: string;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  childAge?: number;
}

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  currentQuestion,
  suggestions,
  onSuggestionClick,
  childAge = 10
}) => {
  // Get age-appropriate header text
  const getHeaderText = () => {
    if (childAge < 8) {
      return "Want to learn more?";
    } else if (childAge < 13) {
      return "Curious about more?";
    } else {
      return "Explore these related questions:";
    }
  };

  return (
    <div className="mt-8 bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Lightbulb className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
        <h3 className="text-lg font-semibold text-white">{getHeaderText()}</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="justify-start text-left bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10"
            onClick={() => onSuggestionClick(suggestion)}
          >
            <ArrowRight className="h-4 w-4 mr-2 text-wonderwhiz-bright-pink flex-shrink-0" />
            <span className="truncate">{suggestion}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RabbitHoleSuggestions;
