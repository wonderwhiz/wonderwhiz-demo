
import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
    if (childAge <= 7) return 'text-2xl md:text-3xl font-bold mb-4 leading-snug font-nunito';
    if (childAge <= 11) return 'text-xl md:text-2xl font-semibold mb-3 leading-snug';
    return 'text-lg md:text-xl font-medium mb-2 leading-snug';
  };

  const getContentSize = () => {
    if (childAge <= 7) return 'text-lg md:text-xl leading-relaxed font-nunito';
    if (childAge <= 11) return 'text-base md:text-lg leading-relaxed';
    return 'text-sm md:text-base leading-relaxed';
  };

  return (
    <motion.div 
      className={cn('space-y-4', className)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {title && (
        <h3 className={cn(
          getTitleSize(),
          'text-white/90 animate-in fade-in duration-300',
          titleClassName
        )}>
          {title}
        </h3>
      )}
      <div className={cn(
        getContentSize(),
        'text-white/80 animate-in fade-in duration-300',
        'prose prose-invert prose-sm md:prose-base max-w-none',
        'prose-p:leading-relaxed prose-strong:text-white/90',
        'prose-a:text-wonderwhiz-cyan prose-a:no-underline hover:prose-a:underline',
        contentClassName
      )}>
        {content}
      </div>
    </motion.div>
  );
};

export default ContentTypography;

