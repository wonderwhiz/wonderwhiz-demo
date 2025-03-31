
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface NewsBlockProps {
  content: {
    headline: string;
    summary: string;
    source: string;
  };
  onNewsRead: () => void;
}

const NewsBlock: React.FC<NewsBlockProps> = ({ content, onNewsRead }) => {
  const [newsRead, setNewsRead] = useState(false);

  const handleReadNews = () => {
    if (!newsRead) {
      setNewsRead(true);
      onNewsRead();
    }
  };
  
  return (
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{content.headline}</h3>
      <p className="text-white/90 mb-2 sm:mb-3 text-xs sm:text-sm">{content.summary}</p>
      <div className="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2 sm:gap-0">
        <div className="text-white/60 text-xs">Source: {content.source}</div>
        {!newsRead ? (
          <Button 
            onClick={handleReadNews}
            size="sm"
            className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-xs sm:text-sm h-7 sm:h-8 w-full sm:w-auto"
          >
            Mark as Read
          </Button>
        ) : (
          <p className="text-green-400 text-xs">You earned 3 sparks for reading!</p>
        )}
      </div>
    </div>
  );
};

export default NewsBlock;
