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

  const textVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 }
  };

  return (
    <motion.div 
      className={cn('space-y-4', className)}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ staggerChildren: 0.1 }}
    >
      {title && (
        <motion.h3 
          variants={textVariants}
          className={cn(
            getTitleSize(),
            'text-white/90',
            titleClassName
          )}
        >
          {title}
        </motion.h3>
      )}
      <motion.div 
        variants={textVariants}
        className={cn(
          getContentSize(),
          'text-white/80',
          'prose prose-invert prose-sm md:prose-base max-w-none',
          'prose-p:leading-relaxed prose-strong:text-white/90',
          'prose-a:text-wonderwhiz-cyan prose-a:no-underline hover:prose-a:underline',
          'transition-colors duration-200',
          contentClassName
        )}
      >
        {content}
      </motion.div>
    </motion.div>
  );
};

export default ContentTypography;
