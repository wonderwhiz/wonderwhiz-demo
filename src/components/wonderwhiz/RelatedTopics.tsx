
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Sparkles, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface RelatedTopicsProps {
  currentTopic: LearningTopic;
  childAge: number;
  childProfile: any;
  onNewTopicSelected: () => void;
}

const RelatedTopics: React.FC<RelatedTopicsProps> = ({
  currentTopic,
  childAge,
  childProfile,
  onNewTopicSelected
}) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // Generate related topics based on the current topic
  const generateRelatedTopics = (topicTitle: string) => {
    const baseTopics = [
      `How ${topicTitle} affects our daily life`,
      `Amazing discoveries about ${topicTitle}`,
      `The history and future of ${topicTitle}`,
      `Fun experiments with ${topicTitle}`,
      `Famous scientists who studied ${topicTitle}`
    ];

    return baseTopics.map((topic, index) => ({
      id: `related-${index}`,
      title: topic,
      description: `Dive deeper into this fascinating aspect!`,
      difficulty: childAge <= 8 ? 'Easy' : childAge <= 12 ? 'Medium' : 'Advanced',
      estimatedTime: `${Math.floor(Math.random() * 10) + 15} minutes`,
      funFacts: Math.floor(Math.random() * 5) + 3
    }));
  };

  const relatedTopics = generateRelatedTopics(currentTopic.title);

  const handleTopicSelect = (topicTitle: string) => {
    setSelectedTopic(topicTitle);
    // In a real implementation, this would create a new learning topic
    setTimeout(() => {
      onNewTopicSelected();
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Target className="h-8 w-8 text-wonderwhiz-bright-pink" />
            <h2 className="text-2xl font-bold text-white">
              {childAge <= 8 ? "More Fun Adventures! 🚀" : "Continue Your Learning Journey 📚"}
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </div>
          <p className="text-white/80 max-w-2xl mx-auto">
            {childAge <= 8 
              ? `Great job learning about ${currentTopic.title}! Here are more exciting topics to explore:`
              : `You've mastered ${currentTopic.title}! Ready to explore these related fascinating topics?`
            }
          </p>
        </div>

        {/* Achievement Summary */}
        <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30 p-6 mb-8">
          <div className="flex items-center justify-center gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-yellow-400">🏆</div>
              <p className="text-white/80 text-sm">Topic Completed</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">+50</div>
              <p className="text-white/80 text-sm">Wonder Points</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">⭐</div>
              <p className="text-white/80 text-sm">Learning Star</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">🎯</div>
              <p className="text-white/80 text-sm">Knowledge Target</p>
            </div>
          </div>
        </Card>

        {/* Related Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {relatedTopics.map((topic, index) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 h-full hover:bg-white/15 transition-all cursor-pointer group">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-wonderwhiz-bright-pink/20 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-wonderwhiz-bright-pink" />
                  </div>
                  <div className="flex-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                      topic.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                      topic.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {topic.difficulty}
                    </span>
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-3 group-hover:text-wonderwhiz-bright-pink transition-colors">
                  {topic.title}
                </h3>
                
                <p className="text-white/70 text-sm mb-4">
                  {topic.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>⏱️</span>
                    <span>{topic.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <span>🤯</span>
                    <span>{topic.funFacts} mind-blowing facts</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleTopicSelect(topic.title)}
                  disabled={selectedTopic === topic.title}
                  className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 group-hover:scale-105 transition-transform"
                >
                  {selectedTopic === topic.title ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      {childAge <= 8 ? "Let's Learn!" : "Start Learning"}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button
            onClick={onNewTopicSelected}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10"
          >
            {childAge <= 8 ? "Pick a Different Topic 🎲" : "Start Fresh Topic Search 🔍"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RelatedTopics;
