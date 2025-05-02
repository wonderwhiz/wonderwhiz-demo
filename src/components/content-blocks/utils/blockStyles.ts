import { cva } from 'class-variance-authority';
import { ContentBlockType } from '@/types/curio';

export const blockContainer = cva(
  "p-6 rounded-2xl shadow-2xl backdrop-blur-xl border border-white/20 transition-all duration-500 group relative overflow-hidden",
  {
    variants: {
      type: {
        fact: "bg-gradient-to-br from-wonderwhiz-cyan/45 via-wonderwhiz-blue/35 to-transparent border-wonderwhiz-cyan/40 hover:border-wonderwhiz-cyan/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(0,226,255,0.35)] transform-gpu hover:translate-y-[-2px]",
        quiz: "bg-gradient-to-br from-wonderwhiz-bright-pink/45 via-wonderwhiz-purple/35 to-transparent border-wonderwhiz-bright-pink/40 hover:border-wonderwhiz-bright-pink/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(255,91,163,0.35)] transform-gpu hover:translate-y-[-2px]",
        flashcard: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-orange/35 to-transparent border-wonderwhiz-vibrant-yellow/40 hover:border-wonderwhiz-vibrant-yellow/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(255,213,79,0.35)] transform-gpu hover:translate-y-[-2px]",
        creative: "bg-gradient-to-br from-wonderwhiz-green/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-green/40 hover:border-wonderwhiz-green/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(0,214,143,0.35)] transform-gpu hover:translate-y-[-2px]",
        task: "bg-gradient-to-br from-wonderwhiz-orange/45 via-wonderwhiz-vibrant-yellow/35 to-transparent border-wonderwhiz-orange/40 hover:border-wonderwhiz-orange/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(255,150,79,0.35)] transform-gpu hover:translate-y-[-2px]",
        news: "bg-gradient-to-br from-wonderwhiz-blue-accent/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-blue-accent/40 hover:border-wonderwhiz-blue-accent/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(79,217,255,0.35)] transform-gpu hover:translate-y-[-2px]",
        riddle: "bg-gradient-to-br from-wonderwhiz-purple/45 via-wonderwhiz-bright-pink/35 to-transparent border-wonderwhiz-purple/40 hover:border-wonderwhiz-purple/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(79,255,195,0.35)] transform-gpu hover:translate-y-[-2px]",
        funFact: "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-orange/35 to-transparent border-wonderwhiz-vibrant-yellow/40 hover:border-wonderwhiz-vibrant-yellow/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(255,213,79,0.35)] transform-gpu hover:translate-y-[-2px] animate-pulse-soft",
        activity: "bg-gradient-to-br from-wonderwhiz-green/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-green/40 hover:border-wonderwhiz-green/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(0,214,143,0.35)] transform-gpu hover:translate-y-[-2px]",
        mindfulness: "bg-gradient-to-br from-wonderwhiz-purple/45 via-wonderwhiz-blue/35 to-transparent border-wonderwhiz-purple/40 hover:border-wonderwhiz-purple/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3),0_0_20px_rgba(126,48,225,0.35)] transform-gpu hover:translate-y-[-2px]"
      },
      childAge: {
        young: "text-xl leading-relaxed space-y-6 p-8 [&_button]:text-lg [&_button]:p-4 [&_img]:rounded-2xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100",
        middle: "text-lg leading-relaxed space-y-4 p-6 [&_button]:text-base [&_button]:p-3 [&_img]:rounded-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
        older: "text-base leading-relaxed space-y-3 p-5 [&_button]:text-sm [&_button]:p-2 [&_img]:rounded-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/5 before:to-transparent before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100"
      },
      interactive: {
        true: "cursor-pointer transform-gpu transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98]",
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
      button: "px-6 py-4 text-xl rounded-full font-medium active:scale-95 transition-all duration-300 shadow-lg hover:shadow-xl",
      icon: "h-6 w-6 mr-3 animate-bounce-gentle",
      panel: "p-6 rounded-2xl mt-6 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-lg border-2 border-white/20",
      animation: "hover:scale-[1.06] active:scale-95"
    };
  }
  
  if (childAge <= 11) {
    return {
      button: "px-4 py-3 text-lg rounded-xl shadow-md hover:shadow-lg",
      icon: "h-5 w-5 mr-2",
      panel: "p-4 rounded-xl mt-4 border border-white/10",
      animation: "hover:scale-[1.03]"
    };
  }
  
  return {
    button: "px-3 py-2 text-base rounded-lg",
    icon: "h-4 w-4 mr-1.5",
    panel: "p-3 rounded-lg mt-3",
    animation: "hover:scale-[1.01]"
  };
};

// 2025 Design System Enhancements
export const modernGlowEffect = (color: string, intensity: number = 1) => {
  const intensityMap = {
    1: '0.15',
    2: '0.25',
    3: '0.35'
  };
  const opacity = intensityMap[intensity as keyof typeof intensityMap] || '0.2';
  
  return `0 8px 32px rgba(${color}, ${opacity})`;
};

export const glassmorphismEffect = (opacity: number = 0.1) => {
  return `backdrop-blur-xl bg-white/${opacity} border border-white/${opacity*2}`;
};

export const neuomorphicShadow = (isDark: boolean = true) => {
  return isDark 
    ? 'shadow-[6px_6px_10px_rgba(0,0,0,0.2),-6px_-6px_10px_rgba(255,255,255,0.05)]'
    : 'shadow-[6px_6px_10px_rgba(0,0,0,0.1),-6px_-6px_10px_rgba(255,255,255,0.7)]';
};

export const floatingEffect = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const pulseAnimation = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// The shift to a more dynamic and sophisticated interaction pattern for blocks
export const getModernBlockStyle = (type: ContentBlockType, childAge: number = 10) => {
  const baseClasses = "rounded-2xl overflow-hidden backdrop-filter backdrop-blur-xl border-2 transition-all duration-300 flex flex-col";
  
  const intensityByAge = childAge <= 7 ? 3 : childAge <= 11 ? 2 : 1;
  
  const typeStyles = {
    fact: `${baseClasses} bg-gradient-to-br from-wonderwhiz-cyan/45 via-wonderwhiz-blue/35 to-transparent border-wonderwhiz-cyan/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-cyan/80`,
    quiz: `${baseClasses} bg-gradient-to-br from-wonderwhiz-bright-pink/45 via-wonderwhiz-purple/35 to-transparent border-wonderwhiz-bright-pink/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-bright-pink/80`,
    flashcard: `${baseClasses} bg-gradient-to-br from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-orange/35 to-transparent border-wonderwhiz-vibrant-yellow/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-vibrant-yellow/80`,
    creative: `${baseClasses} bg-gradient-to-br from-wonderwhiz-green/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-green/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-green/80`,
    task: `${baseClasses} bg-gradient-to-br from-wonderwhiz-orange/45 via-wonderwhiz-vibrant-yellow/35 to-transparent border-wonderwhiz-orange/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-orange/80`,
    news: `${baseClasses} bg-gradient-to-br from-wonderwhiz-blue-accent/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-blue-accent/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-blue-accent/80`,
    riddle: `${baseClasses} bg-gradient-to-br from-wonderwhiz-purple/45 via-wonderwhiz-bright-pink/35 to-transparent border-wonderwhiz-purple/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-purple/80`,
    funFact: `${baseClasses} bg-gradient-to-br from-wonderwhiz-vibrant-yellow/45 via-wonderwhiz-orange/35 to-transparent border-wonderwhiz-vibrant-yellow/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-vibrant-yellow/80`,
    activity: `${baseClasses} bg-gradient-to-br from-wonderwhiz-green/45 via-wonderwhiz-cyan/35 to-transparent border-wonderwhiz-green/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-green/80`,
    mindfulness: `${baseClasses} bg-gradient-to-br from-wonderwhiz-purple/45 via-wonderwhiz-blue/35 to-transparent border-wonderwhiz-purple/60 hover:shadow-[0_12px_36px_rgba(0,0,0,0.35)] hover:border-wonderwhiz-purple/80`
  };

  return typeStyles[type] || typeStyles.fact;
};

// New 2025 animation framework
export const blockAnimations = {
  entrance: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 10
    }
  },
  highlight: {
    animate: {
      boxShadow: [
        "0 0 0 rgba(255,255,255,0)",
        "0 0 20px rgba(255,255,255,0.5)",
        "0 0 0 rgba(255,255,255,0)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  }
};
