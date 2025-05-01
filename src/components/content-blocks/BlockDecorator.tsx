
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
      case 'flashcard':
        return 'from-wonderwhiz-blue-accent/30 via-wonderwhiz-blue-accent/15 to-transparent border-wonderwhiz-blue-accent/40';
      case 'task':
        return 'from-wonderwhiz-orange/30 via-wonderwhiz-orange/15 to-transparent border-wonderwhiz-orange/40';
      case 'news':
        return 'from-wonderwhiz-light-blue/30 via-wonderwhiz-light-blue/15 to-transparent border-wonderwhiz-light-blue/40';
      case 'riddle':
        return 'from-wonderwhiz-teal/30 via-wonderwhiz-teal/15 to-transparent border-wonderwhiz-teal/40';
      case 'activity':
        return 'from-wonderwhiz-gold/30 via-wonderwhiz-gold/15 to-transparent border-wonderwhiz-gold/40';
      default:
        return 'from-wonderwhiz-blue/30 via-wonderwhiz-blue/15 to-transparent border-wonderwhiz-blue/40';
    }
  };

  const getInnerGlow = () => {
    switch (type) {
      case 'fact': return 'inset 0 0 30px 5px rgba(0,226,255,0.12)';
      case 'quiz': return 'inset 0 0 30px 5px rgba(255,91,163,0.12)';
      case 'creative': return 'inset 0 0 30px 5px rgba(0,214,143,0.12)';
      case 'funFact': return 'inset 0 0 30px 5px rgba(255,213,79,0.12)';
      case 'mindfulness': return 'inset 0 0 30px 5px rgba(126,48,225,0.12)';
      case 'flashcard': return 'inset 0 0 30px 5px rgba(79,174,255,0.12)';
      case 'task': return 'inset 0 0 30px 5px rgba(255,150,79,0.12)';
      case 'news': return 'inset 0 0 30px 5px rgba(79,217,255,0.12)';
      case 'riddle': return 'inset 0 0 30px 5px rgba(79,255,195,0.12)';
      case 'activity': return 'inset 0 0 30px 5px rgba(255,213,79,0.12)';
      default: return 'inset 0 0 30px 5px rgba(0,157,255,0.12)';
    }
  };
  
  const getOuterShadow = () => {
    switch (type) {
      case 'fact': return '0 8px 30px -5px rgba(0,226,255,0.15)';
      case 'quiz': return '0 8px 30px -5px rgba(255,91,163,0.15)';
      case 'creative': return '0 8px 30px -5px rgba(0,214,143,0.15)';
      case 'funFact': return '0 8px 30px -5px rgba(255,213,79,0.15)';
      case 'mindfulness': return '0 8px 30px -5px rgba(126,48,225,0.15)';
      case 'flashcard': return '0 8px 30px -5px rgba(79,174,255,0.15)';
      case 'task': return '0 8px 30px -5px rgba(255,150,79,0.15)';
      case 'news': return '0 8px 30px -5px rgba(79,217,255,0.15)';
      case 'riddle': return '0 8px 30px -5px rgba(79,255,195,0.15)';
      case 'activity': return '0 8px 30px -5px rgba(255,213,79,0.15)';
      default: return '0 8px 30px -5px rgba(0,157,255,0.15)';
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
      style={{ 
        boxShadow: `${getOuterShadow()}, ${getInnerGlow()}`,
        backdropFilter: 'blur(8px)'
      }}
      whileTap={{ scale: 0.985 }}
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
          "absolute -left-6 top-0 bottom-0 w-1.5 rounded-full",
          type === 'fact' ? 'bg-gradient-to-b from-wonderwhiz-cyan to-wonderwhiz-cyan/70' :
          type === 'quiz' ? 'bg-gradient-to-b from-wonderwhiz-bright-pink to-wonderwhiz-bright-pink/70' :
          type === 'creative' ? 'bg-gradient-to-b from-wonderwhiz-green to-wonderwhiz-green/70' :
          type === 'mindfulness' ? 'bg-gradient-to-b from-wonderwhiz-purple to-wonderwhiz-purple/70' :
          type === 'funFact' ? 'bg-gradient-to-b from-wonderwhiz-vibrant-yellow to-wonderwhiz-vibrant-yellow/70' :
          type === 'flashcard' ? 'bg-gradient-to-b from-wonderwhiz-blue-accent to-wonderwhiz-blue-accent/70' :
          type === 'task' ? 'bg-gradient-to-b from-wonderwhiz-orange to-wonderwhiz-orange/70' :
          type === 'news' ? 'bg-gradient-to-b from-wonderwhiz-light-blue to-wonderwhiz-light-blue/70' :
          type === 'riddle' ? 'bg-gradient-to-b from-wonderwhiz-teal to-wonderwhiz-teal/70' :
          type === 'activity' ? 'bg-gradient-to-b from-wonderwhiz-gold to-wonderwhiz-gold/70' :
          'bg-gradient-to-b from-wonderwhiz-blue to-wonderwhiz-blue/70'
        )} />
        
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Add subtle background pattern for visual interest */}
        <div 
          className="absolute inset-0 z-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.15) 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
