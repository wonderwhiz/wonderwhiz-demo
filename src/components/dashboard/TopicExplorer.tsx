
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Brain } from 'lucide-react';

interface TopicExplorerProps {
  childId?: string;
  pastCurios?: any[];
  recentlyViewedTopics?: string[];
  strongestTopics?: {topic: string, level: number}[];
  onTopicClick?: (topic: string) => void;
}

const TopicExplorer: React.FC<TopicExplorerProps> = ({
  childId,
  pastCurios = [],
  recentlyViewedTopics = [],
  strongestTopics = [],
  onTopicClick = () => {}
}) => {
  // Extract topics from past curios if recentlyViewedTopics wasn't provided
  const displayTopics = recentlyViewedTopics && recentlyViewedTopics.length > 0 
    ? recentlyViewedTopics 
    : (pastCurios || [])
      ?.slice(0, 5)
      ?.map(curio => curio?.title || '')
      ?.filter(Boolean) || [];
  
  // Create default strongestTopics if none provided
  const displayStrongestTopics = strongestTopics && strongestTopics.length > 0 
    ? strongestTopics 
    : [
        { topic: 'Space', level: 3 },
        { topic: 'Animals', level: 2 },
        { topic: 'Science', level: 1 }
      ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl overflow-hidden border-none"
    >
      <Card className="border-none bg-gradient-to-br from-wonderwhiz-purple/30 to-wonderwhiz-blue-accent/20 overflow-hidden shadow-lg">
        <CardContent className="p-5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-wonderwhiz-vibrant-yellow" />
            Your Wonder Powers
          </h3>
          
          <div className="space-y-5">
            {displayTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-3">Recently Explored</h4>
                <div className="flex flex-wrap gap-2.5">
                  {displayTopics.slice(0, 3).map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-full shadow-md transition-all duration-300 hover:scale-105"
                      onClick={() => onTopicClick(`Tell me more about ${topic}`)}
                    >
                      <BookOpen className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-cyan" />
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {displayStrongestTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-3">Your Super Powers</h4>
                <div className="flex flex-wrap gap-2.5">
                  {displayStrongestTopics.slice(0, 3).map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-wonderwhiz-bright-pink/30 border-wonderwhiz-bright-pink/30 hover:bg-wonderwhiz-bright-pink/40 text-white rounded-full shadow-md transition-all duration-300 hover:scale-105"
                      onClick={() => onTopicClick(`Tell me something amazing about ${item.topic}`)}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-gold animate-pulse-gentle" />
                      {item.topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TopicExplorer;
