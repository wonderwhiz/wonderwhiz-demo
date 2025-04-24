
import React from 'react';
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

  return (
    <div 
      className={cn(
        'absolute rounded-full shadow-lg',
        getSizeClass(),
        getAccentColor(),
        'transition-transform duration-300 hover:scale-110',
        className
      )}
      role="img"
      aria-label={`${type} icon`}
    >
      {getIcon()}
    </div>
  );
};

const getAccentColor = () => {
  return 'bg-wonderwhiz-blue text-white';
};

export default BlockAccent;

