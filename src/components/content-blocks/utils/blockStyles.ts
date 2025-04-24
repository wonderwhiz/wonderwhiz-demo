
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
        task: "bg-gradient-to-br from-wonderwhiz-orange/20 to-wonderwhiz-vibrant-yellow/20 border-wonderwhiz-orange/30 hover:from-wonderwhiz-orange/30 hover:to-wonderwhiz-vibrant-yellow/30",
        news: "bg-gradient-to-br from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 border-wonderwhiz-blue-accent/30 hover:from-wonderwhiz-blue-accent/30 hover:to-wonderwhiz-cyan/30",
        riddle: "bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-bright-pink/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30",
        funFact: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 to-wonderwhiz-orange/20 border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30",
        activity: "bg-gradient-to-br from-wonderwhiz-green/20 to-wonderwhiz-cyan/20 border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30",
        mindfulness: "bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-blue/20 border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-blue/30"
      },
      childAge: {
        young: "text-lg leading-relaxed space-y-4 p-6",
        middle: "text-base leading-relaxed space-y-3 p-5",
        older: "text-sm leading-relaxed space-y-2 p-4"
      },
      interactive: {
        true: "hover:shadow-xl cursor-pointer",
        false: ""
      }
    },
    defaultVariants: {
      type: "fact",
      childAge: "middle",
      interactive: false
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

export const getInteractionStyles = (childAge: number = 10) => {
  if (childAge <= 7) {
    return {
      button: "px-4 py-3 text-lg rounded-xl",
      icon: "h-5 w-5 mr-2",
      panel: "p-4 rounded-xl mt-4",
      animation: "hover:scale-105"
    };
  }
  
  if (childAge <= 11) {
    return {
      button: "px-3 py-2 text-base rounded-lg",
      icon: "h-4 w-4 mr-1.5",
      panel: "p-3 rounded-lg mt-3",
      animation: "hover:scale-102"
    };
  }
  
  return {
    button: "px-2 py-1.5 text-sm rounded-md",
    icon: "h-3.5 w-3.5 mr-1",
    panel: "p-2 rounded-md mt-2",
    animation: ""
  };
};
