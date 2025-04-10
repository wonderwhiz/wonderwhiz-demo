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

  // Adapt UI based on age group
  const getAgeGroupStyles = () => {
    switch(ageGroup) {
      case '5-7':
        return {
          title: "text-lg font-bold",
          iconSize: "w-10 h-10",
          spacing: "gap-3",
          fontSize: "text-sm"
        };
      case '12-16':
        return {
          title: "text-xl font-semibold",
          iconSize: "w-6 h-6",
          spacing: "gap-4",
          fontSize: "text-base"
        };
      default: // 8-11
        return {
          title: "text-lg font-semibold",
          iconSize: "w-8 h-8",
          spacing: "gap-3",
          fontSize: "text-sm"
        };
    }
  };

  const styles = getAgeGroupStyles();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h3 className={`mb-4 text-white ${styles.title}`}>Your Knowledge Journey</h3>
      
      {/* Desktop version - horizontal display */}
      <div className="hidden md:flex overflow-x-auto pb-4 mb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <div className="flex space-x-4">
          {chapters.map((chapter, index) => (
            <motion.button
              key={chapter.id}
              onClick={() => onChapterClick(chapter.id)}
              className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg border transition-all duration-300 ${
                chapter.isActive 
                  ? 'bg-white/15 border-white/30' 
                  : chapter.isCompleted 
                    ? 'bg-white/5 border-white/20 hover:bg-white/10' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className={`${chapter.isCompleted ? 'bg-white/20' : 'bg-white/10'} rounded-full p-3 mb-2`}>
                {renderIcon(chapter.icon)}
              </div>
              <span className="text-white font-medium text-sm mb-1">{chapter.title}</span>
              <span className="text-white/60 text-xs text-center max-w-[120px]">{chapter.description}</span>
              
              {chapter.isCompleted && (
                <div className="mt-2 text-xs px-2 py-0.5 bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow rounded-full">
                  Completed
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Mobile version - vertical compact list */}
      <div className="md:hidden space-y-2">
        {chapters.map((chapter, index) => (
          <motion.button
            key={chapter.id}
            onClick={() => onChapterClick(chapter.id)}
            className={`w-full flex items-center p-3 rounded-lg border transition-all duration-300 ${
              chapter.isActive 
                ? 'bg-white/15 border-white/30' 
                : chapter.isCompleted 
                  ? 'bg-white/5 border-white/20' 
                  : 'bg-white/5 border-white/10'
            }`}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className={`${chapter.isCompleted ? 'bg-white/20' : 'bg-white/10'} rounded-full p-2 mr-3 flex-shrink-0`}>
              {renderIcon(chapter.icon)}
            </div>
            <div className="flex-grow text-left">
              <div className="text-white text-sm font-medium">{chapter.title}</div>
              <div className="text-white/60 text-xs">{chapter.description}</div>
            </div>
            {chapter.isCompleted && (
              <div className="ml-2 text-xs px-2 py-0.5 bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow rounded-full flex-shrink-0">
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
