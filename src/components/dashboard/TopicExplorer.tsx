
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Brain, Compass, Star } from 'lucide-react';

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
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-xl overflow-hidden"
    >
      <Card className="border-none bg-white/5 backdrop-blur-md overflow-hidden shadow-2xl">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
            <div className="w-10 h-10 rounded-full bg-wonderwhiz-bright-pink/30 flex items-center justify-center mr-3 shadow-glow-brand-pink">
              <Brain className="h-5 w-5 text-white" />
            </div>
            Your Wonder Path
          </h3>
          
          <div className="space-y-6">
            {displayTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-4 flex items-center">
                  <Compass className="h-4 w-4 mr-2 text-wonderwhiz-cyan" />
                  <span>Continue Your Journey</span>
                </h4>
                
                <div className="relative">
                  {/* Journey path line */}
                  <div className="absolute left-4 top-2 bottom-0 w-0.5 bg-gradient-to-b from-wonderwhiz-cyan to-wonderwhiz-bright-pink/50 z-0"></div>
                  
                  <div className="space-y-4 z-10 relative">
                    {displayTopics.slice(0, 3).map((topic, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        className="pl-10 relative"
                        whileHover={{ x: 5 }}
                      >
                        {/* Topic node */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-wonderwhiz-cyan flex items-center justify-center z-10">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse-gentle"></div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full justify-start bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg p-3 transition-all duration-300 shadow-md hover:shadow-lg"
                          onClick={() => onTopicClick(`Tell me more about ${topic}`)}
                        >
                          <span className="text-base font-medium">{topic}</span>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {displayStrongestTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-white mb-4 flex items-center">
                  <Star className="h-4 w-4 mr-2 text-wonderwhiz-gold" />
                  <span>Your Superpowers</span>
                </h4>
                
                <div className="grid grid-cols-3 gap-4">
                  {displayStrongestTopics.slice(0, 3).map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                      className="relative"
                    >
                      <Button
                        variant="ghost"
                        className="w-full h-full aspect-square flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-wonderwhiz-gold/20 to-wonderwhiz-bright-pink/20 backdrop-blur-sm hover:from-wonderwhiz-gold/30 hover:to-wonderwhiz-bright-pink/30 border border-white/10 rounded-lg p-3 text-white"
                        onClick={() => onTopicClick(`Tell me something amazing about ${item.topic}`)}
                      >
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mb-1">
                          <Sparkles className="h-6 w-6 text-wonderwhiz-gold animate-pulse-gentle" />
                        </div>
                        <span className="text-sm font-medium">{item.topic}</span>
                        <div className="flex mt-1">
                          {Array.from({ length: item.level }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-wonderwhiz-gold" />
                          ))}
                          {Array.from({ length: 3 - item.level }).map((_, i) => (
                            <Star key={i + item.level} className="h-3 w-3 text-white/20" />
                          ))}
                        </div>
                      </Button>
                    </motion.div>
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
