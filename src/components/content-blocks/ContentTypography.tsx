
import React from 'react';
import { cn } from '@/lib/utils';

interface ContentTypographyProps {
  title?: string;
  content: React.ReactNode;
  childAge?: number;
  className?: string;
}

const ContentTypography: React.FC<ContentTypographyProps> = ({
  title,
  content,
  childAge = 10,
  className
}) => {
  const getTitleSize = () => {
    if (childAge <= 7) return 'text-2xl font-bold mb-4';
    if (childAge <= 11) return 'text-xl font-semibold mb-3';
    return 'text-lg font-medium mb-2';
  };

  const getContentSize = () => {
    if (childAge <= 7) return 'text-lg leading-relaxed';
    if (childAge <= 11) return 'text-base leading-relaxed';
    return 'text-sm leading-relaxed';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className={cn(
          getTitleSize(),
          'text-white/90 font-nunito'
        )}>
          {title}
        </h3>
      )}
      <div className={cn(
        getContentSize(),
        'text-white/80 font-inter'
      )}>
        {content}
      </div>
    </div>
  );
};

export default ContentTypography;
