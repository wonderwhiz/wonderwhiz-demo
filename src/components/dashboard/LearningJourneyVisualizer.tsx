import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { TrendingUp, MapPin, Compass, Target } from 'lucide-react';

interface LearningJourneyVisualizerProps {
  childProfile: any;
  patterns: any;
  insights: any[];
}

const LearningJourneyVisualizer: React.FC<LearningJourneyVisualizerProps> = ({
  childProfile,
  patterns,
  insights
}) => {
  const isYoungChild = (childProfile?.age || 10) <= 8;
  const favoriteTopics = patterns?.favoriteTopics || [];
  
  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 border-2 border-purple-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Compass className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          {isYoungChild ? "🗺️ Your Learning Adventure!" : "📍 Your Learning Journey"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {favoriteTopics.slice(0, 3).map((topic, index) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="h-4 w-4 text-purple-500" />
                <span className="font-semibold text-gray-900 capitalize">{topic}</span>
              </div>
              <div className="text-sm text-gray-600">
                {isYoungChild ? "You explored this amazing topic!" : "Deep exploration completed"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {patterns?.averageEngagement > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl border border-green-200">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <div>
              <h3 className="font-bold text-green-800">
                {isYoungChild ? "Super Learning Power!" : "Learning Momentum"}
              </h3>
              <p className="text-green-700 text-sm">
                {isYoungChild 
                  ? `You stay super focused when learning! That's amazing! 🌟`
                  : `Average engagement: ${Math.round(patterns.averageEngagement * 10)}% - Excellent focus!`
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default LearningJourneyVisualizer;