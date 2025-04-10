
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Star, Activity, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CosmicFlowProps {
  blocks: any[];
  currentBlockIndex: number;
  onNavigate: (index: number) => void;
  ageGroup?: '5-7' | '8-11' | '12-16';
}

const CosmicFlow: React.FC<CosmicFlowProps> = ({
  blocks,
  currentBlockIndex,
  onNavigate,
  ageGroup = '8-11'
}) => {
  const [expanded, setExpanded] = useState(true);
  
  const getIconForBlock = (block: any) => {
    switch(block.type) {
      case 'fact':
        return <Globe className="h-5 w-5" />;
      case 'funFact':
        return <Star className="h-5 w-5" />;
      case 'quiz':
        return <Activity className="h-5 w-5" />;
      case 'creative':
        return <Sparkles className="h-5 w-5" />;
      case 'mindfulness':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };
  
  return (
    <motion.div 
      className={`flex flex-col items-center py-4 ${expanded ? 'mb-8' : 'mb-2'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setExpanded(!expanded)}
        className="mb-2 text-white/70 hover:text-white hover:bg-white/10"
      >
        {expanded ? 'Minimize Journey Map' : 'Show Journey Map'}
      </Button>
      
      {expanded && (
        <div className="relative w-full max-w-2xl overflow-x-auto py-4 px-2">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/20 via-purple-500/40 to-indigo-500/20 transform -translate-y-1/2" />
          
          <div className="relative flex justify-between items-center">
            {blocks.map((block, index) => {
              const isActive = index === currentBlockIndex;
              const isPast = index < currentBlockIndex;
              
              let size = 'w-10 h-10';
              let fontSize = 'text-xs';
              
              if (ageGroup === '5-7') {
                size = 'w-12 h-12';
                fontSize = 'text-sm';
              } else if (ageGroup === '12-16') {
                size = 'w-9 h-9';
                fontSize = 'text-xs';
              }
              
              return (
                <motion.div
                  key={block.id}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: index * 0.1, 
                    duration: 0.3 
                  }}
                >
                  <motion.button
                    className={`${size} rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg shadow-indigo-700/30 ring-2 ring-white/30'
                        : isPast
                        ? 'bg-indigo-800/40 text-white/60'
                        : 'bg-indigo-950/50 text-white/40 hover:bg-indigo-900/60 hover:text-white/70'
                    }`}
                    onClick={() => onNavigate(index)}
                    whileTap={{ scale: 0.95 }}
                  >
                    {getIconForBlock(block)}
                  </motion.button>
                  
                  <span 
                    className={`${fontSize} ${
                      isActive ? 'text-white' : 'text-white/50'
                    } text-center max-w-[60px] line-clamp-1`}
                  >
                    {index + 1}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CosmicFlow;
