import React from 'react';
import { Card } from '@/components/ui/card';
import { ContentBlockType } from '@/types/curio';
import { getSpecialistInfo } from '@/utils/specialists';

interface FocusedContentBlockProps {
  id: string;
  type: ContentBlockType;
  content: any;
  specialistId: string;
  children: React.ReactNode;
  className?: string;
  childAge?: number;
  onPrimaryAction?: () => void;
  primaryActionLabel?: string;
}

const FocusedContentBlock: React.FC<FocusedContentBlockProps> = ({
  id,
  type,
  content,
  specialistId,
  children,
  className = '',
  childAge = 10,
  onPrimaryAction,
  primaryActionLabel
}) => {
  const specialist = getSpecialistInfo(specialistId);

  return (
    <Card className={`bg-white/5 border border-white/10 hover:border-white/20 transition-colors ${className}`}>
      <div className="p-4">
        {/* Simplified Header */}
        <div className="flex items-center gap-3 mb-4">
          <img 
            src={specialist.avatar} 
            alt={specialist.name}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <div className="text-white/60 text-xs uppercase tracking-wide">
              {type.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="text-white/80 text-sm font-medium">
              {specialist.name}
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="text-white">
          {children}
        </div>

        {/* Single Primary Action */}
        {onPrimaryAction && primaryActionLabel && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <button
              onClick={onPrimaryAction}
              className="text-wonderwhiz-cyan hover:text-wonderwhiz-cyan/80 text-sm font-medium transition-colors"
            >
              {primaryActionLabel}
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FocusedContentBlock;