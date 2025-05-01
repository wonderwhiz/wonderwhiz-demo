
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
  const getAccentColor = () => {
    switch (type) {
      case 'fact':
        return 'from-wonderwhiz-cyan/30 via-wonderwhiz-cyan/15 to-transparent border-wonderwhiz-cyan/40';
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/30 via-wonderwhiz-bright-pink/15 to-transparent border-wonderwhiz-bright-pink/40';
      case 'creative':
        return 'from-wonderwhiz-green/30 via-wonderwhiz-green/15 to-transparent border-wonderwhiz-green/40';
      case 'mindfulness':
        return 'from-wonderwhiz-purple/30 via-wonderwhiz-purple/15 to-transparent border-wonderwhiz-purple/40';
      case 'funFact':
        return 'from-wonderwhiz-vibrant-yellow/30 via-wonderwhiz-vibrant-yellow/15 to-transparent border-wonderwhiz-vibrant-yellow/40';
      default:
        return 'from-wonderwhiz-blue/30 via-wonderwhiz-blue/15 to-transparent border-wonderwhiz-blue/40';
    }
  };

  const getInnerGlow = () => {
    switch (type) {
      case 'fact': return 'inset 0 0 30px 5px rgba(0,226,255,0.1)';
      case 'quiz': return 'inset 0 0 30px 5px rgba(255,91,163,0.1)';
      case 'creative': return 'inset 0 0 30px 5px rgba(0,214,143,0.1)';
      case 'funFact': return 'inset 0 0 30px 5px rgba(255,213,79,0.1)';
      case 'mindfulness': return 'inset 0 0 30px 5px rgba(126,48,225,0.1)';
      default: return 'inset 0 0 30px 5px rgba(0,157,255,0.1)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl backdrop-blur-lg border p-6 relative overflow-hidden',
        `bg-gradient-to-br ${getAccentColor()}`,
        'shadow-lg hover:shadow-xl transition-all duration-300',
        className
      )}
      style={{ boxShadow: `0 8px 32px -4px rgba(0,0,0,0.2), ${getInnerGlow()}` }}
      whileTap={{ scale: 0.98 }}
      role="article"
      aria-label={`${type} content block`}
    >
      {accentVisible && <BlockAccent type={type} specialistId={specialistId} childAge={childAge} />}
      
      <div className="relative">
        <div className={cn(
          "absolute -left-6 top-0 bottom-0 w-1.5 rounded-full",
          type === 'fact' ? 'bg-gradient-to-b from-wonderwhiz-cyan to-wonderwhiz-cyan/70' :
          type === 'quiz' ? 'bg-gradient-to-b from-wonderwhiz-bright-pink to-wonderwhiz-bright-pink/70' :
          type === 'creative' ? 'bg-gradient-to-b from-wonderwhiz-green to-wonderwhiz-green/70' :
          type === 'mindfulness' ? 'bg-gradient-to-b from-wonderwhiz-purple to-wonderwhiz-purple/70' :
          type === 'funFact' ? 'bg-gradient-to-b from-wonderwhiz-vibrant-yellow to-wonderwhiz-vibrant-yellow/70' :
          'bg-gradient-to-b from-wonderwhiz-blue to-wonderwhiz-blue/70'
        )} />
        
        {children}
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
