
import { cva } from 'class-variance-authority';
import { ContentBlockType } from '@/types/curio';

export const blockContainer = cva(
  "p-6 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300",
  {
    variants: {
      type: {
        fact: "bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30 hover:from-wonderwhiz-cyan/30 hover:to-wonderwhiz-blue/30",
        quiz: "bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-purple/20 border-wonderwhiz-bright-pink/30 hover:from-wonderwhiz-bright-pink/30 hover:to-wonderwhiz-purple/30",
        flashcard: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30",
        creative: "bg-gradient-to-br from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30",
        task: "bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30",
        news: "bg-gradient-to-br from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue-accent/30 hover:from-wonderwhiz-blue-accent/30 hover:to-wonderwhiz-cyan/30",
        riddle: "bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30",
        funFact: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30",
        activity: "bg-gradient-to-br from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30",
        mindfulness: "bg-gradient-to-br from-wonderwhiz-cyan/20 to-wonderwhiz-blue/20 border-wonderwhiz-cyan/30 hover:from-wonderwhiz-cyan/30 hover:to-wonderwhiz-blue/30"
      },
      childAge: {
        young: "text-lg leading-relaxed",
        middle: "text-base leading-relaxed",
        older: "text-sm leading-relaxed"
      }
    },
    defaultVariants: {
      type: "fact",
      childAge: "middle"
    }
  }
);

export const successAnimation = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.05, 1],
    transition: { duration: 0.5 }
  }
};

export const getSpecialistIconClass = (specialistId: string) => {
  switch (specialistId) {
    case 'nova': return 'text-wonderwhiz-bright-pink';
    case 'spark': return 'text-wonderwhiz-vibrant-yellow';
    case 'prism': return 'text-wonderwhiz-cyan';
    case 'pixel': return 'text-wonderwhiz-blue-accent';
    case 'atlas': return 'text-wonderwhiz-orange';
    case 'lotus': return 'text-wonderwhiz-green';
    default: return 'text-wonderwhiz-purple';
  }
};
