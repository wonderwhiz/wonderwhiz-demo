
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Compass, Lightbulb, Brain, Palette, Feather, ArrowRight } from 'lucide-react';

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
  const getChapterIcon = () => {
    switch(chapterId) {
      case 'introduction': return <BookOpen className="h-5 w-5" />;
      case 'exploration': return <Compass className="h-5 w-5" />;
      case 'understanding': return <Lightbulb className="h-5 w-5" />;
      case 'challenge': return <Brain className="h-5 w-5" />;
      case 'creation': return <Palette className="h-5 w-5" />;
      case 'reflection': return <Feather className="h-5 w-5" />;
      case 'nextSteps': return <ArrowRight className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
    }
  };
  
  const getHeaderColor = () => {
    switch(chapterId) {
      case 'introduction': return 'from-blue-500 to-purple-500';
      case 'exploration': return 'from-cyan-500 to-blue-500';
      case 'understanding': return 'from-green-500 to-cyan-500';
      case 'challenge': return 'from-orange-500 to-yellow-500';
      case 'creation': return 'from-pink-500 to-wonderwhiz-bright-pink';
      case 'reflection': return 'from-purple-500 to-indigo-500';
      case 'nextSteps': return 'from-indigo-500 to-blue-500';
      default: return 'from-wonderwhiz-bright-pink to-purple-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 mt-8 first:mt-4"
    >
      <div className={`bg-gradient-to-r ${getHeaderColor()} p-0.5 rounded-lg`}>
        <div className="bg-wonderwhiz-deep-purple/90 rounded-[7px] p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white/10 p-2 rounded-full mr-3">
              {getChapterIcon()}
            </div>
            
            <div>
              <h2 className="text-white font-semibold text-lg">
                {title}
                <span className="text-white/50 ml-2 text-sm font-normal">
                  Chapter {index + 1} of {totalChapters}
                </span>
              </h2>
              <p className="text-white/70 text-sm">{description}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
