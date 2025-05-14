
import React from 'react';
import { ContentBlockType } from '@/types/curio';
import { cn } from '@/lib/utils';

interface EnhancedContentBlockProps {
  content: string;
  type: ContentBlockType; // Changed from limited types to allow all ContentBlockType values
  childAge?: number;
  className?: string;
}

const EnhancedContentBlock: React.FC<EnhancedContentBlockProps> = ({
  content,
  type,
  childAge = 10,
  className
}) => {
  // Get appropriate styling based on content type and child age
  const getBlockStyles = () => {
    const baseStyles = "p-4 rounded-xl border";
    
    // Type-specific styling
    const typeStyles = {
      fact: "bg-gradient-to-br from-[#00E2FF]/20 to-transparent border-[#00E2FF]/30",
      quiz: "bg-gradient-to-br from-[#FF5BA3]/20 to-transparent border-[#FF5BA3]/30",
      flashcard: "bg-gradient-to-br from-[#FFD54F]/20 to-transparent border-[#FFD54F]/30",
      creative: "bg-gradient-to-br from-[#00D68F]/20 to-transparent border-[#00D68F]/30",
      task: "bg-gradient-to-br from-[#FF8A3D]/20 to-transparent border-[#FF8A3D]/30",
      riddle: "bg-gradient-to-br from-[#3D2A7D]/20 to-transparent border-[#3D2A7D]/30",
      funFact: "bg-gradient-to-br from-[#FFD54F]/20 to-transparent border-[#FFD54F]/30",
      activity: "bg-gradient-to-br from-[#00D68F]/20 to-transparent border-[#00D68F]/30",
      mindfulness: "bg-gradient-to-br from-[#3D2A7D]/20 to-transparent border-[#3D2A7D]/30",
      news: "bg-gradient-to-br from-[#4A6FFF]/20 to-transparent border-[#4A6FFF]/30"
    };
    
    // Age-appropriate styling
    const ageStyles = childAge <= 7 
      ? "text-xl leading-relaxed" 
      : childAge <= 12 
        ? "text-lg leading-relaxed"
        : "text-base leading-normal";
    
    return cn(baseStyles, typeStyles[type as keyof typeof typeStyles] || typeStyles.fact, ageStyles, className);
  };

  return (
    <div className={getBlockStyles()}>
      <p className="text-white font-lato">
        {content}
      </p>
    </div>
  );
};

export default EnhancedContentBlock;
