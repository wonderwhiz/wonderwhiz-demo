
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ContentBlockType } from '@/types/curio';
import { LightbulbIcon, BookOpen, Puzzle, Locate, PenLine, Sparkles } from 'lucide-react';

interface EnhancedContentBlockProps {
  content: string;
  type: ContentBlockType;
  childAge?: number;
}

const EnhancedContentBlock: React.FC<EnhancedContentBlockProps> = ({
  content,
  type,
  childAge = 10
}) => {
  // Adjust font size based on child age
  const getFontSize = () => {
    if (childAge <= 7) return 'text-lg';
    if (childAge <= 10) return 'text-base';
    return 'text-sm';
  };

  // Get appropriate icon for content type
  const getIcon = () => {
    switch (type) {
      case 'fact':
      case 'funFact':
        return <LightbulbIcon className="h-5 w-5 text-yellow-400" />;
      case 'quiz':
        return <Puzzle className="h-5 w-5 text-green-400" />;
      case 'flashcard':
        return <BookOpen className="h-5 w-5 text-blue-400" />;
      case 'creative':
        return <PenLine className="h-5 w-5 text-purple-400" />;
      case 'task':
        return <Locate className="h-5 w-5 text-red-400" />;
      case 'mindfulness':
        return <Sparkles className="h-5 w-5 text-teal-400" />;
      default:
        return <LightbulbIcon className="h-5 w-5 text-yellow-400" />;
    }
  };

  // Get appropriate background color for content type
  const getBackgroundColor = () => {
    switch (type) {
      case 'fact':
        return 'bg-gradient-to-br from-blue-500/20 to-blue-700/20';
      case 'funFact':
        return 'bg-gradient-to-br from-yellow-500/20 to-yellow-700/20';
      case 'quiz':
        return 'bg-gradient-to-br from-green-500/20 to-green-700/20';
      case 'flashcard':
        return 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20';
      case 'creative':
        return 'bg-gradient-to-br from-purple-500/20 to-purple-700/20';
      case 'task':
        return 'bg-gradient-to-br from-red-500/20 to-red-700/20';
      case 'riddle':
        return 'bg-gradient-to-br from-amber-500/20 to-amber-700/20';
      case 'activity':
        return 'bg-gradient-to-br from-cyan-500/20 to-cyan-700/20';
      case 'news':
        return 'bg-gradient-to-br from-slate-500/20 to-slate-700/20';
      case 'mindfulness':
        return 'bg-gradient-to-br from-teal-500/20 to-teal-700/20';
      default:
        return 'bg-gradient-to-br from-gray-500/20 to-gray-700/20';
    }
  };

  return (
    <Card
      className={cn(
        "p-5 border border-white/10 shadow-lg backdrop-blur-sm overflow-hidden relative",
        getBackgroundColor()
      )}
    >
      <div className="flex items-start">
        <div className="mr-3 mt-1">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className={cn("text-white", getFontSize())}>
            {content}
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="text-xs font-normal border-white/20 text-white/70">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EnhancedContentBlock;
