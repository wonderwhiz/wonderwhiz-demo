
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import AnimatedCurioCard from './AnimatedCurioCard';
import TopicExplorer from './TopicExplorer';
import MemoryJourney from './MemoryJourney';
import { Sparkles } from 'lucide-react';

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
  // Get recently viewed topics based on past curios
  const getRecentlyViewedTopics = () => {
    const topics = new Set<string>();
    pastCurios.slice(0, 15).forEach(curio => {
      const title = curio.title || '';
      const words = title.split(' ').filter(word => word.length > 3);
      words.forEach(word => {
        if (word.length > 3 && !['about', 'what', 'when', 'where', 'which', 'with', 'tell'].includes(word.toLowerCase())) {
          topics.add(word);
        }
      });
    });
    return Array.from(topics).slice(0, 5);
  };

  // Get topics child is strongest in based on learning history
  // This would ideally come from a backend call using the learning_history table
  const getStrongestTopics = () => {
    const topicMap = new Map<string, number>();
    pastCurios.forEach(curio => {
      const title = curio.title || '';
      const mainTopic = title.split(' ').find(word => 
        word.length > 3 && !['about', 'what', 'when', 'where', 'which', 'with', 'tell'].includes(word.toLowerCase())
      );
      if (mainTopic) {
        topicMap.set(mainTopic, (topicMap.get(mainTopic) || 0) + 1);
      }
    });
    
    return Array.from(topicMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic, count]) => ({
        topic,
        level: Math.min(10, count * 2)
      }));
  };

  // Get curio type based on title for visual categorization
  const getCurioType = (title: string) => {
    title = title.toLowerCase();
    if (title.includes('space') || title.includes('planet') || title.includes('star') || title.includes('universe')) return 'space';
    if (title.includes('animal') || title.includes('whale') || title.includes('dolphin') || title.includes('fish')) return 'animals';
    if (title.includes('science') || title.includes('volcan') || title.includes('experiment')) return 'science';
    if (title.includes('history') || title.includes('ancient') || title.includes('dinosaur') || title.includes('past')) return 'history';
    if (title.includes('robot') || title.includes('technology') || title.includes('tech') || title.includes('computer')) return 'technology';
    return 'general';
  };

  const recentlyViewedTopics = getRecentlyViewedTopics();
  const strongestTopics = getStrongestTopics();

  return (
    <div className="space-y-6">
      {/* Curio Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {curioSuggestions.slice(0, 3).map((suggestion, index) => (
            <AnimatedCurioCard
              key={index}
              title={suggestion}
              onClick={() => onCurioSuggestionClick(suggestion)}
              index={index}
              type={getCurioType(suggestion)}
            />
          ))}
        </div>
      </motion.div>

      {/* Personal Learning Journey Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Brain Power - Topics explorer */}
        <TopicExplorer
          recentlyViewedTopics={recentlyViewedTopics}
          strongestTopics={strongestTopics}
          onTopicClick={(topic) => onCurioSuggestionClick(topic)}
        />

        {/* Memory Journey */}
        <MemoryJourney
          pastCurios={pastCurios}
          onCurioClick={(curio) => onCurioSuggestionClick(curio.query || `Tell me about ${curio.title}`)}
        />
      </div>
    </div>
  );
};

export default SmartDashboard;
