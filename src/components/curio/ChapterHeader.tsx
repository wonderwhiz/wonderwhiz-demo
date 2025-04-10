
import React from 'react';
import { motion } from 'framer-motion';

interface ChapterHeaderProps {
  chapterId: string;
  title: string;
  description: string;
  index: number;
  totalChapters: number;
}

const ChapterHeader: React.FC<ChapterHeaderProps> = ({ 
  chapterId, 
  title, 
  description,
  index,
  totalChapters
}) => {
  // Create color variants based on chapter type
  const getColor = () => {
    switch(chapterId) {
      case 'introduction':
        return 'from-blue-400 to-indigo-500';
      case 'exploration':
        return 'from-purple-400 to-purple-600';
      case 'understanding':
        return 'from-teal-400 to-teal-600';
      case 'challenge':
        return 'from-amber-400 to-amber-600';
      case 'creation':
        return 'from-pink-400 to-pink-600';
      case 'reflection':
        return 'from-cyan-400 to-cyan-600';
      case 'nextSteps':
        return 'from-emerald-400 to-emerald-600';
      default:
        return 'from-blue-400 to-indigo-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 pt-8 relative"
    >
      {/* Progress indicator */}
      <div className="absolute left-0 top-0 h-full w-1">
        <div className="h-full w-full rounded-full bg-white/10"></div>
        <div 
          className={`absolute top-0 h-${Math.ceil((index + 1) / totalChapters * 100)}% w-full rounded-full bg-gradient-to-b ${getColor()}`} 
          style={{ height: `${Math.ceil((index + 1) / totalChapters * 100)}%` }}
        ></div>
      </div>

      {/* Chapter decorative line */}
      <div className="relative h-1 mb-6 rounded overflow-hidden">
        <svg width="100%" height="4" className="absolute inset-0">
          <defs>
            <linearGradient id={`gradient-${chapterId}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" className={`stop-${getColor().split(' ')[0]}`} />
              <stop offset="100%" className={`stop-${getColor().split(' ')[1]}`} />
            </linearGradient>
          </defs>
          <rect width="100%" height="4" fill={`url(#gradient-${chapterId})`} />
        </svg>
      </div>

      {/* Chapter title */}
      <div className="flex flex-col md:flex-row md:items-center mb-2">
        <h2 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${getColor()} bg-clip-text text-transparent`}>
          {title}
        </h2>
        <div className="md:ml-3 text-white/60 text-sm">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

export default ChapterHeader;
