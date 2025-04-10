
import React from 'react';
import { 
  BookOpen, 
  Compass, 
  Brain, 
  Sparkles, 
  Palette, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ChapterHeaderProps {
  chapterId: string;
  title: string;
  description: string;
  index: number;
  totalChapters: number;
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({
  chapterId,
  title,
  description,
  index,
  totalChapters
}) => {
  const getChapterIcon = (id: string) => {
    switch(id) {
      case 'introduction': return <BookOpen className="h-5 w-5" />;
      case 'exploration': return <Compass className="h-5 w-5" />;
      case 'understanding': return <Brain className="h-5 w-5" />;
      case 'challenge': return <Sparkles className="h-5 w-5" />; 
      case 'creation': return <Palette className="h-5 w-5" />;
      case 'reflection': return <Lightbulb className="h-5 w-5" />;
      case 'nextSteps': return <ArrowRight className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };

  return (
    <div className="mt-10 mb-6">
      <Card className="bg-gradient-to-r from-indigo-900/80 to-violet-900/80 border-none p-4 shadow-lg">
        <div className="flex items-center">
          <div className="bg-white/10 p-2 rounded-lg mr-4">
            {getChapterIcon(chapterId)}
          </div>
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <p className="text-white/70 text-sm">{description}</p>
          </div>
          
          <div className="text-white/50 text-sm font-medium">
            {index + 1} / {totalChapters}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChapterHeader;
