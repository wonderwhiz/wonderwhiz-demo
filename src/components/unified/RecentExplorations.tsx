import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Compass, ArrowRight } from 'lucide-react';

interface RecentExplorationsProps {
  curios: any[];
  topics: any[];
  onCurioClick: (id: string) => void;
  onTopicClick: (id: string) => void;
}

const RecentExplorations: React.FC<RecentExplorationsProps> = ({
  curios,
  topics,
  onCurioClick,
  onTopicClick
}) => {
  const hasContent = curios.length > 0 || topics.length > 0;

  if (!hasContent) return null;

  return (
    <div>
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Continue Your Journey
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Recent Curios */}
        {curios.map((curio, index) => (
          <motion.div
            key={curio.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 bg-white/10 border-white/20 hover:bg-white/20 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />
                  <span className="text-white/60 text-xs">Quick Explore</span>
                </div>
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
              </div>
              
              <h4 className="font-semibold text-white mb-2 group-hover:text-wonderwhiz-bright-pink transition-colors">
                {curio.title}
              </h4>
              
              <p className="text-white/60 text-sm mb-3">
                {new Date(curio.last_updated_at).toLocaleDateString()}
              </p>
              
              <Button
                onClick={() => onCurioClick(curio.id)}
                variant="ghost"
                size="sm"
                className="w-full text-white/70 hover:text-white hover:bg-white/10"
              >
                Continue Exploring
              </Button>
            </Card>
          </motion.div>
        ))}

        {/* Recent Topics */}
        {topics.map((topic, index) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (curios.length + index) * 0.1 }}
          >
            <Card className="p-4 bg-white/10 border-white/20 hover:bg-white/20 transition-all group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-wonderwhiz-bright-pink" />
                  <span className="text-white/60 text-xs">Encyclopedia</span>
                </div>
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
              </div>
              
              <h4 className="font-semibold text-white mb-2 group-hover:text-wonderwhiz-bright-pink transition-colors">
                {topic.title}
              </h4>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="w-full bg-white/10 rounded-full h-1">
                  <div 
                    className="bg-wonderwhiz-bright-pink h-1 rounded-full"
                    style={{ width: `${(topic.current_section / topic.total_sections) * 100}%` }}
                  />
                </div>
                <span className="text-white/60 text-xs">
                  {Math.round((topic.current_section / topic.total_sections) * 100)}%
                </span>
              </div>
              
              <Button
                onClick={() => onTopicClick(topic.id)}
                variant="ghost"
                size="sm"
                className="w-full text-white/70 hover:text-white hover:bg-white/10"
              >
                Continue Learning
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RecentExplorations;
