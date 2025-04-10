
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Compass, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CurioSuggestion from '@/components/CurioSuggestion';
import TopicExplorer from './TopicExplorer';
import MemoryJourney from './MemoryJourney';

type CardType = 'space' | 'animals' | 'science' | 'history' | 'technology' | 'general';

// Helper function to determine card type from suggestion
const getCardTypeForSuggestion = (suggestion: string): CardType => {
  suggestion = suggestion.toLowerCase();
  if (suggestion.includes('space')) return 'space';
  if (suggestion.includes('animal')) return 'animals';
  if (suggestion.includes('science')) return 'science';
  if (suggestion.includes('history')) return 'history';
  if (suggestion.includes('technology')) return 'technology';
  return 'general';
};

interface SmartDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions = [],
  isLoadingSuggestions = false,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios = []
}) => {
  // Handle topic click
  const handleTopicClick = (topicQuery: string) => {
    if (onCurioSuggestionClick) {
      onCurioSuggestionClick(topicQuery);
    }
  };

  // Handle curio click
  const handleCurioClick = (curio: any) => {
    if (curio && curio.query && onCurioSuggestionClick) {
      onCurioSuggestionClick(curio.query);
    }
  };

  // Make sure curioSuggestions is always an array
  const safeCurioSuggestions = Array.isArray(curioSuggestions) ? curioSuggestions : [];

  // Main container animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.4 }
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Wonder Journeys Section - Simplified */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3">
              <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />
            </div>
            <h2 className="text-xl font-bold text-white font-nunito">Wonder Journeys</h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/5 hover:bg-white/10 text-white rounded-full h-8 w-8"
            onClick={handleRefreshSuggestions}
            disabled={isLoadingSuggestions}
          >
            <RefreshCw className={`h-4 w-4 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {safeCurioSuggestions.slice(0, 3).map((suggestion, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="h-full"
            >
              <CurioSuggestion
                suggestion={suggestion}
                onClick={() => onCurioSuggestionClick(suggestion)}
                type={getCardTypeForSuggestion(suggestion)}
                loading={isLoadingSuggestions}
                index={index}
                profileId={childId}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main Dashboard content - simplified to 2 main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Explorer */}
        <motion.div variants={itemVariants}>
          <TopicExplorer 
            childId={childId} 
            pastCurios={pastCurios}
            onTopicClick={handleTopicClick}
          />
        </motion.div>

        {/* Memory Journey */}
        <motion.div variants={itemVariants}>
          <Card className="bg-transparent border-0 overflow-hidden shadow-none">
            <CardContent className="p-0">
              <MemoryJourney 
                childId={childId} 
                pastCurios={pastCurios}
                onCurioClick={handleCurioClick}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* "Ask anything" centered prompt - simplified */}
      <motion.div 
        variants={itemVariants}
        className="flex justify-center pt-6"
      >
        <Button
          variant="ghost"
          size="lg"
          className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full py-5 px-6"
          onClick={() => {
            const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
            if (inputElement) inputElement.focus();
          }}
        >
          <Lightbulb className="h-4 w-4 mr-2 text-wonderwhiz-vibrant-yellow" />
          <span className="text-base">Ask me anything</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SmartDashboard;
