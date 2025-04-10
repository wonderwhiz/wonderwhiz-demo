
import React from 'react';
import { motion } from 'framer-motion';
import { Chapter } from '@/types/Chapter';
import { 
  BookOpen, 
  Compass, 
  Brain, 
  PuzzlePiece, 
  Palette, 
  Feather, 
  ArrowRight,
  Globe
} from 'lucide-react';

interface TableOfContentsProps {
  chapters: Chapter[];
  onChapterClick: (chapterId: string) => void;
  ageGroup?: '5-7' | '8-11' | '12-16';
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  chapters, 
  onChapterClick,
  ageGroup = '8-11' 
}) => {
  const getIconForChapter = (iconName: string) => {
    switch(iconName) {
      case 'introduction': return <BookOpen className="h-5 w-5" />;
      case 'exploration': return <Compass className="h-5 w-5" />;
      case 'understanding': return <Brain className="h-5 w-5" />;
      case 'challenge': return <PuzzlePiece className="h-5 w-5" />;
      case 'creation': return <Palette className="h-5 w-5" />;
      case 'reflection': return <Feather className="h-5 w-5" />;
      case 'nextSteps': return <ArrowRight className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/10"
    >
      <h2 className={`mb-4 font-bold text-white ${ageGroup === '5-7' ? 'text-xl' : 'text-lg'}`}>
        Your Wonder Journey
      </h2>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {chapters.map((chapter, index) => (
          <motion.li
            key={chapter.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <button
              onClick={() => onChapterClick(chapter.id)}
              className={`w-full text-left p-3 rounded-md flex items-center space-x-3 transition-all
                ${chapter.isActive 
                  ? 'bg-indigo-600 text-white' 
                  : chapter.isCompleted 
                    ? 'bg-indigo-900/40 text-white/80 hover:bg-indigo-900/60' 
                    : 'bg-white/5 text-white/50 hover:bg-white/10'
                }
              `}
            >
              <div className={`rounded-full p-2 
                ${chapter.isActive 
                  ? 'bg-indigo-700' 
                  : chapter.isCompleted 
                    ? 'bg-indigo-900/60' 
                    : 'bg-white/10'
                }`}
              >
                {getIconForChapter(chapter.icon)}
              </div>
              <div>
                <h3 className={`font-medium ${ageGroup === '5-7' ? 'text-base' : 'text-sm'}`}>
                  {chapter.title}
                </h3>
                <p className={`${ageGroup === '5-7' ? 'text-sm' : 'text-xs'} opacity-80`}>
                  {chapter.description}
                </p>
              </div>
            </button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export { TableOfContents };
export type { Chapter };
