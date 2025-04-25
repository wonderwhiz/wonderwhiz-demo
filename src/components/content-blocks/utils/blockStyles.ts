import { cva } from 'class-variance-authority';
import { ContentBlockType } from '@/types/curio';

export const blockContainer = cva(
  "p-6 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:scale-[1.01] hover:shadow-xl",
  {
    variants: {
      type: {
        fact: "bg-gradient-to-br from-wonderwhiz-cyan/20 via-wonderwhiz-blue/20 to-transparent border-wonderwhiz-cyan/30 hover:from-wonderwhiz-cyan/30 hover:to-wonderwhiz-blue/30 transform-gpu",
        quiz: "bg-gradient-to-br from-wonderwhiz-bright-pink/20 via-wonderwhiz-purple/20 to-transparent border-wonderwhiz-bright-pink/30 hover:from-wonderwhiz-bright-pink/30 hover:to-wonderwhiz-purple/30 transform-gpu",
        flashcard: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 via-wonderwhiz-orange/20 to-transparent border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30 transform-gpu",
        creative: "bg-gradient-to-br from-wonderwhiz-green/20 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30 transform-gpu",
        task: "bg-gradient-to-br from-wonderwhiz-orange/20 via-wonderwhiz-vibrant-yellow/20 to-transparent border-wonderwhiz-orange/30 hover:from-wonderwhiz-orange/30 hover:to-wonderwhiz-vibrant-yellow/30 transform-gpu",
        news: "bg-gradient-to-br from-wonderwhiz-blue-accent/20 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-blue-accent/30 hover:from-wonderwhiz-blue-accent/30 hover:to-wonderwhiz-cyan/30 transform-gpu",
        riddle: "bg-gradient-to-br from-wonderwhiz-purple/20 via-wonderwhiz-bright-pink/20 to-transparent border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-bright-pink/30 transform-gpu",
        funFact: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/20 via-wonderwhiz-orange/20 to-transparent border-wonderwhiz-vibrant-yellow/30 hover:from-wonderwhiz-vibrant-yellow/30 hover:to-wonderwhiz-orange/30 transform-gpu animate-pulse-slow",
        activity: "bg-gradient-to-br from-wonderwhiz-green/20 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-green/30 hover:from-wonderwhiz-green/30 hover:to-wonderwhiz-cyan/30 transform-gpu",
        mindfulness: "bg-gradient-to-br from-wonderwhiz-purple/20 via-wonderwhiz-blue/20 to-transparent border-wonderwhiz-purple/30 hover:from-wonderwhiz-purple/30 hover:to-wonderwhiz-blue/30 transform-gpu"
      },
      childAge: {
        young: "text-lg leading-relaxed space-y-4 p-6 [&_button]:text-lg [&_button]:p-4",
        middle: "text-base leading-relaxed space-y-3 p-5 [&_button]:text-base [&_button]:p-3",
        older: "text-sm leading-relaxed space-y-2 p-4 [&_button]:text-sm [&_button]:p-2"
      },
      interactive: {
        true: "cursor-pointer transform-gpu transition-transform duration-200 hover:scale-102 active:scale-98",
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
      button: "px-4 py-3 text-lg rounded-xl font-medium active:scale-95 transition-all duration-200",
      icon: "h-5 w-5 mr-2 animate-bounce-subtle",
      panel: "p-4 rounded-xl mt-4 bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm",
      animation: "hover:scale-105 active:scale-95"
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
