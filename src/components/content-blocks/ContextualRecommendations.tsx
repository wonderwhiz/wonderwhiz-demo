
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb } from 'lucide-react';

interface ContextualRecommendationsProps {
  recommendations: string[];
  onRecommendationClick: (recommendation: string) => void;
}

const ContextualRecommendations: React.FC<ContextualRecommendationsProps> = ({
  recommendations,
  onRecommendationClick
}) => {
  if (!recommendations || recommendations.length === 0) return null;
  
  return (
    <div className="mt-4 pt-4 border-t border-white/10">
      <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center">
        <Lightbulb className="w-3 h-3 mr-1 text-wonderwhiz-gold" />
        <span>Related wonders</span>
      </h4>
      <div className="flex flex-wrap gap-2">
        {recommendations.map((recommendation, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="text-xs bg-white/10 hover:bg-white/20 text-white/80 
                      hover:text-white transition-colors px-3 py-1.5 rounded-full 
                      flex items-center group"
            onClick={() => onRecommendationClick(recommendation)}
          >
            <span className="line-clamp-1">{recommendation}</span>
            <ArrowRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ContextualRecommendations;
