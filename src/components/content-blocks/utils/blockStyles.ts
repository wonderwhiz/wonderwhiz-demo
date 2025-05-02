
import { cva } from 'class-variance-authority';
import { ContentBlockType } from '@/types/curio';

export const blockContainer = cva(
  "p-6 rounded-2xl shadow-2xl backdrop-blur-lg border border-white/15 transition-all duration-500 group relative overflow-hidden",
  {
    variants: {
      type: {
        fact: "bg-gradient-to-br from-wonderwhiz-cyan/30 via-wonderwhiz-blue/20 to-transparent border-wonderwhiz-cyan/30 hover:border-wonderwhiz-cyan/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(0,226,255,0.25)] transform-gpu",
        quiz: "bg-gradient-to-br from-wonderwhiz-bright-pink/30 via-wonderwhiz-purple/20 to-transparent border-wonderwhiz-bright-pink/30 hover:border-wonderwhiz-bright-pink/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(255,91,163,0.25)] transform-gpu",
        flashcard: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 via-wonderwhiz-orange/20 to-transparent border-wonderwhiz-vibrant-yellow/30 hover:border-wonderwhiz-vibrant-yellow/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(255,213,79,0.25)] transform-gpu",
        creative: "bg-gradient-to-br from-wonderwhiz-green/30 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-green/30 hover:border-wonderwhiz-green/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(0,214,143,0.25)] transform-gpu",
        task: "bg-gradient-to-br from-wonderwhiz-orange/30 via-wonderwhiz-vibrant-yellow/20 to-transparent border-wonderwhiz-orange/30 hover:border-wonderwhiz-orange/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(255,150,79,0.25)] transform-gpu",
        news: "bg-gradient-to-br from-wonderwhiz-blue-accent/30 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-blue-accent/30 hover:border-wonderwhiz-blue-accent/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(79,217,255,0.25)] transform-gpu",
        riddle: "bg-gradient-to-br from-wonderwhiz-purple/30 via-wonderwhiz-bright-pink/20 to-transparent border-wonderwhiz-purple/30 hover:border-wonderwhiz-purple/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(79,255,195,0.25)] transform-gpu",
        funFact: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/30 via-wonderwhiz-orange/20 to-transparent border-wonderwhiz-vibrant-yellow/30 hover:border-wonderwhiz-vibrant-yellow/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(255,213,79,0.25)] transform-gpu animate-pulse-soft",
        activity: "bg-gradient-to-br from-wonderwhiz-green/30 via-wonderwhiz-cyan/20 to-transparent border-wonderwhiz-green/30 hover:border-wonderwhiz-green/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(0,214,143,0.25)] transform-gpu",
        mindfulness: "bg-gradient-to-br from-wonderwhiz-purple/30 via-wonderwhiz-blue/20 to-transparent border-wonderwhiz-purple/30 hover:border-wonderwhiz-purple/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25),0_0_20px_rgba(126,48,225,0.25)] transform-gpu"
      },
      childAge: {
        young: "text-xl leading-relaxed space-y-6 p-8 [&_button]:text-lg [&_button]:p-4 [&_img]:rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        middle: "text-lg leading-relaxed space-y-4 p-6 [&_button]:text-base [&_button]:p-3 [&_img]:rounded-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        older: "text-base leading-relaxed space-y-3 p-5 [&_button]:text-sm [&_button]:p-2 [&_img]:rounded-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100"
      },
      interactive: {
        true: "cursor-pointer transform-gpu transition-transform duration-300 hover:scale-102 active:scale-98",
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
      button: "px-6 py-4 text-xl rounded-2xl font-medium active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl",
      icon: "h-6 w-6 mr-3 animate-bounce-gentle",
      panel: "p-6 rounded-2xl mt-6 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg border-2 border-white/20",
      animation: "hover:scale-106 active:scale-95"
    };
  }
  
  if (childAge <= 11) {
    return {
      button: "px-4 py-3 text-lg rounded-xl shadow-md hover:shadow-lg",
      icon: "h-5 w-5 mr-2",
      panel: "p-4 rounded-xl mt-4 border border-white/10",
      animation: "hover:scale-103"
    };
  }
  
  return {
    button: "px-3 py-2 text-base rounded-lg",
    icon: "h-4 w-4 mr-1.5",
    panel: "p-3 rounded-lg mt-3",
    animation: "hover:scale-101"
  };
};
