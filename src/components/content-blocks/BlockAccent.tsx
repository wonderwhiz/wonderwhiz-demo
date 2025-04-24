
import React from 'react';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { Brain, Star, Sparkles, BookOpen, Lightbulb } from 'lucide-react';

interface BlockAccentProps {
  type: ContentBlockType;
  specialistId?: string;
  className?: string;
}

const BlockAccent: React.FC<BlockAccentProps> = ({
  type,
  specialistId,
  className
}) => {
  const getIcon = () => {
    switch (type) {
      case 'fact':
        return <Brain className="h-5 w-5" />;
      case 'quiz':
        return <Lightbulb className="h-5 w-5" />;
      case 'creative':
        return <BookOpen className="h-5 w-5" />;
      case 'funFact':
        return <Sparkles className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const getAccentColor = () => {
    switch (type) {
      case 'fact':
        return 'bg-wonderwhiz-cyan text-white';
      case 'quiz':
        return 'bg-wonderwhiz-bright-pink text-white';
      case 'creative':
        return 'bg-wonderwhiz-green text-white';
      case 'funFact':
        return 'bg-wonderwhiz-vibrant-yellow text-black';
      default:
        return 'bg-wonderwhiz-blue text-white';
    }
  };

  return (
    <div className={cn(
      'absolute -top-3 -right-3 p-2 rounded-full shadow-lg',
      getAccentColor(),
      className
    )}>
      {getIcon()}
    </div>
  );
};

export default BlockAccent;
