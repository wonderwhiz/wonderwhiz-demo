
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, RefreshCw, Rocket, Sparkles } from 'lucide-react';
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
  curioSuggestions,
  isLoadingSuggestions,
  onCurioSuggestionClick,
  handleRefreshSuggestions,
  pastCurios
}: SmartDashboardProps) => {
  // Add state for managing sparks and streak
  const [sparks, setSparks] = useState(childProfile?.sparks_balance || 0);
  const [streak, setStreak] = useState(childProfile?.streak_days || 0);

  // Update sparks and streak when childProfile changes
  useEffect(() => {
    setSparks(childProfile?.sparks_balance || 0);
    setStreak(childProfile?.streak_days || 0);
  }, [childProfile]);

  // Mock function for topic clicks - will be replaced with actual navigation
  const handleTopicClick = (topicQuery: string) => {
    onCurioSuggestionClick(topicQuery);
  };

  // Mock function for curio clicks - will be replaced with actual navigation
  const handleCurioClick = (curio: any) => {
    if (curio && curio.query) {
      onCurioSuggestionClick(curio.query);
    }
  };

  return (
    <div className="space-y-6">
      {/* Curio suggestions row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {curioSuggestions.slice(0, 3).map((suggestion, index) => (
          <CurioSuggestion
            key={index}
            suggestion={suggestion}
            onClick={() => onCurioSuggestionClick(suggestion)}
            type={getCardTypeForSuggestion(suggestion)}
            loading={isLoadingSuggestions}
            index={index}
            profileId={childId}
          />
        ))}
      </div>

      {/* Dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Brain Power */}
        <Card className="bg-white/5 border-white/10 overflow-hidden">
          <CardContent className="p-0">
            <TopicExplorer 
              childId={childId} 
              pastCurios={pastCurios}
              onTopicClick={handleTopicClick}
            />
          </CardContent>
        </Card>

        {/* Column 2: Tasks and Achievements */}
        <div className="space-y-6">
          <ChildDashboardTasks 
            childId={childId} 
            onSparkEarned={(amount) => console.log('Earned', amount, 'sparks')} 
          />
          
          <DailyChallenge 
            childId={childId}
            onComplete={() => console.log('Challenge completed')}
          />

          <Card className="bg-white/5 border-white/10 overflow-hidden">
            <CardContent className="p-0">
              <MemoryJourney 
                childId={childId} 
                pastCurios={pastCurios}
                onCurioClick={handleCurioClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Refresh button */}
      <div className="flex justify-center pt-3">
        <Button
          variant="outline"
          size="sm"
          className="bg-white/5 text-white/80 hover:bg-white/10 border-white/10"
          onClick={handleRefreshSuggestions}
          disabled={isLoadingSuggestions}
        >
          <RefreshCw className="h-3.5 w-3.5 mr-2" />
          Refresh Suggestions
        </Button>
      </div>
    </div>
  );
};

export default SmartDashboard;
