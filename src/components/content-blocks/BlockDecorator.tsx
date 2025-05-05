
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import BlockAccent from './BlockAccent';
import { blockAnimations, neuomorphicShadow } from './utils/blockStyles';

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
        return 'from-wonderwhiz-cyan/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-cyan/50';
      case 'quiz':
        return 'from-wonderwhiz-bright-pink/45 via-wonderwhiz-bright-pink/35 to-transparent border-wonderwhiz-bright-pink/50';
      case 'creative':
        return 'from-wonderwhiz-green/45 via-wonderwhiz-green/35 to-transparent border-wonderwhiz-green/50';
      case 'mindfulness':
        return 'from-wonderwhiz-purple/45 via-wonderwhiz-purple/35 to-transparent border-wonderwhiz-purple/50';
      case 'funFact':
        return 'from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-vibrant-yellow/35 to-transparent border-wonderwhiz-vibrant-yellow/50';
      case 'flashcard':
        return 'from-wonderwhiz-blue-accent/45 via-wonderwhiz-blue-accent/35 to-transparent border-wonderwhiz-blue-accent/50';
      case 'task':
        return 'from-wonderwhiz-orange/45 via-wonderwhiz-orange/35 to-transparent border-wonderwhiz-orange/50';
      case 'news':
        return 'from-wonderwhiz-cyan/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-cyan/50';
      case 'riddle':
        return 'from-wonderwhiz-green/45 via-wonderwhiz-green/35 to-transparent border-wonderwhiz-green/50';
      case 'activity':
        return 'from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-vibrant-yellow/35 to-transparent border-wonderwhiz-vibrant-yellow/50';
      default:
        return 'from-wonderwhiz-blue-accent/45 via-wonderwhiz-blue-accent/35 to-transparent border-wonderwhiz-blue-accent/50';
    }
  };

  const getInnerGlow = () => {
    switch (type) {
      case 'fact': return 'inset 0 0 24px 0px rgba(0,226,255,0.3)';
      case 'quiz': return 'inset 0 0 24px 0px rgba(255,91,163,0.3)';
      case 'creative': return 'inset 0 0 24px 0px rgba(0,214,143,0.3)';
      case 'funFact': return 'inset 0 0 24px 0px rgba(255,213,79,0.3)';
      case 'mindfulness': return 'inset 0 0 24px 0px rgba(61,42,125,0.3)';
      case 'flashcard': return 'inset 0 0 24px 0px rgba(74,111,255,0.3)';
      case 'task': return 'inset 0 0 24px 0px rgba(255,138,61,0.3)';
      case 'news': return 'inset 0 0 24px 0px rgba(0,226,255,0.3)';
      case 'riddle': return 'inset 0 0 24px 0px rgba(0,214,143,0.3)';
      case 'activity': return 'inset 0 0 24px 0px rgba(255,213,79,0.3)';
      default: return 'inset 0 0 24px 0px rgba(74,111,255,0.3)';
    }
  };
  
  const getOuterShadow = () => {
    switch (type) {
      case 'fact': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,226,255,0.5)';
      case 'quiz': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,91,163,0.5)';
      case 'creative': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,214,143,0.5)';
      case 'funFact': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,213,79,0.5)';
      case 'mindfulness': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(61,42,125,0.5)';
      case 'flashcard': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(74,111,255,0.5)';
      case 'task': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,138,61,0.5)';
      case 'news': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,226,255,0.5)';
      case 'riddle': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(0,214,143,0.5)';
      case 'activity': return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(255,213,79,0.5)';
      default: return '0 12px 36px -2px rgba(0,0,0,0.4), 0 0 20px -3px rgba(74,111,255,0.5)';
    }
  };
  
  // Added 3D transform effect for modern look
  const get3DEffect = childAge <= 12 ? "hover:rotate-1 hover:translate-y-[-4px] perspective-1000" : "hover:translate-y-[-2px]";

  const getBorderAccentColor = () => {
    switch (type) {
      case 'fact': return 'bg-gradient-to-b from-wonderwhiz-cyan via-wonderwhiz-cyan/80 to-wonderwhiz-cyan/60';
      case 'quiz': return 'bg-gradient-to-b from-wonderwhiz-bright-pink via-wonderwhiz-bright-pink/80 to-wonderwhiz-bright-pink/60';
      case 'creative': return 'bg-gradient-to-b from-wonderwhiz-green via-wonderwhiz-green/80 to-wonderwhiz-green/60';
      case 'mindfulness': return 'bg-gradient-to-b from-wonderwhiz-purple via-wonderwhiz-purple/80 to-wonderwhiz-purple/60';
      case 'funFact': return 'bg-gradient-to-b from-wonderwhiz-vibrant-yellow via-wonderwhiz-vibrant-yellow/80 to-wonderwhiz-vibrant-yellow/60';
      case 'flashcard': return 'bg-gradient-to-b from-wonderwhiz-blue-accent via-wonderwhiz-blue-accent/80 to-wonderwhiz-blue-accent/60';
      case 'task': return 'bg-gradient-to-b from-wonderwhiz-orange via-wonderwhiz-orange/80 to-wonderwhiz-orange/60';
      case 'news': return 'bg-gradient-to-b from-wonderwhiz-cyan via-wonderwhiz-cyan/80 to-wonderwhiz-cyan/60';
      case 'riddle': return 'bg-gradient-to-b from-wonderwhiz-green via-wonderwhiz-green/80 to-wonderwhiz-green/60';
      case 'activity': return 'bg-gradient-to-b from-wonderwhiz-vibrant-yellow via-wonderwhiz-vibrant-yellow/80 to-wonderwhiz-vibrant-yellow/60';
      default: return 'bg-gradient-to-b from-wonderwhiz-blue-accent via-wonderwhiz-blue-accent/80 to-wonderwhiz-blue-accent/60';
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      variants={blockAnimations.entrance}
      className={cn(
        'rounded-2xl backdrop-blur-xl border-2 p-5 relative overflow-hidden',
        `bg-gradient-to-br ${getAccentColor()}`,
        'shadow-lg hover:shadow-xl transition-all duration-300',
        neuomorphicShadow(),
        get3DEffect,
        className
      )}
      style={{ 
        boxShadow: `${getOuterShadow()}, ${getInnerGlow()}`,
        backdropFilter: 'blur(20px)'
      }}
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
          "absolute -left-5 top-0 bottom-0 w-1.5 rounded-full",
          getBorderAccentColor()
        )} />
        
        <div className="relative z-10">
          {children}
        </div>
        
        {/* Enhanced background pattern for visual interest */}
        <div 
          className="absolute inset-0 z-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.4) 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
        
        {/* Add subtle ambient light effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-pulse-slow pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-white/20 blur-3xl animate-pulse-slow pointer-events-none"></div>
        
        {/* Add light beam effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      </div>
    </motion.div>
  );
};

export default BlockDecorator;
