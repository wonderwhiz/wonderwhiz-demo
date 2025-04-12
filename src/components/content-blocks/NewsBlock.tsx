import React, { useState } from 'react';

export interface NewsBlockProps {
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
    <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
      <div className="p-4 border border-white/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">{content.headline}</h3>
        <p className="text-white/90 mb-4">{content.body}</p>
        
        <div className="flex justify-between items-center text-xs text-white/60">
          <span>Source: {content.source}</span>
          
          <button
            onClick={onNewsRead}
            className="text-indigo-300 hover:text-indigo-200"
          >
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsBlock;
