
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { Brain, Star, Sparkles, BookOpen, Lightbulb, Newspaper, Puzzle, Mountain, CheckSquare } from 'lucide-react';

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
    if (childAge <= 7) return "h-8 w-8";
    if (childAge <= 11) return "h-7 w-7";
    return "h-6 w-6";
  };

  const getSizeClass = () => {
    if (childAge <= 7) return 'p-5 -top-6 -right-6';
    if (childAge <= 11) return 'p-4 -top-5 -right-5';
    return 'p-3 -top-4 -right-4';
  };

  const getAccentColor = () => {
    switch (type) {
      case 'fact': return 'bg-wonderwhiz-cyan text-white shadow-[0_0_15px_rgba(0,255,255,0.3)]';
      case 'quiz': return 'bg-wonderwhiz-bright-pink text-white shadow-[0_0_15px_rgba(255,0,255,0.3)]';
      case 'creative': return 'bg-wonderwhiz-green text-white shadow-[0_0_15px_rgba(0,255,0,0.3)]';
      case 'funFact': return 'bg-wonderwhiz-vibrant-yellow text-white shadow-[0_0_15px_rgba(255,255,0,0.3)]';
      case 'news': return 'bg-wonderwhiz-blue-accent text-white shadow-[0_0_15px_rgba(0,0,255,0.3)]';
      case 'riddle': return 'bg-wonderwhiz-purple text-white shadow-[0_0_15px_rgba(255,0,255,0.3)]';
      case 'activity': return 'bg-wonderwhiz-green text-white shadow-[0_0_15px_rgba(0,255,0,0.3)]';
      case 'mindfulness': return 'bg-wonderwhiz-purple text-white shadow-[0_0_15px_rgba(255,0,255,0.3)]';
      default: return 'bg-wonderwhiz-blue text-white shadow-[0_0_15px_rgba(0,0,255,0.3)]';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'fact': return <Brain className={getIconSize()} />;
      case 'quiz': return <Lightbulb className={getIconSize()} />;
      case 'creative': return <BookOpen className={getIconSize()} />;
      case 'funFact': return <Sparkles className={getIconSize()} />;
      case 'news': return <Newspaper className={getIconSize()} />;
      case 'riddle': return <Puzzle className={getIconSize()} />;
      case 'activity': return <Mountain className={getIconSize()} />;
      case 'task': return <CheckSquare className={getIconSize()} />;
      default: return <Star className={getIconSize()} />;
    }
  };

  return (
    <motion.div 
      className={cn(
        'absolute rounded-2xl shadow-2xl backdrop-blur-lg border-2 border-white/20',
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
      <motion.div variants={iconVariants}>
        {getIcon()}
      </motion.div>
    </motion.div>
  );
};

export default BlockAccent;

