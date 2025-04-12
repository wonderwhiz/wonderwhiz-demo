
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Lightbulb, Brain, Award, Palette, Compass, ArrowRight } from 'lucide-react';

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
  const getIcon = () => {
    switch(chapterId) {
      case 'introduction':
        return <BookOpen className="h-5 w-5" />;
      case 'exploration':
        return <Compass className="h-5 w-5" />;
      case 'understanding':
        return <Lightbulb className="h-5 w-5" />;
      case 'challenge':
        return <Award className="h-5 w-5" />;
      case 'creation':
        return <Palette className="h-5 w-5" />;
      case 'reflection':
        return <Brain className="h-5 w-5" />;
      case 'nextSteps':
        return <ArrowRight className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  return (
    <motion.div 
      className="mb-6 mt-10 first:mt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      id={`chapter-${chapterId}`}
    >
      <div className="flex items-center">
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600/80 to-purple-600/80 flex items-center justify-center mr-3 shadow-glow-sm">
          {getIcon()}
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
        
        <div className="ml-auto px-2 py-1 bg-white/10 rounded text-xs text-white/60 hidden sm:block">
          Chapter {index + 1} of {totalChapters}
        </div>
      </div>
      
      <div className="h-px bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-transparent mt-4"></div>
    </motion.div>
  );
};

export default ChapterHeader;
