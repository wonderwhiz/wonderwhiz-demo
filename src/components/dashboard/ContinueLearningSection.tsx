import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, BookOpen, Clock } from 'lucide-react';

interface ContinueLearningProps {
  items: Array<{
    title: string;
    progress: number;
    lastAccessed: string;
    type: 'encyclopedia' | 'curio';
  }>;
  childAge: number;
  onContinue: (item: any) => void;
}

const ContinueLearningSection: React.FC<ContinueLearningProps> = ({
  items,
  childAge,
  onContinue
}) => {
  const isYoungChild = childAge <= 8;

  if (items.length === 0) {
    return null;
  }

  const formatLastAccessed = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <PlayCircle className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isYoungChild ? "📚 Continue Your Adventure!" : "📖 Pick Up Where You Left Off"}
        </h2>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card className="p-4 bg-white hover:bg-orange-50 transition-all duration-200 cursor-pointer border-2 border-gray-200 hover:border-orange-300 hover:shadow-lg">
              <div onClick={() => onContinue(item)}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-400 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-gray-500 text-xs">
                          {formatLastAccessed(item.lastAccessed)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1"
                  >
                    {isYoungChild ? "Keep Going!" : "Continue"}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {isYoungChild 
                        ? `${Math.round(item.progress)}% complete! 🌟`
                        : `Progress: ${Math.round(item.progress)}%`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={item.progress} 
                    className="h-2"
                  />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default ContinueLearningSection;