
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import SpecialistAvatar from '@/components/specialists/SpecialistAvatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AgeAdaptiveBlockProps {
  title: string;
  content: ReactNode;
  type: string;
  ageGroup: '5-7' | '8-11' | '12-16';
  specialist: string;
  onInteract?: () => void;
  interactionLabel?: string;
  className?: string;
  children?: ReactNode;
}

const AgeAdaptiveBlock: React.FC<AgeAdaptiveBlockProps> = ({
  title,
  content,
  type,
  ageGroup,
  specialist,
  onInteract,
  interactionLabel = 'Interact',
  className,
  children
}) => {
  // Choose the right color scheme based on block type
  const getBlockColorScheme = () => {
    switch (type) {
      case 'fact':
        return 'from-[#2A1B5D] to-[#1E1139] border-blue-500/60';
      case 'funFact':
        return 'from-[#2A1B5D] to-[#1E1139] border-purple-500/60';
      case 'quiz':
        return 'from-[#2A1B5D] to-[#1E1139] border-amber-500/60';
      case 'creative':
        return 'from-[#2A1B5D] to-[#1E1139] border-pink-500/60';
      case 'activity':
        return 'from-[#2A1B5D] to-[#1E1139] border-green-500/60';
      case 'mindfulness':
        return 'from-[#2A1B5D] to-[#1E1139] border-teal-500/60';
      case 'flashcard':
        return 'from-[#2A1B5D] to-[#1E1139] border-cyan-500/60';
      case 'news':
        return 'from-[#2A1B5D] to-[#1E1139] border-gray-500/60';
      default:
        return 'from-[#2A1B5D] to-[#1E1139] border-indigo-500/60';
    }
  };
  
  // Adjust font size and UI based on age group
  const getFontSize = () => {
    switch (ageGroup) {
      case '5-7':
        return 'text-lg';
      case '8-11':
        return 'text-base';
      case '12-16':
      default:
        return 'text-sm';
    }
  };
  
  const getBlockStyle = () => {
    switch (ageGroup) {
      case '5-7':
        return 'rounded-2xl p-4 border-2';
      case '8-11':
        return 'rounded-xl p-3 border-2';
      case '12-16':
      default:
        return 'rounded-lg p-3 border-2';
    }
  };
  
  return (
    <motion.div
      className={cn(
        `bg-gradient-to-br ${getBlockColorScheme()} ${getBlockStyle()} shadow-lg backdrop-blur-sm`,
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <SpecialistAvatar specialistId={specialist} size={ageGroup === '5-7' ? 'lg' : 'md'} />
        
        <div>
          <h3 className={`${ageGroup === '5-7' ? 'text-xl' : 'text-lg'} font-bold text-white`}>
            {title}
          </h3>
          <p className="text-xs text-white/60">
            {ageGroup === '5-7' ? 'From' : 'By'} {specialist}
          </p>
        </div>
      </div>
      
      <div className={`${getFontSize()} text-white`}>
        {content}
      </div>
      
      {children}
      
      {onInteract && (
        <div className="mt-4 flex justify-center">
          <Button
            variant={ageGroup === '5-7' ? 'default' : 'outline'}
            size={ageGroup === '5-7' ? 'lg' : 'sm'}
            onClick={onInteract}
            className={ageGroup === '5-7' 
              ? 'bg-white/90 hover:bg-white text-black font-bold rounded-full px-6'
              : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
            }
          >
            {interactionLabel}
          </Button>
        </div>
      )}
    </motion.div>
  );
};

export default AgeAdaptiveBlock;
