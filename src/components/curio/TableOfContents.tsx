
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Compass, 
  Brain, 
  Puzzle, 
  Palette, 
  Feather, 
  ArrowRight
} from 'lucide-react';
import { Chapter, ChapterIconType } from '@/types/Chapter';

export interface TableOfContentsProps {
  chapters: Chapter[];
  onChapterClick: (chapterId: string) => void;
  ageGroup: '5-7' | '8-11' | '12-16';
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  chapters,
  onChapterClick,
  ageGroup
}) => {
  const getIconForChapter = (iconType: string) => {
    switch(iconType) {
      case 'introduction': return <BookOpen className="h-5 w-5" />;
      case 'exploration': return <Compass className="h-5 w-5" />;
      case 'understanding': return <Brain className="h-5 w-5" />;
      case 'challenge': return <Puzzle className="h-5 w-5" />; // Changed from PuzzlePiece to Puzzle
      case 'creation': return <Palette className="h-5 w-5" />;
      case 'reflection': return <Feather className="h-5 w-5" />;
      case 'nextSteps': return <ArrowRight className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };
  
  const getChapterStyle = (ageGroup: string, isActive: boolean, isCompleted: boolean) => {
    if (ageGroup === '5-7') {
      return {
        container: `border-2 ${isActive ? 'border-wonderwhiz-vibrant-yellow' : isCompleted ? 'border-green-500/50' : 'border-white/20'} rounded-lg p-3 transition-all hover:border-white/50 cursor-pointer`,
        title: 'text-base font-bold',
        description: 'text-xs'
      };
    } else if (ageGroup === '8-11') {
      return {
        container: `border ${isActive ? 'border-wonderwhiz-bright-pink' : isCompleted ? 'border-green-500/50' : 'border-white/20'} rounded-md p-2 transition-all hover:border-white/50 cursor-pointer`,
        title: 'text-sm font-semibold',
        description: 'text-xs'
      };
    } else {
      return {
        container: `border-b ${isActive ? 'border-wonderwhiz-cyan' : isCompleted ? 'border-green-500/50' : 'border-white/20'} p-2 transition-all hover:border-white/50 cursor-pointer`,
        title: 'text-sm font-medium',
        description: 'text-xs'
      };
    }
  };
  
  return (
    <div id="table-of-contents" className="mb-8 px-1">
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xl font-bold text-white mb-4"
      >
        Your Learning Journey
      </motion.h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {chapters.map((chapter, index) => {
          const style = getChapterStyle(ageGroup, chapter.isActive, chapter.isCompleted);
          
          return (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={style.container}
              onClick={() => onChapterClick(chapter.id)}
            >
              <div className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${chapter.isCompleted ? 'bg-green-500/20' : chapter.isActive ? 'bg-wonderwhiz-purple/30' : 'bg-gray-500/20'}`}>
                  {getIconForChapter(chapter.icon)}
                </div>
                
                <div>
                  <h3 className={`${style.title} text-white`}>
                    {chapter.title}
                    {chapter.isCompleted && <span className="ml-2 text-green-400 text-xs">✓</span>}
                  </h3>
                  <p className={`${style.description} text-white/60`}>{chapter.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TableOfContents;
