
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LearningTopic } from '@/types/wonderwhiz';

interface TopicGridProps {
  topics: LearningTopic[];
  isLoading: boolean;
  onTopicSelect: (topic: LearningTopic) => void;
  childAge: number;
}

const TopicGrid: React.FC<TopicGridProps> = ({ topics, isLoading, onTopicSelect, childAge }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="bg-white/10 backdrop-blur-sm border-white/20 p-6 animate-pulse">
            <div className="h-4 bg-white/20 rounded mb-4"></div>
            <div className="h-3 bg-white/20 rounded mb-2"></div>
            <div className="h-3 bg-white/20 rounded w-2/3"></div>
          </Card>
        ))}
      </div>
    );
  }

  if (topics.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-16 w-16 text-white/40 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">No topics yet!</h3>
        <p className="text-white/70">
          Search for something you're curious about to create your first encyclopedia topic.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Encyclopedia Topics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all duration-200 cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <BookOpen className="h-6 w-6 text-wonderwhiz-bright-pink" />
                {topic.status === 'completed' && (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                )}
              </div>
              
              <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-wonderwhiz-bright-pink transition-colors">
                {topic.title}
              </h3>
              
              {topic.description && (
                <p className="text-white/70 text-sm mb-4 line-clamp-2">
                  {topic.description}
                </p>
              )}
              
              <div className="flex items-center gap-4 text-xs text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{topic.total_sections} sections</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Age {topic.child_age}</span>
                </div>
              </div>
              
              <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                <div 
                  className="bg-wonderwhiz-bright-pink h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(topic.current_section / topic.total_sections) * 100}%` }}
                />
              </div>
              
              <Button
                onClick={() => onTopicSelect(topic)}
                className="w-full bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white"
                size="sm"
              >
                {topic.current_section === 0 ? 'Start Reading' : 'Continue Reading'}
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopicGrid;
