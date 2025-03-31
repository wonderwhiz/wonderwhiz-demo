
import React, { useState } from 'react';

interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
  };
}

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({ content }) => {
  const [flipCard, setFlipCard] = useState(false);
  
  return (
    <div 
      className="flip-card"
      tabIndex={0}
      onClick={() => setFlipCard(!flipCard)}
      onKeyDown={(e) => e.key === 'Enter' && setFlipCard(!flipCard)}
    >
      <div className={`flip-card-inner ${flipCard ? 'flipped' : ''}`}>
        <div className="flip-card-front p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
          <p className="text-white text-center text-sm sm:text-base">{content.front}</p>
        </div>
        <div className="flip-card-back p-3 sm:p-4 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40 flex items-center justify-center">
          <p className="text-white text-center text-sm sm:text-base">{content.back}</p>
        </div>
      </div>
      <p className="text-white/60 text-xs mt-2 text-center">Click to flip</p>
    </div>
  );
};

export default FlashcardBlock;
