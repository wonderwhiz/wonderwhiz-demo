
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, Brain } from 'lucide-react';

interface TopicExplorerProps {
  recentlyViewedTopics: string[];
  strongestTopics: {topic: string, level: number}[];
  onTopicClick: (topic: string) => void;
}

const TopicExplorer: React.FC<TopicExplorerProps> = ({
  recentlyViewedTopics,
  strongestTopics,
  onTopicClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-xl overflow-hidden border-none"
    >
      <Card className="border-white/10 bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-blue-accent/10 overflow-hidden border-none">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-wonderwhiz-gold" />
            Your Brain Power
          </h3>
          
          <div className="space-y-4">
            {recentlyViewedTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Recently Learned</h4>
                <div className="flex flex-wrap gap-2">
                  {recentlyViewedTopics.slice(0, 3).map((topic, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/10 hover:bg-white/20 text-white rounded-full"
                      onClick={() => onTopicClick(`Tell me more about ${topic}`)}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {strongestTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white/70 mb-2">Your Super Powers</h4>
                <div className="flex flex-wrap gap-2">
                  {strongestTopics.slice(0, 3).map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-wonderwhiz-pink/20 border-wonderwhiz-pink/20 hover:bg-wonderwhiz-pink/30 text-white rounded-full"
                      onClick={() => onTopicClick(`Tell me something amazing about ${item.topic}`)}
                    >
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-gold" />
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
