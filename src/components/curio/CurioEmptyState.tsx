
import React from 'react';
import { motion } from 'framer-motion';
import { Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-12 text-center"
    >
      <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-white/40" />
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2 font-nunito">No wonders found</h3>
      
      <p className="text-white/60 max-w-md mb-6">
        We couldn't find any content for this exploration. Try searching for something specific or explore a new topic.
      </p>
      
      <Button 
        variant="default"
        onClick={() => window.location.reload()}
        className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple hover:opacity-90"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        <span>Try again</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
