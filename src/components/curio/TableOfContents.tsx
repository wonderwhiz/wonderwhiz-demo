
import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '@/types/Chapter';
import { BadgeCheck, ChevronRight } from 'lucide-react';

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
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          containerClass: 'bg-gradient-to-r from-emerald-500/20 to-sky-500/20 border-emerald-500/30',
          titleClass: 'text-emerald-300',
        };
      case '12-16':
        return {
          containerClass: 'bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-purple-500/30',
          titleClass: 'text-purple-300',
        };
      default: // 8-11
        return {
          containerClass: 'bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-indigo-500/30',
          titleClass: 'text-indigo-300',
        };
    }
  };
  
  const styles = getAgeGroupStyles();
  
  return (
    <motion.div 
      className={`p-4 rounded-lg ${styles.containerClass} border mb-6 backdrop-blur-sm`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className={`text-lg font-bold mb-3 ${styles.titleClass}`}>Learning Journey</h3>
      
      <ul className="space-y-2">
        {chapters.map((chapter) => (
          <motion.li 
            key={chapter.id}
            className="relative"
            whileHover={{ x: 4 }}
          >
            <button
              onClick={() => onChapterClick(chapter.id)}
              className={`
                w-full text-left flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors
                ${chapter.isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'}
              `}
            >
              <div className="flex-shrink-0 w-5">
                {chapter.isCompleted ? (
                  <BadgeCheck className="h-5 w-5 text-green-400" />
                ) : (
                  <div className="h-5 w-5 rounded-full border border-white/30 flex items-center justify-center text-xs text-white/60">
                    {chapters.findIndex(c => c.id === chapter.id) + 1}
                  </div>
                )}
              </div>
              
              <span className="flex-1 text-sm font-medium">{chapter.title}</span>
              
              <ChevronRight className={`h-4 w-4 transform transition-transform ${chapter.isActive ? 'rotate-90 text-white' : 'text-white/40'}`} />
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
