
import React from 'react';
import { ArrowRight, Lightbulb, Compass, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface RabbitHoleSuggestionsProps {
  currentQuestion: string;
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  childAge?: number;
  explorationDepth?: number;
}

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  currentQuestion,
  suggestions,
  onSuggestionClick,
  childAge = 10,
  explorationDepth = 1
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

  // Get exploration message based on depth
  const getExplorationMessage = () => {
    if (explorationDepth <= 1) return "Start your journey of discovery!";
    if (explorationDepth <= 2) return "You're exploring well!";
    if (explorationDepth <= 3) return "You're going deeper!";
    if (explorationDepth <= 5) return "You're a curiosity explorer!";
    return "Amazing depth of exploration!";
  };

  // Group suggestions by theme
  const getThemeIcon = (suggestion: string, index: number) => {
    const lowerSuggestion = suggestion.toLowerCase();
    
    if (lowerSuggestion.includes('why') || lowerSuggestion.includes('how')) {
      return <Compass className="h-4 w-4 mr-2 text-wonderwhiz-bright-pink flex-shrink-0" />;
    } else if (lowerSuggestion.includes('what') || lowerSuggestion.includes('when')) {
      return <Lightbulb className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow flex-shrink-0" />;
    } else {
      return <Sparkles className="h-4 w-4 mr-2 text-wonderwhiz-cyan flex-shrink-0" />;
    }
  };

  return (
    <div className="mt-8 bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-purple/30 border border-white/10 rounded-lg p-4">
      <div className="flex items-center mb-3">
        <Lightbulb className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
        <h3 className="text-lg font-semibold text-white">{getHeaderText()}</h3>
      </div>
      
      {explorationDepth > 1 && (
        <div className="mb-3 bg-white/5 px-3 py-2 rounded border border-white/10">
          <div className="flex items-center text-sm text-white/80">
            <Compass className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
            <span>Exploration Depth: {explorationDepth} • {getExplorationMessage()}</span>
          </div>
        </div>
      )}
      
      <div className={`grid grid-cols-1 ${childAge < 8 ? '' : 'sm:grid-cols-2'} gap-2`}>
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="ghost"
              className={`w-full justify-start text-left bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 ${
                childAge < 8 ? 'py-3 text-base' : ''
              }`}
              onClick={() => onSuggestionClick(suggestion)}
            >
              {getThemeIcon(suggestion, index)}
              <span className="truncate">{suggestion}</span>
              
              {childAge < 8 && (
                <span className="ml-auto text-lg">✨</span>
              )}
            </Button>
          </motion.div>
        ))}
      </div>
      
      {/* For younger kids, add more visual cues */}
      {childAge < 8 && (
        <div className="mt-3 flex justify-center">
          {['🔍', '🌟', '🚀', '🧠', '💫'].map((emoji, i) => (
            <span key={i} className="mx-2 text-xl">{emoji}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default RabbitHoleSuggestions;
