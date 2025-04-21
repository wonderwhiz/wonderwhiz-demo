
import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, CheckCircle } from 'lucide-react';
import { blockVariants, contentVariants, getBlockStyle } from './utils/blockAnimations';

interface NewsBlockProps {
  content: {
    headline: string;
    body: string;
    source: string;
    image?: string;
  };
  specialistId: string;
  onNewsRead?: () => void;
  updateHeight?: (height: number) => void;
}

const NewsBlock: React.FC<NewsBlockProps> = ({
  content,
  specialistId,
  onNewsRead,
  updateHeight
}) => {
  return (
    <motion.div
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="bg-gradient-to-br from-wonderwhiz-blue-accent/20 to-wonderwhiz-cyan/20 p-6 rounded-xl shadow-lg backdrop-blur-sm border border-wonderwhiz-blue-accent/30"
    >
      <div className="flex items-start space-x-4">
        <div className="bg-wonderwhiz-blue-accent/20 p-2 rounded-full">
          <Bookmark className="h-5 w-5 text-wonderwhiz-blue-accent" />
        </div>
        <div className="flex-1">
          <motion.h3 
            variants={contentVariants}
            className="text-lg font-bold text-white mb-3"
          >
            {content.headline}
          </motion.h3>
          
          <motion.p 
            variants={contentVariants}
            className="text-white/90 leading-relaxed mb-4"
          >
            {content.body}
          </motion.p>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/60">{content.source}</span>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onNewsRead}
              className="flex items-center space-x-2 text-wonderwhiz-cyan hover:text-wonderwhiz-cyan/80 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Mark as Read</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsBlock;
