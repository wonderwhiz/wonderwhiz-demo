
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Compass, Brain, Sparkles, PenTool, Flame, ArrowRight } from 'lucide-react';

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

  // Get background style based on chapter type
  const getBackgroundStyle = () => {
    switch(chapterId) {
      case 'introduction': return 'from-wonderwhiz-vibrant-yellow/20 to-transparent';
      case 'exploration': return 'from-wonderwhiz-bright-pink/20 to-transparent';
      case 'understanding': return 'from-wonderwhiz-cyan/20 to-transparent';
      case 'challenge': return 'from-wonderwhiz-gold/20 to-transparent';
      case 'creation': return 'from-emerald-400/20 to-transparent';
      case 'reflection': return 'from-wonderwhiz-bright-pink/20 to-transparent';
      case 'nextSteps': return 'from-wonderwhiz-blue-accent/20 to-transparent';
      default: return 'from-wonderwhiz-vibrant-yellow/20 to-transparent';
    }
  };

  return (
    <motion.div 
      className="mb-5 mt-8 pt-6 relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Animated background gradient */}
      <div className={`absolute top-0 left-0 right-0 h-16 bg-gradient-to-r ${getBackgroundStyle()} opacity-25 rounded-t-xl -z-10`} />
      
      {/* Connecting lines to show progress */}
      {index > 0 && (
        <div className="absolute top-0 left-6 w-0.5 h-6 bg-white/10" />
      )}
      {index < totalChapters - 1 && (
        <div className="absolute bottom-0 left-6 w-0.5 h-full bg-white/10" />
      )}
      
      {/* Chapter indicator */}
      <div className="flex items-center mb-3">
        <div className={`
          w-12 h-12 rounded-full flex items-center justify-center
          bg-wonderwhiz-deep-purple border-2 border-white/20
          shadow-lg shadow-wonderwhiz-bright-pink/10
        `}>
          {getChapterIcon()}
        </div>
        
        <div className="ml-4">
          <h2 className="text-xl font-bold text-white font-nunito">{title}</h2>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
