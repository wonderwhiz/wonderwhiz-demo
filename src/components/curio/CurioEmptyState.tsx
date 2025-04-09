
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 rounded-full bg-wonderwhiz-bright-pink/20 blur-xl animate-pulse"></div>
        <div className="relative flex items-center justify-center h-full">
          <Lightbulb className="h-16 w-16 text-wonderwhiz-gold" />
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Ready to Explore!</h3>
      <p className="text-white/70 max-w-md text-center">
        This appears to be an empty curio. Ask a question to generate content or try refreshing the page.
      </p>
    </motion.div>
  );
};

export default CurioEmptyState;
