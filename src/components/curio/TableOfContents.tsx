
import React from 'react';
import { motion } from 'framer-motion';
import { Book, BookOpen, Brain, Rocket, Lightbulb, Sparkles, PencilRuler, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type ChapterIconType = 'introduction' | 'exploration' | 'understanding' | 'challenge' | 'creation' | 'reflection' | 'nextSteps';

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: ChapterIconType;
  isCompleted: boolean;
  isActive: boolean;
}

const chapterIcons = {
  introduction: <Lightbulb />,
  exploration: <Globe />,
  understanding: <Brain />,
  challenge: <Rocket />,
  creation: <PencilRuler />,
  reflection: <BookOpen />,
  nextSteps: <Sparkles />
};

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-indigo-950/70 backdrop-blur-sm rounded-2xl border border-wonderwhiz-light-purple/30 p-5 mb-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-wonderwhiz-cyan/20 to-wonderwhiz-bright-pink/20 flex items-center justify-center border border-white/10">
          <Book className="h-5 w-5 text-wonderwhiz-cyan" />
        </div>
        <div>
          <h3 className="text-xl font-nunito font-bold text-white">Learning Journey</h3>
          <p className="text-sm font-inter text-white/70">Designed for ages {ageGroup}</p>
        </div>
        
        <div className="ml-auto">
          <Badge variant="outline" className="bg-white/5 text-white/80 border-white/20">
            {chapters.filter(ch => ch.isCompleted).length}/{chapters.length} complete
          </Badge>
        </div>
      </div>
      
      <div className="overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-3 min-w-max">
          {chapters.map((chapter, index) => (
            <motion.div
              key={chapter.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Button
                onClick={() => onChapterClick(chapter.id)}
                variant="ghost"
                className={cn(
                  "h-auto flex flex-col items-center py-3 px-4 space-y-2 rounded-xl border transition-all",
                  chapter.isActive 
                    ? "bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-vibrant-yellow/10 border-wonderwhiz-bright-pink/40"
                    : chapter.isCompleted
                      ? "bg-wonderwhiz-green/10 border-wonderwhiz-green/30"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  chapter.isActive 
                    ? "bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink" 
                    : chapter.isCompleted
                      ? "bg-wonderwhiz-green/20 text-wonderwhiz-green"
                      : "bg-white/10 text-white/70"
                )}>
                  {React.cloneElement(chapterIcons[chapter.icon] || <Book />, { className: "h-5 w-5" })}
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  chapter.isActive 
                    ? "text-white" 
                    : chapter.isCompleted
                      ? "text-wonderwhiz-green"
                      : "text-white/70"
                )}>
                  {chapter.title}
                </span>
              </Button>
              
              {index < chapters.length - 1 && (
                <div className={cn(
                  "absolute top-1/2 -right-2 w-2 h-0.5",
                  chapter.isCompleted ? "bg-wonderwhiz-green/70" : "bg-white/20"
                )} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TableOfContents;
