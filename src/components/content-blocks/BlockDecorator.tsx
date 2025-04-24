
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import BlockAccent from './BlockAccent';

interface BlockDecoratorProps {
  type: ContentBlockType;
  children: React.ReactNode;
  className?: string;
  specialistId?: string;
  childAge?: number;
  accentVisible?: boolean;
}

const BlockDecorator: React.FC<BlockDecoratorProps> = ({
  type,
  children,
  className,
  specialistId,
  childAge = 10,
  accentVisible = true
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
      case 'news':
        return 'from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue-accent/30';
      case 'riddle':
        return 'from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30';
      case 'activity':
        return 'from-wonderwhiz-green/20 to-wonderwhiz-blue/20 border-wonderwhiz-green/30';
      case 'task':
        return 'from-wonderwhiz-orange/20 to-wonderwhiz-vibrant-yellow/20 border-wonderwhiz-orange/30';
      case 'flashcard':
        return 'from-wonderwhiz-blue/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue/30';
      default:
        return 'from-wonderwhiz-blue/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue/30';
    }
  };

  const getHoverAnimation = () => {
    if (childAge <= 7) {
      return 'hover:scale-102 hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300';
    }
    if (childAge <= 11) {
      return 'hover:-translate-y-0.5 hover:shadow-xl transition-transform duration-200';
    }
    return 'hover:shadow-lg transition-shadow duration-150';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl shadow-lg backdrop-blur-sm border p-5 relative',
        `bg-gradient-to-br ${getAccentColor()}`,
        getHoverAnimation(),
        className
      )}
      role="article"
      aria-label={`${type} content block`}
    >
      {accentVisible && <BlockAccent type={type} specialistId={specialistId} childAge={childAge} />}
      
      <div className="relative">
        {/* Decorative accent line based on block type */}
        <div className={cn(
          "absolute -left-5 top-0 bottom-0 w-1 rounded-full opacity-80",
          type === 'fact' ? 'bg-wonderwhiz-cyan' :
          type === 'quiz' ? 'bg-wonderwhiz-bright-pink' :
          type === 'creative' ? 'bg-wonderwhiz-green' :
          type === 'mindfulness' ? 'bg-wonderwhiz-purple' :
          type === 'funFact' ? 'bg-wonderwhiz-vibrant-yellow' :
          type === 'news' ? 'bg-wonderwhiz-blue-accent' :
          type === 'riddle' ? 'bg-wonderwhiz-purple' :
          type === 'activity' ? 'bg-wonderwhiz-green' :
          type === 'task' ? 'bg-wonderwhiz-orange' :
          type === 'flashcard' ? 'bg-wonderwhiz-blue' :
          'bg-wonderwhiz-blue'
        )} />
        
        {children}
      </div>
    </motion.div>
  );
};

export default BlockDecorator;

