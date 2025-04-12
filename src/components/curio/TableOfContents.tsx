
import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  BookOpen, 
  Compass, 
  Brain, 
  Sparkles, 
  Palette, 
  Lightbulb, 
  ArrowRight 
} from 'lucide-react';
import { Chapter } from '@/types/Chapter';
import { motion } from 'framer-motion';

export type ChapterIconType = 
  | 'introduction' 
  | 'exploration' 
  | 'understanding' 
  | 'challenge' 
  | 'creation' 
  | 'reflection' 
  | 'nextSteps';

interface TableOfContentsProps {
  chapters: Chapter[];
  onChapterClick: (chapterId: string) => void;
  ageGroup: '5-7' | '8-11' | '12-16';
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  chapters, 
  onChapterClick,
  ageGroup 
}) => {
  const getAgeSpecificStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          title: 'Our Learning Adventure',
          subtitle: 'Let\'s explore these fun places!',
          cardStyle: 'bg-gradient-to-r from-cyan-500 to-blue-500 border-none shadow-xl',
          iconStyle: 'bg-white/20 p-2 rounded-full'
        };
      case '8-11':
        return {
          title: 'Learning Journey',
          subtitle: 'Your path through this topic',
          cardStyle: 'bg-gradient-to-r from-violet-600 to-indigo-600 border-none shadow-lg',
          iconStyle: 'bg-white/20 p-2 rounded-lg'
        };
      case '12-16':
        return {
          title: 'Course Outline',
          subtitle: 'Topics covered in this exploration',
          cardStyle: 'bg-gradient-to-r from-slate-800 to-slate-700 border-none shadow-md',
          iconStyle: 'bg-white/10 p-2 rounded-md'
        };
    }
  };

  const styles = getAgeSpecificStyles();

  const getChapterIcon = (iconType: string) => {
    switch(iconType) {
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
    <Card className={`mb-8 overflow-hidden ${styles.cardStyle}`}>
      <div className="p-4">
        <h2 className="text-xl font-semibold text-white mb-1">{styles.title}</h2>
        <p className="text-white/70 text-sm mb-4">{styles.subtitle}</p>
        
        <div className="space-y-2">
          {chapters.map((chapter) => (
            <motion.button
              key={chapter.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center p-2.5 rounded-lg transition-all ${
                chapter.isActive
                  ? 'bg-white/20 shadow-md'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
              onClick={() => onChapterClick(chapter.id)}
            >
              <div className={styles.iconStyle}>
                {getChapterIcon(chapter.icon)}
              </div>
              
              <div className="ml-3 text-left flex-1">
                <div className="text-white font-medium">{chapter.title}</div>
                <div className="text-white/60 text-xs">{chapter.description}</div>
              </div>
              
              {chapter.isCompleted && (
                <div className="bg-green-500/20 text-green-300 text-xs px-2 py-1 rounded">
                  {ageGroup === '5-7' ? '✓ Done' : 'Completed'}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </Card>
  );
};
