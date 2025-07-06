import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, ArrowRight, Lightbulb } from 'lucide-react';

interface SmartRecommendationsProps {
  suggestions: Array<{
    title: string;
    reason: string;
    difficulty: string;
    estimatedTime: string;
    icon: string;
  }>;
  childAge: number;
  onSelectTopic: (topic: string) => void;
}

const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  suggestions,
  childAge,
  onSelectTopic
}) => {
  const isYoungChild = childAge <= 8;

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-blue-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isYoungChild ? "✨ Perfect For You!" : "🎯 Smart Recommendations"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Card className="p-4 h-full bg-white hover:bg-gray-50 transition-all duration-200 cursor-pointer border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg">
              <div 
                className="h-full flex flex-col"
                onClick={() => onSelectTopic(suggestion.title)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{suggestion.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {suggestion.reason}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className={`px-2 py-1 rounded-full ${
                      suggestion.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-700'
                        : suggestion.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {suggestion.difficulty}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{suggestion.estimatedTime}</span>
                    </div>
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-3 py-1"
                  >
                    {isYoungChild ? "Let's Go!" : "Explore"}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default SmartRecommendations;