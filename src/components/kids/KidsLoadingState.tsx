import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

interface KidsLoadingStateProps {
  message?: string;
  emoji?: string;
}

const KidsLoadingState: React.FC<KidsLoadingStateProps> = ({ 
  message = "Getting your magical space ready...",
  emoji = "🌟"
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 text-center">
          <div className="text-8xl mb-4 animate-bounce">{emoji}</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {message}
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default KidsLoadingState;