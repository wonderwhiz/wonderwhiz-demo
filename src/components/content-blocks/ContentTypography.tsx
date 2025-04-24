
import React from 'react';
import { cn } from '@/lib/utils';

interface ContentTypographyProps {
  title?: string;
  content: React.ReactNode;
  childAge?: number;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const ContentTypography: React.FC<ContentTypographyProps> = ({
  title,
  content,
  childAge = 10,
  className,
  titleClassName,
  contentClassName
}) => {
  const getTitleSize = () => {
    if (childAge <= 7) return 'text-2xl md:text-3xl font-bold mb-4 leading-snug';
    if (childAge <= 11) return 'text-xl md:text-2xl font-semibold mb-3 leading-snug';
    return 'text-lg md:text-xl font-medium mb-2 leading-snug';
  };

  const getContentSize = () => {
    if (childAge <= 7) return 'text-lg md:text-xl leading-relaxed';
    if (childAge <= 11) return 'text-base md:text-lg leading-relaxed';
    return 'text-sm md:text-base leading-relaxed';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {title && (
        <h3 className={cn(
          getTitleSize(),
          'text-white/90 font-nunito animate-in fade-in duration-300',
          titleClassName
        )}>
          {title}
        </h3>
      )}
      <div className={cn(
        getContentSize(),
        'text-white/80 font-inter animate-in fade-in duration-300',
        contentClassName
      )}>
        {content}
      </div>
    </div>
  );
};

export default ContentTypography;
