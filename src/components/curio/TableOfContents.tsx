
import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '@/types/Chapter';
import { BookOpen, Compass, Lightbulb, Brain, Palette, Feather, ArrowRight } from 'lucide-react';

interface TableOfContentsProps {
  chapters: Chapter[];
  onChapterClick: (chapterId: string) => void;
  ageGroup: '5-7' | '8-11' | '12-16';
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  chapters, 
  onChapterClick,
  ageGroup 
}) => {
  const getChapterIcon = (iconType: string) => {
    switch(iconType) {
      case 'introduction': return <BookOpen className="h-4 w-4" />;
      case 'exploration': return <Compass className="h-4 w-4" />;
      case 'understanding': return <Lightbulb className="h-4 w-4" />;
      case 'challenge': return <Brain className="h-4 w-4" />;
      case 'creation': return <Palette className="h-4 w-4" />;
      case 'reflection': return <Feather className="h-4 w-4" />;
      case 'nextSteps': return <ArrowRight className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };
  
  const getTitle = (ageGroup: '5-7' | '8-11' | '12-16') => {
    switch(ageGroup) {
      case '5-7': return "Learning Adventure Map";
      case '8-11': return "Journey Through Knowledge";
      case '12-16': return "Exploration Roadmap";
      default: return "Table of Contents";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <h2 className="text-white font-semibold text-lg mb-3">{getTitle(ageGroup)}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
        {chapters.map((chapter) => (
          <motion.button
            key={chapter.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChapterClick(chapter.id)}
            className={`flex flex-col items-center text-center p-3 rounded-lg border transition-all duration-200 ${
              chapter.isActive
                ? 'bg-white/10 border-wonderwhiz-bright-pink text-white'
                : chapter.isCompleted
                ? 'bg-white/5 border-green-500/50 text-white/90'
                : 'bg-white/5 border-white/10 text-white/70 hover:border-white/20'
            }`}
          >
            <div className={`mb-1.5 ${
              chapter.isActive
                ? 'text-wonderwhiz-bright-pink'
                : chapter.isCompleted
                ? 'text-green-400'
                : 'text-white/50'
            }`}>
              {getChapterIcon(chapter.icon)}
            </div>
            <div className="text-xs font-medium">{chapter.title}</div>
            {ageGroup !== '5-7' && (
              <div className="text-[10px] opacity-70 mt-0.5">{chapter.description}</div>
            )}
            
            {chapter.isCompleted && (
              <div className="mt-1 text-[10px] text-green-400">Completed</div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TableOfContents;
