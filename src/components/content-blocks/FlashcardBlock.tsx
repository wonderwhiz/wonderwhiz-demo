import React, { useState, useEffect } from 'react';

export interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
    image?: string;
  };
  specialistId: string;
  updateHeight?: (height: number) => void;
}

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({
  content,
  specialistId,
  updateHeight
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  useEffect(() => {
    if (updateHeight) {
      // Estimate the height of the content and update the parent
      const estimatedHeight = 200; // Adjust this value based on your content
      updateHeight(estimatedHeight);
    }
  }, [content, updateHeight, isFlipped]);
  
  return (
    <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
      <div className={`relative w-full transition-all duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
        <div className="p-4 border border-white/20 rounded-lg">
          {isFlipped ? (
            <div className="min-h-[100px]">
              <h3 className="text-white font-medium mb-2">Answer:</h3>
              <p className="text-white/90">{content.back}</p>
            </div>
          ) : (
            <div className="min-h-[100px]">
              <h3 className="text-white font-medium mb-2">Question:</h3>
              <p className="text-white/90">{content.front}</p>
            </div>
          )}
          
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="mt-3 w-full py-2 bg-white/10 hover:bg-white/15 text-white text-sm rounded-md transition-colors"
          >
            {isFlipped ? "Show Question" : "Reveal Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardBlock;
