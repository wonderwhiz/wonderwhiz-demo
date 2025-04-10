
import React from 'react';
import { motion } from 'framer-motion';
import { LightbulbIcon, Brain, Book, Mountain, Palette, Sparkles, Map } from 'lucide-react';

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
  // Function to get the appropriate icon based on chapter ID
  const getChapterIcon = () => {
    switch(chapterId) {
      case 'introduction':
        return <LightbulbIcon className="w-5 h-5 text-wonderwhiz-vibrant-yellow" />;
      case 'exploration':
        return <Mountain className="w-5 h-5 text-emerald-400" />;
      case 'understanding':
        return <Book className="w-5 h-5 text-wonderwhiz-cyan" />;
      case 'challenge':
        return <Brain className="w-5 h-5 text-wonderwhiz-bright-pink" />;
      case 'creation':
        return <Palette className="w-5 h-5 text-purple-400" />;
      case 'reflection':
        return <Sparkles className="w-5 h-5 text-wonderwhiz-gold" />;
      case 'nextSteps':
        return <Map className="w-5 h-5 text-indigo-400" />;
      default:
        return <LightbulbIcon className="w-5 h-5 text-wonderwhiz-vibrant-yellow" />;
    }
  };

  // Function to get chapter-specific colors
  const getChapterColors = () => {
    switch(chapterId) {
      case 'introduction':
        return 'from-yellow-500/10 to-amber-600/10 border-yellow-500/20';
      case 'exploration':
        return 'from-emerald-500/10 to-green-600/10 border-emerald-500/20';
      case 'understanding':
        return 'from-cyan-500/10 to-blue-600/10 border-cyan-500/20';
      case 'challenge':
        return 'from-pink-500/10 to-rose-600/10 border-pink-500/20';
      case 'creation':
        return 'from-purple-500/10 to-violet-600/10 border-purple-500/20';
      case 'reflection':
        return 'from-amber-500/10 to-orange-600/10 border-amber-500/20';
      case 'nextSteps':
        return 'from-indigo-500/10 to-blue-600/10 border-indigo-500/20';
      default:
        return 'from-wonderwhiz-bright-pink/10 to-wonderwhiz-vibrant-yellow/10 border-wonderwhiz-bright-pink/20';
    }
  };

  const colors = getChapterColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className={`relative my-5 bg-gradient-to-r ${colors} backdrop-blur-sm border border-l-[3px] rounded-lg overflow-hidden`}
    >
      <div className="p-3 sm:p-4">
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
          <div className="bg-white/10 p-2.5 rounded-full flex items-center justify-center">
            {getChapterIcon()}
          </div>
          
          <div>
            <h3 className="text-white font-bold text-sm sm:text-base font-nunito">{title}</h3>
            <p className="text-white/60 text-xs font-inter">{description}</p>
          </div>
          
          <div className="absolute top-0 right-0 sm:top-auto sm:right-0 text-white/30 text-xs font-medium">
            {index + 1} / {totalChapters}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
