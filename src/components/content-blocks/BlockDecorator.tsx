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
        return 'from-wonderwhiz-cyan/30 via-wonderwhiz-cyan/20 to-wonderwhiz-cyan/10 border-wonderwhiz-cyan/30';
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/30 via-wonderwhiz-bright-pink/20 to-wonderwhiz-bright-pink/10 border-wonderwhiz-bright-pink/30';
      case 'creative':
        return 'from-wonderwhiz-green/30 via-wonderwhiz-green/20 to-wonderwhiz-green/10 border-wonderwhiz-green/30';
      case 'mindfulness':
        return 'from-wonderwhiz-purple/30 via-wonderwhiz-purple/20 to-wonderwhiz-purple/10 border-wonderwhiz-purple/30';
      default:
        return 'from-wonderwhiz-blue/30 via-wonderwhiz-blue/20 to-wonderwhiz-blue/10 border-wonderwhiz-blue/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-2xl shadow-lg backdrop-blur-lg border p-6 relative overflow-hidden',
        `bg-gradient-to-br ${getAccentColor()}`,
        className
      )}
      whileTap={{ scale: 0.98 }}
      role="article"
      aria-label={`${type} content block`}
    >
      {accentVisible && <BlockAccent type={type} specialistId={specialistId} childAge={childAge} />}
      
      <div className="relative">
        <div className={cn(
          "absolute -left-6 top-0 bottom-0 w-1.5 rounded-full",
          type === 'fact' ? 'bg-wonderwhiz-cyan' :
          type === 'quiz' ? 'bg-wonderwhiz-bright-pink' :
          type === 'creative' ? 'bg-wonderwhiz-green' :
          type === 'mindfulness' ? 'bg-wonderwhiz-purple' :
          'bg-wonderwhiz-blue'
        )} />
        
        {children}
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
