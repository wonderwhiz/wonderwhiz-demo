
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { Brain, Star, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface BlockAccentProps {
  type: ContentBlockType;
  specialistId?: string;
  className?: string;
  childAge?: number;
}

const BlockAccent: React.FC<BlockAccentProps> = ({
  type,
  specialistId,
  className,
  childAge = 10
}) => {
  const iconVariants = {
    initial: { scale: 0.8, opacity: 0, rotate: -10 },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    },
    hover: { 
      scale: 1.2,
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 10
      }
    }
  };

  const getIconSize = () => {
    if (childAge <= 7) return "h-9 w-9";
    if (childAge <= 11) return "h-8 w-8";
    return "h-7 w-7";
  };

  const getSizeClass = () => {
    if (childAge <= 7) return 'p-5 -top-7 -right-7';
    if (childAge <= 11) return 'p-4 -top-6 -right-6';
    return 'p-3 -top-5 -right-5';
  };

  const getAccentColor = () => {
    switch (type) {
      case 'fact': return 'bg-gradient-to-br from-wonderwhiz-cyan via-wonderwhiz-cyan/90 to-wonderwhiz-cyan/80 text-white shadow-[0_0_25px_rgba(0,226,255,0.4)]';
      case 'quiz': return 'bg-gradient-to-br from-wonderwhiz-bright-pink via-wonderwhiz-bright-pink/90 to-wonderwhiz-bright-pink/80 text-white shadow-[0_0_25px_rgba(255,91,163,0.4)]';
      case 'creative': return 'bg-gradient-to-br from-wonderwhiz-green via-wonderwhiz-green/90 to-wonderwhiz-green/80 text-white shadow-[0_0_25px_rgba(0,214,143,0.4)]';
      case 'funFact': return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow via-wonderwhiz-vibrant-yellow/90 to-wonderwhiz-vibrant-yellow/80 text-white shadow-[0_0_25px_rgba(255,213,79,0.4)]';
      case 'mindfulness': return 'bg-gradient-to-br from-wonderwhiz-purple via-wonderwhiz-purple/90 to-wonderwhiz-purple/80 text-white shadow-[0_0_25px_rgba(126,48,225,0.4)]';
      default: return 'bg-gradient-to-br from-wonderwhiz-blue via-wonderwhiz-blue/90 to-wonderwhiz-blue/80 text-white shadow-[0_0_25px_rgba(0,157,255,0.4)]';
    }
  };

  const getIcon = () => {
    const iconSize = getIconSize();
    switch (type) {
      case 'fact':
        return <Brain className={iconSize} />;
      case 'quiz':
        return <Star className={iconSize} />;
      case 'creative':
        return <Sparkles className={iconSize} />;
      case 'funFact':
        return <Lightbulb className={iconSize} />;
      default:
        return <BookOpen className={iconSize} />;
    }
  };

  return (
    <motion.div 
      className={cn(
        'absolute rounded-2xl shadow-xl backdrop-blur-xl border-2 border-white/30',
        getSizeClass(),
        getAccentColor(),
        className
      )}
      initial="initial"
      animate="animate"
      whileHover="hover"
      role="img"
      aria-label={`${type} icon`}
    >
      <motion.div variants={iconVariants} className="relative">
        {getIcon()}
        <div className="absolute inset-0 blur-xl opacity-60 -z-10" style={{
          background: getAccentColor().includes('wonderwhiz-cyan') ? '#00E2FF' :
                     getAccentColor().includes('wonderwhiz-bright-pink') ? '#FF5BA3' :
                     getAccentColor().includes('wonderwhiz-green') ? '#00D68F' :
                     getAccentColor().includes('wonderwhiz-vibrant-yellow') ? '#FFD54F' : '#4A6FFF'
        }} />
      </motion.div>
    </motion.div>
  );
};

export default BlockAccent;
