
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
        return 'from-wonderwhiz-cyan/20 via-wonderwhiz-cyan/10 to-transparent border-wonderwhiz-cyan/30';
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/20 via-wonderwhiz-bright-pink/10 to-transparent border-wonderwhiz-bright-pink/30';
      case 'creative':
        return 'from-wonderwhiz-green/20 via-wonderwhiz-green/10 to-transparent border-wonderwhiz-green/30';
      case 'mindfulness':
        return 'from-wonderwhiz-purple/20 via-wonderwhiz-purple/10 to-transparent border-wonderwhiz-purple/30';
      case 'funFact':
        return 'from-wonderwhiz-vibrant-yellow/20 via-wonderwhiz-vibrant-yellow/10 to-transparent border-wonderwhiz-vibrant-yellow/30';
      case 'flashcard':
        return 'from-wonderwhiz-blue-accent/20 via-wonderwhiz-blue-accent/10 to-transparent border-wonderwhiz-blue-accent/30';
      case 'task':
        return 'from-wonderwhiz-orange/20 via-wonderwhiz-orange/10 to-transparent border-wonderwhiz-orange/30';
      case 'news':
        return 'from-wonderwhiz-light-blue/20 via-wonderwhiz-light-blue/10 to-transparent border-wonderwhiz-light-blue/30';
      case 'riddle':
        return 'from-wonderwhiz-teal/20 via-wonderwhiz-teal/10 to-transparent border-wonderwhiz-teal/30';
      case 'activity':
        return 'from-wonderwhiz-gold/20 via-wonderwhiz-gold/10 to-transparent border-wonderwhiz-gold/30';
      default:
        return 'from-wonderwhiz-blue/20 via-wonderwhiz-blue/10 to-transparent border-wonderwhiz-blue/30';
    }
  };

  const getInnerGlow = () => {
    switch (type) {
      case 'fact': return 'inset 0 0 20px 0px rgba(0,226,255,0.08)';
      case 'quiz': return 'inset 0 0 20px 0px rgba(255,91,163,0.08)';
      case 'creative': return 'inset 0 0 20px 0px rgba(0,214,143,0.08)';
      case 'funFact': return 'inset 0 0 20px 0px rgba(255,213,79,0.08)';
      case 'mindfulness': return 'inset 0 0 20px 0px rgba(126,48,225,0.08)';
      case 'flashcard': return 'inset 0 0 20px 0px rgba(79,174,255,0.08)';
      case 'task': return 'inset 0 0 20px 0px rgba(255,150,79,0.08)';
      case 'news': return 'inset 0 0 20px 0px rgba(79,217,255,0.08)';
      case 'riddle': return 'inset 0 0 20px 0px rgba(79,255,195,0.08)';
      case 'activity': return 'inset 0 0 20px 0px rgba(255,213,79,0.08)';
      default: return 'inset 0 0 20px 0px rgba(0,157,255,0.08)';
    }
  };
  
  const getOuterShadow = () => {
    switch (type) {
      case 'fact': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(0,226,255,0.1)';
      case 'quiz': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(255,91,163,0.1)';
      case 'creative': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(0,214,143,0.1)';
      case 'funFact': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(255,213,79,0.1)';
      case 'mindfulness': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(126,48,225,0.1)';
      case 'flashcard': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(79,174,255,0.1)';
      case 'task': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(255,150,79,0.1)';
      case 'news': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(79,217,255,0.1)';
      case 'riddle': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(79,255,195,0.1)';
      case 'activity': return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(255,213,79,0.1)';
      default: return '0 4px 20px -2px rgba(0,0,0,0.2), 0 0 15px -3px rgba(0,157,255,0.1)';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'rounded-xl backdrop-blur-md border p-5 relative overflow-hidden',
        `bg-gradient-to-br ${getAccentColor()}`,
        'shadow-lg hover:shadow-xl transition-all duration-300',
        className
      )}
      style={{ 
        boxShadow: `${getOuterShadow()}, ${getInnerGlow()}`,
        backdropFilter: 'blur(10px)'
      }}
      whileTap={{ scale: 0.995 }}
      role="article"
      aria-label={`${type} content block`}
    >
      {accentVisible && (
        <BlockAccent 
          type={type} 
          specialistId={specialistId} 
          childAge={childAge} 
          className="z-10"
        />
      )}
      
      <div className="relative">
        <div className={cn(
          "absolute -left-5 top-0 bottom-0 w-1 rounded-full",
          type === 'fact' ? 'bg-gradient-to-b from-wonderwhiz-cyan to-wonderwhiz-cyan/50' :
          type === 'quiz' ? 'bg-gradient-to-b from-wonderwhiz-bright-pink to-wonderwhiz-bright-pink/50' :
          type === 'creative' ? 'bg-gradient-to-b from-wonderwhiz-green to-wonderwhiz-green/50' :
          type === 'mindfulness' ? 'bg-gradient-to-b from-wonderwhiz-purple to-wonderwhiz-purple/50' :
          type === 'funFact' ? 'bg-gradient-to-b from-wonderwhiz-vibrant-yellow to-wonderwhiz-vibrant-yellow/50' :
          type === 'flashcard' ? 'bg-gradient-to-b from-wonderwhiz-blue-accent to-wonderwhiz-blue-accent/50' :
          type === 'task' ? 'bg-gradient-to-b from-wonderwhiz-orange to-wonderwhiz-orange/50' :
          type === 'news' ? 'bg-gradient-to-b from-wonderwhiz-light-blue to-wonderwhiz-light-blue/50' :
          type === 'riddle' ? 'bg-gradient-to-b from-wonderwhiz-teal to-wonderwhiz-teal/50' :
          type === 'activity' ? 'bg-gradient-to-b from-wonderwhiz-gold to-wonderwhiz-gold/50' :
          'bg-gradient-to-b from-wonderwhiz-blue to-wonderwhiz-blue/50'
        )} />
        
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Subtle background pattern for visual interest */}
        <div 
          className="absolute inset-0 z-0 opacity-3 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
