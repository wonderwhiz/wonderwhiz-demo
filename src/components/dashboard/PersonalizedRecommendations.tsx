
import React from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Sparkles, Zap, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface PersonalizedRecommendationsProps {
  childId: string;
  childProfile: any;
  suggestions: string[];
  isLoading: boolean;
  onSuggestionClick: (suggestion: string) => void;
  onRefresh: () => void;
  pastCurios: any[];
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  childId,
  childProfile,
  suggestions,
  isLoading,
  onSuggestionClick,
  onRefresh,
  pastCurios
}) => {
  const isMobile = useIsMobile();
  
  // Get topic type to determine visual style
  const getTopicType = (topic: string): 'science' | 'nature' | 'space' | 'history' | 'animals' | 'general' => {
    const topicLower = topic.toLowerCase();
    if (topicLower.includes('planet') || topicLower.includes('space') || topicLower.includes('star') || 
        topicLower.includes('galaxy') || topicLower.includes('universe')) {
      return 'space';
    } else if (topicLower.includes('animal') || topicLower.includes('dog') || topicLower.includes('cat') || 
               topicLower.includes('bird') || topicLower.includes('fish')) {
      return 'animals';
    } else if (topicLower.includes('history') || topicLower.includes('ancient') || topicLower.includes('war') || 
               topicLower.includes('king') || topicLower.includes('queen')) {
      return 'history';
    } else if (topicLower.includes('plant') || topicLower.includes('tree') || topicLower.includes('flower') || 
               topicLower.includes('forest') || topicLower.includes('nature')) {
      return 'nature';
    } else if (topicLower.includes('science') || topicLower.includes('chemistry') || topicLower.includes('physics') || 
               topicLower.includes('biology') || topicLower.includes('experiment')) {
      return 'science';
    } else {
      return 'general';
    }
  };

  // Get background gradient based on topic type
  const getBackgroundGradient = (type: ReturnType<typeof getTopicType>, index: number) => {
    switch(type) {
      case 'space':
        return 'from-indigo-900/30 to-purple-900/40';
      case 'nature':
        return 'from-emerald-900/30 to-teal-900/40';
      case 'history':
        return 'from-amber-900/30 to-orange-900/40';
      case 'animals':
        return 'from-cyan-900/30 to-blue-900/40';
      case 'science':
        return 'from-pink-900/30 to-rose-900/40';
      default:
        // Rotate through colors for general topics
        switch(index % 5) {
          case 0: return 'from-blue-900/30 to-indigo-900/40';
          case 1: return 'from-emerald-900/30 to-green-900/40';
          case 2: return 'from-pink-900/30 to-purple-900/40';
          case 3: return 'from-orange-900/30 to-amber-900/40';
          case 4: return 'from-cyan-900/30 to-sky-900/40';
          default: return 'from-indigo-900/30 to-purple-900/40';
        }
    }
  };

  const getTopicIcon = (type: ReturnType<typeof getTopicType>) => {
    switch(type) {
      case 'space':
        return '🌌';
      case 'nature':
        return '🌿';
      case 'history':
        return '📜';
      case 'animals':
        return '🦁';
      case 'science':
        return '🧪';
      default:
        return '💡';
    }
  };

  // Get personalized message based on child's interests
  const getPersonalizedMessage = () => {
    if (!childProfile?.interests || childProfile.interests.length === 0) {
      return "Here are some topics we think you'll love exploring";
    }
    
    const randomInterest = childProfile.interests[Math.floor(Math.random() * childProfile.interests.length)];
    return `Since you enjoy ${randomInterest.toLowerCase()}, you might like these:`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-nunito font-semibold text-white flex items-center">
          <Sparkles className="h-5 w-5 text-wonderwhiz-gold mr-2" />
          Discover Something New
        </h2>
        <Button 
          variant="ghost"
          size="sm"
          className="text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => {
            toast.loading("Finding fresh wonders for you...");
            onRefresh();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Surprise Me
        </Button>
      </div>
      
      <p className="text-white/70 mb-4 text-sm">{getPersonalizedMessage()}</p>
      
      <div className={`grid grid-cols-1 ${isMobile ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-3`}>
        {suggestions.slice(0, isMobile ? 2 : 4).map((suggestion, index) => {
          const topicType = getTopicType(suggestion);
          return (
            <motion.div
              key={`suggestion-${index}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
              className={`bg-gradient-to-br ${getBackgroundGradient(topicType, index)} hover:from-white/10 hover:to-white/15 border border-white/10 rounded-lg p-4 cursor-pointer transition-all relative overflow-hidden group`}
              onClick={() => onSuggestionClick(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="absolute top-2 right-2 text-xl opacity-60 group-hover:opacity-100 transition-opacity">
                {getTopicIcon(topicType)}
              </span>
              <div className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Lightbulb className="h-20 w-20 text-white" />
              </div>
              <p className="text-white font-medium font-nunito">{suggestion}</p>
              
              <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="h-3.5 w-3.5 text-wonderwhiz-gold mr-1" />
                <span className="text-xs text-white/80">Click to explore</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default PersonalizedRecommendations;
