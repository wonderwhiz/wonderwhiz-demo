
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Compass, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TopicExplorer from './TopicExplorer';
import MemoryJourney from './MemoryJourney';
import DynamicWonderSuggestions from './DynamicWonderSuggestions';

type CardType = 'space' | 'animals' | 'science' | 'history' | 'technology' | 'general';

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
  // Add the missing props to fix the type error
  onLike?: (blockId: string) => Promise<boolean>;
  onBookmark?: (blockId: string) => Promise<boolean>;
  onReply?: (blockId: string, message: string) => Promise<boolean>;
  onReadAloud?: (text: string) => () => void;
  likedBlocks?: Record<string, boolean>;
  bookmarkedBlocks?: Record<string, boolean>;
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions = [],
  isLoadingSuggestions = false,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios = [],
  // Include the new props in the function parameters with defaults
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  likedBlocks = {},
  bookmarkedBlocks = {}
}) => {
  const handleTopicClick = (topicQuery: string) => {
    onCurioSuggestionClick(topicQuery);
  };

  const handleCurioClick = (curio: any) => {
    if (curio && curio.query) {
      onCurioSuggestionClick(curio.query);
    }
  };

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
      <motion.div variants={itemVariants} className="mb-8">
        <DynamicWonderSuggestions
          childId={childId}
          suggestions={curioSuggestions}
          childInterests={childProfile?.interests || ["science", "space", "animals"]}
          childAge={childProfile?.age || 10}
          isLoading={isLoadingSuggestions}
          onSuggestionClick={onCurioSuggestionClick}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <TopicExplorer 
            childId={childId} 
            pastCurios={pastCurios}
            onTopicClick={handleTopicClick}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-transparent border-0 overflow-hidden shadow-none">
            <CardContent className="p-0">
              <MemoryJourney 
                childId={childId} 
                pastCurios={pastCurios}
                onCurioClick={curio => onCurioSuggestionClick(curio.query || curio.title)}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        variants={itemVariants}
        className="flex justify-center pt-6"
      >
        <Button
          variant="ghost"
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
