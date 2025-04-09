
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Compass, Sparkles, Lightbulb } from 'lucide-react';
import CurioSuggestion from '@/components/CurioSuggestion';
import TopicExplorer from './TopicExplorer';
import MemoryJourney from './MemoryJourney';
import DailyChallenge from './DailyChallenge';
import ChildDashboardTasks from '@/components/ChildDashboardTasks';

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
}

const SmartDashboard = ({
  childId,
  childProfile,
  curioSuggestions = [],
  isLoadingSuggestions = false,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios = []
}: SmartDashboardProps) => {
  // Add state for managing sparks and streak
  const [sparks] = useState(childProfile?.sparks_balance || 0);
  const [streak] = useState(childProfile?.streak_days || 0);

  // Mock function for topic clicks - will be replaced with actual navigation
  const handleTopicClick = (topicQuery: string) => {
    if (onCurioSuggestionClick) {
      onCurioSuggestionClick(topicQuery);
    }
  };

  // Mock function for curio clicks - will be replaced with actual navigation
  const handleCurioClick = (curio: any) => {
    if (curio && curio.query && onCurioSuggestionClick) {
      onCurioSuggestionClick(curio.query);
    }
  };

  // Make sure curioSuggestions is always an array
  const safeCurioSuggestions = Array.isArray(curioSuggestions) ? curioSuggestions : [];

  // Main content container transition variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Wonder Journey section with curio suggestions */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-wonderwhiz-bright-pink/30 flex items-center justify-center mr-3 shadow-glow-brand-pink">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Wonder Journeys</h2>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10"
            onClick={handleRefreshSuggestions}
            disabled={isLoadingSuggestions}
          >
            <RefreshCw className={`h-5 w-5 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

      {/* Dashboard content - main sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Wonder Path */}
        <motion.div variants={itemVariants}>
          <Card className="bg-transparent border-0 overflow-hidden shadow-none">
            <CardContent className="p-0">
              <TopicExplorer 
                childId={childId} 
                pastCurios={pastCurios}
                onTopicClick={handleTopicClick}
              />
            </CardContent>
          </Card>
        </motion.div>

        {/* Column 2: Time Capsule and Daily Challenge */}
        <div className="space-y-6">
          <motion.div variants={itemVariants}>
            <DailyChallenge 
              childId={childId}
              onComplete={() => console.log('Challenge completed')}
            />
          </motion.div>
          
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
          
          <motion.div 
            variants={itemVariants}
            className="hidden lg:block"
          >
            <ChildDashboardTasks 
              childId={childId} 
              onSparkEarned={(amount) => console.log('Earned', amount, 'sparks')} 
            />
          </motion.div>
        </div>
      </div>

      {/* Magic wand "Ask anything" UI focus element */}
      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        className="flex justify-center pt-8"
      >
        <Button
          variant="ghost"
          size="lg"
          className="bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-bright-pink/20 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-bright-pink/30 text-white border border-white/10 backdrop-blur-sm rounded-full py-6 px-8 shadow-lg group"
          onClick={() => document.querySelector('input[type="text"]')?.focus()}
        >
          <Lightbulb className="h-5 w-5 mr-3 text-wonderwhiz-vibrant-yellow group-hover:animate-pulse-gentle" />
          <span className="text-lg">What are you curious about?</span>
          <div className="ml-3 bg-white/20 rounded-full p-1.5">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SmartDashboard;
