
import React from 'react';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface GeneratingBlockProps {
  isFirstBlock?: boolean;
  animate?: boolean;
}

const GeneratingBlock: React.FC<GeneratingBlockProps> = ({ 
  isFirstBlock = false,
  animate = true
}) => {
  return (
    <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-primary/10 p-4">
      <div className="flex items-center space-x-3">
        <motion.div
          animate={animate ? { rotate: 360 } : {}}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5, 
            ease: "linear" 
          }}
        >
          <Loader2 className="h-5 w-5 text-white/60" />
        </motion.div>
        
        <p className="text-white/80 text-sm">
          {isFirstBlock 
            ? "Generating your personalized learning content..." 
            : "Adding more wonders to explore..."}
        </p>
      </div>
      
      <div className="space-y-2 mt-3">
        <div className="h-4 bg-white/10 animate-pulse rounded-full w-2/3" />
        <div className="h-4 bg-white/10 animate-pulse rounded-full w-3/4" />
        <div className="h-4 bg-white/10 animate-pulse rounded-full w-1/2" />
      </div>
    </Card>
  );
};

export default GeneratingBlock;
