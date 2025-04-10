
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Globe, Brain, Rocket, PencilRuler, BookOpen, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  // Map chapter IDs to icons
  const getChapterIcon = (id: string) => {
    switch (id) {
      case 'introduction': return <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
      case 'exploration': return <Globe className="h-5 w-5 text-wonderwhiz-bright-pink" />;
      case 'understanding': return <Brain className="h-5 w-5 text-wonderwhiz-cyan" />;
      case 'challenge': return <Rocket className="h-5 w-5 text-wonderwhiz-orange" />;
      case 'creation': return <PencilRuler className="h-5 w-5 text-wonderwhiz-gold" />;
      case 'reflection': return <BookOpen className="h-5 w-5 text-wonderwhiz-green" />;
      case 'nextSteps': return <Sparkles className="h-5 w-5 text-wonderwhiz-blue-accent" />;
      default: return <Lightbulb className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />;
    }
  };

  // Map chapter IDs to background gradients
  const getChapterGradient = (id: string) => {
    switch (id) {
      case 'introduction': return 'from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-vibrant-yellow/5';
      case 'exploration': return 'from-wonderwhiz-bright-pink/20 to-wonderwhiz-bright-pink/5';
      case 'understanding': return 'from-wonderwhiz-cyan/20 to-wonderwhiz-cyan/5';
      case 'challenge': return 'from-wonderwhiz-orange/20 to-wonderwhiz-orange/5';
      case 'creation': return 'from-wonderwhiz-gold/20 to-wonderwhiz-gold/5';
      case 'reflection': return 'from-wonderwhiz-green/20 to-wonderwhiz-green/5';
      case 'nextSteps': return 'from-wonderwhiz-blue-accent/20 to-wonderwhiz-blue-accent/5';
      default: return 'from-white/15 to-white/5';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "my-8 p-4 rounded-xl bg-gradient-to-r border",
        getChapterGradient(chapterId),
        index === 0 ? "border-wonderwhiz-vibrant-yellow/30" : "border-white/10"
      )}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
          {getChapterIcon(chapterId)}
        </div>
        
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-nunito font-bold text-white">{title}</h3>
            <span className="text-xs text-white/50 font-inter">
              Chapter {index + 1}/{totalChapters}
            </span>
          </div>
          <p className="text-sm text-white/70 font-inter mt-0.5">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
