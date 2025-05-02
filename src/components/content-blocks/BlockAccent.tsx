
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { Brain, Star, Sparkles, BookOpen, Lightbulb, FlaskConical, Clock, Newspaper, Dumbbell, Compass } from 'lucide-react';

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
    initial: { scale: 0, opacity: 0, rotate: -15 },
    animate: { 
      scale: 1, 
      opacity: 1,
      rotate: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.2
      }
    },
    hover: { 
      scale: 1.2,
      rotate: [0, -10, 10, -5, 5, 0],
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 8
      }
    },
    pulse: {
      scale: [1, 1.1, 1],
      opacity: [1, 0.8, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const getIconSize = () => {
    if (childAge <= 7) return "h-9 w-9";
    if (childAge <= 11) return "h-8 w-8";
    return "h-7 w-7";
  };

  const getSizeClass = () => {
    if (childAge <= 7) return 'p-4 -top-8 -right-8';
    if (childAge <= 11) return 'p-3 -top-7 -right-7';
    return 'p-3 -top-6 -right-6';
  };

  const getAccentColor = () => {
    switch (type) {
      case 'fact': return 'bg-gradient-to-br from-wonderwhiz-cyan via-wonderwhiz-cyan/90 to-wonderwhiz-cyan/80 text-white shadow-[0_0_30px_rgba(0,226,255,0.5)]';
      case 'quiz': return 'bg-gradient-to-br from-wonderwhiz-bright-pink via-wonderwhiz-bright-pink/90 to-wonderwhiz-bright-pink/80 text-white shadow-[0_0_30px_rgba(255,91,163,0.5)]';
      case 'creative': return 'bg-gradient-to-br from-wonderwhiz-green via-wonderwhiz-green/90 to-wonderwhiz-green/80 text-white shadow-[0_0_30px_rgba(0,214,143,0.5)]';
      case 'funFact': return 'bg-gradient-to-br from-wonderwhiz-vibrant-yellow via-wonderwhiz-vibrant-yellow/90 to-wonderwhiz-vibrant-yellow/80 text-white shadow-[0_0_30px_rgba(255,213,79,0.5)]';
      case 'mindfulness': return 'bg-gradient-to-br from-wonderwhiz-purple via-wonderwhiz-purple/90 to-wonderwhiz-purple/80 text-white shadow-[0_0_30px_rgba(126,48,225,0.5)]';
      case 'flashcard': return 'bg-gradient-to-br from-wonderwhiz-blue-accent via-wonderwhiz-blue-accent/90 to-wonderwhiz-blue-accent/80 text-white shadow-[0_0_30px_rgba(79,174,255,0.5)]';
      case 'task': return 'bg-gradient-to-br from-wonderwhiz-orange via-wonderwhiz-orange/90 to-wonderwhiz-orange/80 text-white shadow-[0_0_30px_rgba(255,150,79,0.5)]';
      case 'news': return 'bg-gradient-to-br from-wonderwhiz-light-blue via-wonderwhiz-light-blue/90 to-wonderwhiz-light-blue/80 text-white shadow-[0_0_30px_rgba(79,217,255,0.5)]';
      case 'riddle': return 'bg-gradient-to-br from-wonderwhiz-teal via-wonderwhiz-teal/90 to-wonderwhiz-teal/80 text-white shadow-[0_0_30px_rgba(79,255,195,0.5)]';
      case 'activity': return 'bg-gradient-to-br from-wonderwhiz-gold via-wonderwhiz-gold/90 to-wonderwhiz-gold/80 text-white shadow-[0_0_30px_rgba(255,213,79,0.5)]';
      default: return 'bg-gradient-to-br from-wonderwhiz-blue via-wonderwhiz-blue/90 to-wonderwhiz-blue/80 text-white shadow-[0_0_30px_rgba(0,157,255,0.5)]';
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
      case 'flashcard':
        return <BookOpen className={iconSize} />;
      case 'task':
        return <Clock className={iconSize} />;
      case 'news':
        return <Newspaper className={iconSize} />;
      case 'riddle':
        return <Compass className={iconSize} />;
      case 'activity':
        return <Dumbbell className={iconSize} />;
      case 'mindfulness':
        return <FlaskConical className={iconSize} />;
      default:
        return <BookOpen className={iconSize} />;
    }
  };

  return (
    <motion.div 
      className={cn(
        'absolute rounded-2xl shadow-xl backdrop-blur-md border-2 border-white/40',
        getSizeClass(),
        getAccentColor(),
        className
      )}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={{
        initial: { ...iconVariants.initial, x: 10, y: -10 },
        animate: { ...iconVariants.animate, x: 0, y: 0 },
        hover: iconVariants.hover
      }}
      role="img"
      aria-label={`${type} icon`}
    >
      <motion.div 
        variants={iconVariants} 
        className="relative"
        animate="pulse"
      >
        {getIcon()}
        <div className="absolute inset-0 blur-xl opacity-80 -z-10" style={{
          background: getAccentColor().includes('wonderwhiz-cyan') ? '#00E2FF' :
                     getAccentColor().includes('wonderwhiz-bright-pink') ? '#FF5BA3' :
                     getAccentColor().includes('wonderwhiz-green') ? '#00D68F' :
                     getAccentColor().includes('wonderwhiz-vibrant-yellow') ? '#FFD54F' :
                     getAccentColor().includes('wonderwhiz-blue-accent') ? '#4FAEEF' :
                     getAccentColor().includes('wonderwhiz-orange') ? '#FF964F' :
                     getAccentColor().includes('wonderwhiz-light-blue') ? '#4FD9FF' :
                     getAccentColor().includes('wonderwhiz-teal') ? '#4FFFC3' :
                     getAccentColor().includes('wonderwhiz-gold') ? '#FFD54F' :
                     getAccentColor().includes('wonderwhiz-purple') ? '#7E30E1' : '#4A6FFF'
        }} />
      </motion.div>
    </motion.div>
  );
};

export default BlockAccent;
