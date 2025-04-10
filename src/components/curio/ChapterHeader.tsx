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
        return 'from-yellow-500/20 to-amber-600/20 border-yellow-500/30';
      case 'exploration':
        return 'from-emerald-500/20 to-green-600/20 border-emerald-500/30';
      case 'understanding':
        return 'from-cyan-500/20 to-blue-600/20 border-cyan-500/30';
      case 'challenge':
        return 'from-pink-500/20 to-rose-600/20 border-pink-500/30';
      case 'creation':
        return 'from-purple-500/20 to-violet-600/20 border-purple-500/30';
      case 'reflection':
        return 'from-amber-500/20 to-orange-600/20 border-amber-500/30';
      case 'nextSteps':
        return 'from-indigo-500/20 to-blue-600/20 border-indigo-500/30';
      default:
        return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/20 border-wonderwhiz-bright-pink/30';
    }
  };

  const colors = getChapterColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative my-8 bg-gradient-to-r ${colors} backdrop-blur-sm border border-l-4 rounded-lg overflow-hidden`}
    >
      <div className="p-4 sm:p-6">
        {/* Small decorative elements in the background */}
        <svg 
          className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 text-white/5 transform translate-x-8 -translate-y-8"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="currentColor" />
        </svg>
        
        <svg 
          className="absolute bottom-0 left-0 w-16 h-16 text-white/5 transform -translate-x-8 translate-y-8"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="50" fill="currentColor" />
        </svg>
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="bg-white/10 p-3 rounded-full">
            {getChapterIcon()}
          </div>
          
          <div>
            <h3 className="text-white font-bold text-lg sm:text-xl">{title}</h3>
            <p className="text-white/70 text-sm sm:text-base">{description}</p>
          </div>
          
          <div className="absolute top-0 right-0 text-white/40 text-xs sm:text-sm">
            {index + 1} / {totalChapters}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
