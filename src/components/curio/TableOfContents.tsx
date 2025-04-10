
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Book, Mountain, Palette, LightbulbIcon, Map } from 'lucide-react';

export type ChapterIconType = 'introduction' | 'exploration' | 'understanding' | 'challenge' | 'creation' | 'reflection' | 'nextSteps';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: ChapterIconType;
  isCompleted: boolean;
  isActive: boolean;
}

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
  // Render the appropriate icon based on chapter type
  const renderIcon = (iconType: ChapterIconType) => {
    switch(iconType) {
      case 'introduction':
        return <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5 text-wonderwhiz-vibrant-yellow" />;
      case 'exploration':
        return <Mountain className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />;
      case 'understanding':
        return <Book className="w-4 h-4 sm:w-5 sm:h-5 text-wonderwhiz-cyan" />;
      case 'challenge':
        return <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-wonderwhiz-bright-pink" />;
      case 'creation':
        return <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />;
      case 'reflection':
        return <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-wonderwhiz-gold" />;
      case 'nextSteps':
        return <Map className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />;
      default:
        return <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5 text-wonderwhiz-vibrant-yellow" />;
    }
  };

  // Adapt UI based on age group
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          title: "text-base font-bold",
          fontSize: "text-xs"
        };
      case '12-16':
        return {
          title: "text-lg font-semibold",
          fontSize: "text-sm"
        };
      default: // 8-11
        return {
          title: "text-base font-semibold",
          fontSize: "text-xs"
        };
    }
  };

  const styles = getAgeGroupStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-5"
    >
      <h3 className={`mb-3 text-white ${styles.title} font-nunito flex items-center`}>
        <div className="w-6 h-1 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full mr-2"></div>
        Your Learning Journey
      </h3>
      
      {/* Desktop version - horizontal display */}
      <div className="hidden md:flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="flex space-x-2">
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              onClick={() => onChapterClick(chapter.id)}
              className={`flex-shrink-0 flex flex-col items-center p-2.5 rounded-lg transition-all duration-200 ${
                chapter.isActive 
                  ? 'bg-white/15 border border-white/20 shadow-sm shadow-wonderwhiz-bright-pink/5' 
                  : chapter.isCompleted 
                    ? 'hover:bg-white/10 border border-white/10' 
                    : 'hover:bg-white/5 border border-white/5'
              }`}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className={`${
                chapter.isCompleted ? 'bg-white/15' : 'bg-white/5'
              } rounded-full p-2 mb-1.5 transition-colors duration-200`}>
                {renderIcon(chapter.icon)}
              </div>
              <span className="text-white font-medium text-xs mb-0.5 font-nunito">{chapter.title}</span>
              <span className="text-white/50 text-[10px] text-center max-w-[90px] font-inter">{chapter.description}</span>
              
              {chapter.isCompleted && (
                <div className="mt-1.5 text-[10px] px-1.5 py-0.5 bg-wonderwhiz-vibrant-yellow/10 text-wonderwhiz-vibrant-yellow rounded-full">
                  ✓
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Mobile version - vertical compact list */}
      <div className="md:hidden space-y-1">
        {chapters.map((chapter, index) => (
          <motion.button
            key={chapter.id}
            onClick={() => onChapterClick(chapter.id)}
            className={`w-full flex items-center p-2 rounded-lg transition-all duration-200 ${
              chapter.isActive 
                ? 'bg-white/15 border border-white/20' 
                : chapter.isCompleted 
                  ? 'hover:bg-white/10 border border-white/10' 
                  : 'hover:bg-white/5 border border-white/5'
            }`}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.03 }}
          >
            <div className={`${
              chapter.isCompleted ? 'bg-white/15' : 'bg-white/5'
            } rounded-full p-1.5 mr-2.5 flex-shrink-0 transition-colors duration-200`}>
              {renderIcon(chapter.icon)}
            </div>
            <div className="flex-grow text-left">
              <div className="text-white text-xs font-medium font-nunito">{chapter.title}</div>
              <div className="text-white/50 text-[10px] font-inter">{chapter.description}</div>
            </div>
            {chapter.isCompleted && (
              <div className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-wonderwhiz-vibrant-yellow/10 text-wonderwhiz-vibrant-yellow rounded-full flex-shrink-0">
                ✓
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TableOfContents;
