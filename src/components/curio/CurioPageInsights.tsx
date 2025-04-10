
import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Braces, MessageCircle } from 'lucide-react';

interface CurioPageInsightsProps {
  difficulty: string;
  blockCount: number;
  learningSummary: string;
}

const CurioPageInsights: React.FC<CurioPageInsightsProps> = ({
  difficulty,
  blockCount,
  learningSummary
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-3 sm:p-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
          <div className="text-xs text-white/60 mb-1">Learning Level</div>
          <div className="text-white font-medium capitalize flex items-center">
            <Brain className="h-4 w-4 mr-1.5 text-wonderwhiz-bright-pink" />
            {difficulty}
          </div>
        </div>
        
        <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
          <div className="text-xs text-white/60 mb-1">Content Blocks</div>
          <div className="text-white font-medium flex items-center">
            <Braces className="h-4 w-4 mr-1.5 text-wonderwhiz-cyan" />
            {blockCount} blocks
          </div>
        </div>
        
        <div className="bg-white/5 rounded-md p-2 sm:p-3 flex flex-col items-center justify-center">
          <div className="text-xs text-white/60 mb-1">Questions</div>
          <div className="text-white font-medium flex items-center">
            <MessageCircle className="h-4 w-4 mr-1.5 text-wonderwhiz-vibrant-yellow" />
            Unlimited
          </div>
        </div>
      </div>
      
      <div className="mt-3 text-white/80 text-xs bg-white/5 p-2 rounded-md">
        {learningSummary || "Learning summary will appear once content is generated."}
      </div>
    </motion.div>
  );
};

export default CurioPageInsights;
