
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';

interface BlockDecoratorProps {
  type: ContentBlockType;
  children: React.ReactNode;
  className?: string;
  specialistId?: string;
  childAge?: number;
}

const BlockDecorator: React.FC<BlockDecoratorProps> = ({
  type,
  children,
  className,
  specialistId,
  childAge = 10
}) => {
  // Get accent color based on block type
  const getAccentColor = () => {
    switch (type) {
      case 'fact':
        return 'from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30';
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30';
      case 'creative':
        return 'from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30';
      case 'mindfulness':
        return 'from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30';
      case 'funFact':
        return 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30';
      default:
        return 'from-wonderwhiz-blue/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl shadow-lg backdrop-blur-sm border p-5',
        `bg-gradient-to-br ${getAccentColor()}`,
        'hover:shadow-xl transition-all duration-300',
        className
      )}
    >
      <div className="relative">
        {/* Decorative accent line */}
        <div className={cn(
          "absolute -left-5 top-0 bottom-0 w-1 rounded-full",
          type === 'fact' ? 'bg-wonderwhiz-cyan' :
          type === 'quiz' ? 'bg-wonderwhiz-bright-pink' :
          type === 'creative' ? 'bg-wonderwhiz-green' :
          type === 'mindfulness' ? 'bg-wonderwhiz-purple' :
          type === 'funFact' ? 'bg-wonderwhiz-vibrant-yellow' :
          'bg-wonderwhiz-blue'
        )} />
        
        {children}
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
