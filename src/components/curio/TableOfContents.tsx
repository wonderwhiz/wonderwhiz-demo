
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Brain, Lightbulb, Sparkles, Flame, PenTool, ArrowRight } from 'lucide-react';

export type ChapterIconType = "introduction" | "exploration" | "understanding" | "challenge" | "creation" | "reflection" | "nextSteps";

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
  const getChapterIcon = (iconType: ChapterIconType) => {
    switch(iconType) {
      case 'introduction': return <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
      case 'exploration': return <Compass className="h-5 w-5 text-wonderwhiz-bright-pink" />;
      case 'understanding': return <Brain className="h-5 w-5 text-wonderwhiz-cyan" />;
      case 'challenge': return <Sparkles className="h-5 w-5 text-wonderwhiz-gold" />;
      case 'creation': return <PenTool className="h-5 w-5 text-emerald-400" />;
      case 'reflection': return <Flame className="h-5 w-5 text-wonderwhiz-bright-pink" />;
      case 'nextSteps': return <ArrowRight className="h-5 w-5 text-wonderwhiz-blue-accent" />;
      default: return <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
    }
  };
  
  const getAdaptedDescription = (description: string) => {
    if (ageGroup === '5-7') {
      return description.replace(/deeper|connections|apply/g, 'fun');
    } else if (ageGroup === '12-16') {
      return description.replace(/basics|dive deeper|connections/g, 'critical thinking');
    }
    return description;
  };

  return (
    <div className="mb-8 overflow-x-auto py-2" data-age-group={ageGroup}>
      <h2 className="text-lg sm:text-xl font-bold text-white mb-4 font-nunito">Your Learning Journey</h2>
      
      <div className="flex space-x-3 pb-2 min-w-max">
        {chapters.map((chapter, index) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            onClick={() => onChapterClick(chapter.id)}
            className={`
              relative flex-shrink-0 w-28 cursor-pointer rounded-lg overflow-hidden 
              ${chapter.isActive ? 'ring-2 ring-wonderwhiz-bright-pink' : 'ring-1 ring-white/10'} 
              ${chapter.isCompleted ? 'bg-white/20' : 'bg-white/5'}
              transition-all duration-300 group
            `}
          >
            <div className="p-3">
              <div className={`
                rounded-full w-10 h-10 flex items-center justify-center mb-2
                ${chapter.isCompleted ? 'bg-wonderwhiz-bright-pink/20' : 'bg-white/10'}
              `}>
                {getChapterIcon(chapter.icon)}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-white">{chapter.title}</h3>
                <p className="text-xs text-white/60 mt-1">{getAdaptedDescription(chapter.description)}</p>
              </div>
              
              {chapter.isCompleted && (
                <div className="absolute top-2 right-2 bg-wonderwhiz-bright-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  ✓
                </div>
              )}
              
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-bright-pink/20 opacity-0 group-hover:opacity-100 transition-opacity"
                animate={chapter.isActive ? { opacity: 0.2 } : {}}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TableOfContents;
