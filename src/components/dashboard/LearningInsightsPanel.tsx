import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, Brain, Star, Target } from 'lucide-react';

interface LearningInsightsProps {
  insights: Array<{
    id: string;
    title: string;
    description: string;
    type: 'strength' | 'interest' | 'recommendation' | 'achievement';
    confidence: number;
    icon: string;
  }>;
  childAge: number;
}

const LearningInsightsPanel: React.FC<LearningInsightsProps> = ({
  insights,
  childAge
}) => {
  const isYoungChild = childAge <= 8;

  const getInsightStyle = (type: string) => {
    switch (type) {
      case 'strength':
        return 'from-green-100 to-emerald-100 border-green-200';
      case 'achievement':
        return 'from-yellow-100 to-orange-100 border-yellow-200';
      case 'recommendation':
        return 'from-purple-100 to-pink-100 border-purple-200';
      default:
        return 'from-blue-100 to-indigo-100 border-blue-200';
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'achievement':
        return <Star className="h-4 w-4 text-yellow-600" />;
      case 'recommendation':
        return <Target className="h-4 w-4 text-purple-600" />;
      default:
        return <Brain className="h-4 w-4 text-blue-600" />;
    }
  };

  if (insights.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isYoungChild ? "🧠 About You!" : "📊 Learning Insights"}
        </h2>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-2xl bg-gradient-to-r border-2 ${getInsightStyle(insight.type)}`}
          >
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{insight.icon}</span>
                {getInsightIcon(insight.type)}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1">
                  {insight.title}
                </h3>
                <p className="text-gray-700 text-sm">
                  {insight.description}
                </p>
                {!isYoungChild && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                          style={{ width: `${insight.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {Math.round(insight.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default LearningInsightsPanel;