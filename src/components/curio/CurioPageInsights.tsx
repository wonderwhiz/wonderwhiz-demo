
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart4, BookOpen, Lightbulb, X, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioPageInsightsProps {
  difficulty: string;
  blockCount: number;
  learningSummary: string;
  showInsights: boolean;
  handleToggleInsights: () => void;
}

const CurioPageInsights: React.FC<CurioPageInsightsProps> = ({
  difficulty,
  blockCount,
  learningSummary,
  showInsights,
  handleToggleInsights
}) => {
  const getDifficultyLabel = () => {
    switch(difficulty) {
      case 'beginner':
        return { text: 'Beginner', color: 'text-emerald-400' };
      case 'advanced':
        return { text: 'Advanced', color: 'text-purple-400' };
      default:
        return { text: 'Intermediate', color: 'text-indigo-400' };
    }
  };
  
  const difficultyInfo = getDifficultyLabel();
  
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 bg-indigo-900/20 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-medium flex items-center">
            <BarChart4 className="h-4 w-4 mr-1.5" />
            <span>Learning Insights</span>
          </h3>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleInsights}
            className="h-7 w-7 rounded-full bg-white/5 hover:bg-white/10 text-white"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div 
            className="bg-white/5 rounded-lg p-3 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center mb-1.5">
              <BookOpen className="h-4 w-4 text-white/70 mr-1.5" />
              <span className="text-white/80 text-sm">Content Blocks</span>
            </div>
            <div className="text-xl font-bold text-white">{blockCount}</div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 rounded-lg p-3 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-1.5">
              <Brain className="h-4 w-4 text-white/70 mr-1.5" />
              <span className="text-white/80 text-sm">Difficulty</span>
            </div>
            <div className={`text-xl font-bold ${difficultyInfo.color}`}>
              {difficultyInfo.text}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white/5 rounded-lg p-3 border border-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center mb-1.5">
              <Lightbulb className="h-4 w-4 text-white/70 mr-1.5" />
              <span className="text-white/80 text-sm">Topics</span>
            </div>
            <div className="text-sm text-white">
              {learningSummary || "Various learning topics"}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default CurioPageInsights;
