
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, Newspaper, ExternalLink } from 'lucide-react';
import { NewsBlockProps } from './interfaces';

const NewsBlock: React.FC<NewsBlockProps> = ({ 
  content, 
  onNewsRead, 
  specialistId, 
  onLike, 
  onBookmark, 
  onReply 
}) => {
  const [newsRead, setNewsRead] = useState(false);
  const [animateReward, setAnimateReward] = useState(false);

  const handleReadNews = () => {
    if (!newsRead) {
      setNewsRead(true);
      setTimeout(() => setAnimateReward(true), 300);
      if (onNewsRead) onNewsRead();
    }
  };
  
  return (
    <div>
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 mt-1">
          <motion.div
            className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center"
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ repeat: Infinity, repeatType: "reverse", duration: 2 }}
          >
            <Newspaper className="h-3.5 w-3.5 text-white" />
          </motion.div>
        </div>
        <div className="flex-1">
          <motion.p 
            className="text-white/90 mb-3 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {content.summary}
          </motion.p>
        </div>
      </div>
      
      <div className="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2 sm:gap-3 bg-white/5 p-2 sm:p-3 rounded-lg">
        <div className="text-white/70 text-xs flex items-center">
          <span className="inline-block mr-1.5">📰</span>
          Source: {content.source}
        </div>
        {!newsRead ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handleReadNews}
              size="sm"
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-xs sm:text-sm h-8 sm:h-9 px-4 rounded-full flex items-center"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Mark as Read
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center mr-2">
              <Check className="h-3 w-3 text-white" />
            </div>
            <motion.p 
              className="text-green-400 text-xs"
              animate={animateReward ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              You earned 3 sparks for reading!
              {animateReward && (
                <motion.span
                  className="inline-block ml-1"
                  initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0.5, 1.2, 0.5],
                    rotate: [-45, 0, 45]
                  }}
                  transition={{ duration: 1.5 }}
                >
                  ✨
                </motion.span>
              )}
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NewsBlock;
