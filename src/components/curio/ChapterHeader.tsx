
import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Compass, 
  Brain, 
  PuzzlePiece, 
  Palette, 
  Feather, 
  ArrowRight,
  ChevronDown
} from 'lucide-react';

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
  const getIconForChapter = (id: string) => {
    switch(id) {
      case 'introduction': return <BookOpen className="h-6 w-6" />;
      case 'exploration': return <Compass className="h-6 w-6" />;
      case 'understanding': return <Brain className="h-6 w-6" />;
      case 'challenge': return <PuzzlePiece className="h-6 w-6" />;
      case 'creation': return <Palette className="h-6 w-6" />;
      case 'reflection': return <Feather className="h-6 w-6" />;
      case 'nextSteps': return <ArrowRight className="h-6 w-6" />;
      default: return <BookOpen className="h-6 w-6" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6 mt-10 first:mt-2"
    >
      <div className="flex items-center space-x-3 mb-2">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-lg">
          {getIconForChapter(chapterId)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">
            {title}
          </h2>
          <p className="text-white/70">{description}</p>
        </div>
      </div>
      
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-transparent mb-6" />
      
      {index < totalChapters - 1 && (
        <motion.div 
          className="flex justify-center mt-6 mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <ChevronDown className="h-6 w-6 text-white/30" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChapterHeader;
