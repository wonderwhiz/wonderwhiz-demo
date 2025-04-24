import React from 'react';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { Brain, Star, Sparkles, BookOpen, Lightbulb, Newspaper, Puzzle, Mountain, CheckSquare } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const getIcon = () => {
    switch (type) {
      case 'fact':
        return <Brain className={getIconSize()} />;
      case 'quiz':
        return <Lightbulb className={getIconSize()} />;
      case 'creative':
        return <BookOpen className={getIconSize()} />;
      case 'funFact':
        return <Sparkles className={getIconSize()} />;
      case 'news':
        return <Newspaper className={getIconSize()} />;
      case 'riddle':
        return <Puzzle className={getIconSize()} />;
      case 'activity':
        return <Mountain className={getIconSize()} />;
      case 'task':
        return <CheckSquare className={getIconSize()} />;
      default:
        return <Star className={getIconSize()} />;
    }
  };

  const getIconSize = () => {
    if (childAge <= 7) return "h-7 w-7";
    if (childAge <= 11) return "h-6 w-6";
    return "h-5 w-5";
  };

  const getSizeClass = () => {
    if (childAge <= 7) return 'p-4 -top-5 -right-5';
    if (childAge <= 11) return 'p-3 -top-4 -right-4';
    return 'p-2 -top-3 -right-3';
  };

  const getAccentColor = () => {
    return 'bg-wonderwhiz-blue text-white';
  };

  const iconVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 200, damping: 10 }
    },
    hover: { 
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: { type: "spring", stiffness: 300, damping: 10 }
    }
  };

  return (
    <motion.div 
      className={cn(
        'absolute rounded-full shadow-lg',
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
