
import React from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface GeneratingBlockProps {
  isFirstBlock?: boolean;
  animate?: boolean;
}

const GeneratingBlock: React.FC<GeneratingBlockProps> = ({ 
  isFirstBlock = false,
  animate = true
}) => {
  return (
    <Card className="overflow-hidden bg-white/5 backdrop-blur-lg border-primary/10 shadow-md">
      <div className="p-6">
        {isFirstBlock && (
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white/90 mb-1">Creating your wonder</h3>
            <p className="text-white/60 text-sm">Just a moment while I prepare something amazing...</p>
          </div>
        )}
        
        <div className="flex items-center justify-center py-6">
          {animate ? (
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Sparkles size={28} className="text-indigo-400" />
              </motion.div>
              <div className="space-y-2">
                <motion.div 
                  className="h-2 w-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <motion.div 
                  className="h-2 w-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, delay: 0.2, repeat: Infinity }}
                />
                <motion.div 
                  className="h-2 w-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 1.5, delay: 0.4, repeat: Infinity }}
                />
              </div>
            </div>
          ) : (
            <div className="text-white/60">Generating...</div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GeneratingBlock;
