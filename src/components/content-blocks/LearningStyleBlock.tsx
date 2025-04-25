
import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Ear, Hand, Brain, Users, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'logical' | 'social' | 'reading';

interface LearningStyleBlockProps {
  style: LearningStyle;
  title: string;
  description: string;
  onSelect: () => void;
  childAge?: number;
  selected?: boolean;
  className?: string;
}

const LearningStyleBlock: React.FC<LearningStyleBlockProps> = ({
  style,
  title,
  description,
  onSelect,
  childAge = 10,
  selected = false,
  className
}) => {
  // Style-specific styling
  const getStyleInfo = () => {
    switch (style) {
      case 'visual':
        return {
          icon: <Eye />,
          gradient: 'from-blue-600/30 to-blue-700/10',
          hoverGradient: 'hover:from-blue-500/40 hover:to-blue-600/20',
          selectedGradient: 'from-blue-500/50 to-blue-600/30',
          borderColor: selected ? 'border-blue-400' : 'border-white/10',
          iconColor: 'text-blue-400',
          title: childAge <= 8 ? 'Looking' : 'Visual'
        };
      case 'auditory':
        return {
          icon: <Ear />,
          gradient: 'from-purple-600/30 to-purple-700/10',
          hoverGradient: 'hover:from-purple-500/40 hover:to-purple-600/20',
          selectedGradient: 'from-purple-500/50 to-purple-600/30',
          borderColor: selected ? 'border-purple-400' : 'border-white/10',
          iconColor: 'text-purple-400',
          title: childAge <= 8 ? 'Listening' : 'Auditory'
        };
      case 'kinesthetic':
        return {
          icon: <Hand />,
          gradient: 'from-emerald-600/30 to-emerald-700/10',
          hoverGradient: 'hover:from-emerald-500/40 hover:to-emerald-600/20',
          selectedGradient: 'from-emerald-500/50 to-emerald-600/30',
          borderColor: selected ? 'border-emerald-400' : 'border-white/10',
          iconColor: 'text-emerald-400',
          title: childAge <= 8 ? 'Doing' : 'Hands-On'
        };
      case 'logical':
        return {
          icon: <Brain />,
          gradient: 'from-amber-600/30 to-amber-700/10',
          hoverGradient: 'hover:from-amber-500/40 hover:to-amber-600/20',
          selectedGradient: 'from-amber-500/50 to-amber-600/30',
          borderColor: selected ? 'border-amber-400' : 'border-white/10',
          iconColor: 'text-amber-400',
          title: childAge <= 8 ? 'Thinking' : 'Logical'
        };
      case 'social':
        return {
          icon: <Users />,
          gradient: 'from-pink-600/30 to-pink-700/10',
          hoverGradient: 'hover:from-pink-500/40 hover:to-pink-600/20',
          selectedGradient: 'from-pink-500/50 to-pink-600/30',
          borderColor: selected ? 'border-pink-400' : 'border-white/10',
          iconColor: 'text-pink-400',
          title: childAge <= 8 ? 'Sharing' : 'Social'
        };
      case 'reading':
        return {
          icon: <BookOpen />,
          gradient: 'from-cyan-600/30 to-cyan-700/10',
          hoverGradient: 'hover:from-cyan-500/40 hover:to-cyan-600/20',
          selectedGradient: 'from-cyan-500/50 to-cyan-600/30',
          borderColor: selected ? 'border-cyan-400' : 'border-white/10',
          iconColor: 'text-cyan-400',
          title: childAge <= 8 ? 'Reading' : 'Reading/Writing'
        };
      default:
        return {
          icon: <Eye />,
          gradient: 'from-gray-600/30 to-gray-700/10',
          hoverGradient: 'hover:from-gray-500/40 hover:to-gray-600/20',
          selectedGradient: 'from-gray-500/50 to-gray-600/30',
          borderColor: selected ? 'border-gray-400' : 'border-white/10',
          iconColor: 'text-gray-400',
          title: 'Learning'
        };
    }
  };

  const styleInfo = getStyleInfo();
  const displayTitle = title || styleInfo.title;
  
  // Calculate appropriate sizes based on child age
  const getTextSizes = () => {
    if (childAge <= 8) {
      return {
        title: "text-lg",
        description: "text-sm"
      };
    }
    return {
      title: "text-base",
      description: "text-xs"
    };
  };
  
  const textSizes = getTextSizes();
  
  const gradientClass = selected 
    ? styleInfo.selectedGradient 
    : `${styleInfo.gradient} ${styleInfo.hoverGradient}`;
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        `p-4 rounded-xl bg-gradient-to-br ${gradientClass} cursor-pointer border ${styleInfo.borderColor} transition-all duration-300`,
        className
      )}
      onClick={onSelect}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 bg-white/10 rounded-lg ${styleInfo.iconColor}`}>
          {styleInfo.icon}
        </div>
        <div>
          <h3 className={`font-medium text-white ${textSizes.title}`}>
            {displayTitle}
          </h3>
          <p className={`text-white/80 ${textSizes.description}`}>
            {description}
          </p>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button 
          variant={selected ? "default" : "ghost"} 
          size="sm" 
          className={cn(
            "text-white/80 hover:text-white",
            selected && "bg-white/20 hover:bg-white/30"
          )}
        >
          {selected ? 'Selected' : 'Select'}
        </Button>
      </div>
    </motion.div>
  );
};

export default LearningStyleBlock;
