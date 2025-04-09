
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Sparkles, BookOpen, Rocket, Brain, Star } from 'lucide-react';
import CurioSuggestion from '@/components/CurioSuggestion';
import { useChildLearningHistory } from '@/hooks/useChildLearningHistory';
import MemoryJourney from './MemoryJourney';
import TopicExplorer from './TopicExplorer';

interface SmartDashboardProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  isLoadingSuggestions: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  handleRefreshSuggestions: () => void;
  pastCurios: any[];
  selectedCategory?: string | null;
}

const SmartDashboard: React.FC<SmartDashboardProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios,
  selectedCategory
}) => {
  const [displayedSuggestions, setDisplayedSuggestions] = useState<string[]>([]);
  const [showMemorySuggestions, setShowMemorySuggestions] = useState(false);
  
  const {
    recentlyViewedTopics,
    strongestTopics,
    getPersonalizedSuggestions,
    isLoading: isLoadingHistory
  } = useChildLearningHistory(childId);
  
  useEffect(() => {
    let suggestions = [...curioSuggestions];
    
    if (pastCurios.length > 5) {
      const personalizedSuggestions = getPersonalizedSuggestions();
      
      const blendedSuggestions: string[] = [];
      const maxLength = Math.max(suggestions.length, personalizedSuggestions.length);
      
      for (let i = 0; i < maxLength; i++) {
        if (i < personalizedSuggestions.length) {
          blendedSuggestions.push(personalizedSuggestions[i]);
        }
        if (i < suggestions.length) {
          blendedSuggestions.push(suggestions[i]);
        }
      }
      
      suggestions = blendedSuggestions.slice(0, 8);
    }
    
    if (selectedCategory && selectedCategory !== 'all') {
      const categoryKeywords: Record<string, string[]> = {
        'space': ['space', 'planet', 'star', 'galaxy', 'moon', 'astronaut', 'rocket', 'orbit', 'universe'],
        'animals': ['animal', 'pet', 'wild', 'cat', 'dog', 'bird', 'fish', 'insect', 'reptile', 'mammal'],
        'science': ['science', 'experiment', 'chemical', 'atom', 'molecule', 'energy', 'research', 'lab']
      };
      
      const keywords = categoryKeywords[selectedCategory] || [];
      suggestions = suggestions.filter(suggestion => 
        keywords.some(keyword => suggestion.toLowerCase().includes(keyword))
      );
      
      const generalSuggestions: Record<string, string[]> = {
        'space': [
          'How big is the universe?',
          'What is a black hole?',
          'How many planets are there?',
          'Why does the moon change shape?'
        ],
        'animals': [
          'What is the fastest animal?',
          'How do animals communicate?',
          'Why do some animals hibernate?',
          'How do birds know where to fly?'
        ],
        'science': [
          'How do magnets work?',
          'What are atoms made of?',
          'How do plants grow from seeds?',
          'What is electricity?'
        ]
      };
      
      suggestions = [
        ...suggestions, 
        ...generalSuggestions[selectedCategory] || []
      ].slice(0, 8);
    }
    
    setDisplayedSuggestions(suggestions);
  }, [curioSuggestions, pastCurios.length, selectedCategory, getPersonalizedSuggestions]);
  
  const getMemorySuggestions = () => {
    const now = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
    
    const oldCurios = pastCurios.filter(curio => {
      const curioDate = new Date(curio.created_at);
      return curioDate < threeMonthsAgo;
    });
    
    if (oldCurios.length === 0) {
      return [
        "You haven't explored with me that long ago yet!",
        "We'll remember what you learn for many months",
        "Keep exploring and we'll help you revisit topics later"
      ];
    }
    
    return oldCurios.slice(0, 5).map(curio => 
      `Remember when you asked about ${curio.title}? Let's explore more!`
    );
  };
  
  const toggleMemorySuggestions = () => {
    setShowMemorySuggestions(!showMemorySuggestions);
  };
  
  return (
    <div className="space-y-6 mt-6">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 rounded-xl bg-gradient-to-r from-wonderwhiz-purple/30 to-wonderwhiz-bright-pink/20 mb-6"
      >
        <h2 className="text-xl md:text-2xl font-bold text-white text-center mb-1">
          {childProfile?.name ? `Hey ${childProfile.name}!` : 'Hey explorer!'}
        </h2>
        <p className="text-white/80 text-center text-sm md:text-base">
          What would you like to discover today?
        </p>
      </motion.div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <Star className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
              {showMemorySuggestions ? "Remember These?" : "Wonder Sparks"}
            </h3>
            {pastCurios.length > 5 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white/70 hover:text-white hover:bg-white/10"
                onClick={toggleMemorySuggestions}
              >
                {showMemorySuggestions ? "Show New Ideas" : "From Your Memory"}
              </Button>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-wonderwhiz-gold transition-colors" 
            onClick={handleRefreshSuggestions} 
            disabled={isLoadingSuggestions}
          >
            <motion.div 
              animate={isLoadingSuggestions ? { rotate: 360 } : {}} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
              className={isLoadingSuggestions ? "animate-spin" : ""}
            >
              <RefreshCw className="h-5 w-5" />
            </motion.div>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {(showMemorySuggestions ? getMemorySuggestions() : displayedSuggestions)
            .slice(0, 6) // Only show 6 suggestions to simplify UI for children
            .map((suggestion, index) => (
              <CurioSuggestion 
                key={`${suggestion}-${index}`} 
                suggestion={suggestion} 
                onClick={onCurioSuggestionClick} 
                index={index} 
                directGenerate={!suggestion.includes("You haven't explored")}
                profileId={childId}
              />
            ))}
        </div>
      </div>
      
      {pastCurios.length > 7 && !isLoadingHistory && (
        <TopicExplorer 
          recentlyViewedTopics={recentlyViewedTopics}
          strongestTopics={strongestTopics}
          onTopicClick={onCurioSuggestionClick}
        />
      )}
    </div>
  );
};

export default SmartDashboard;
