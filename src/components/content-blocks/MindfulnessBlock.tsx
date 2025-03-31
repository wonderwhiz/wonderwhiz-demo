
import React from 'react';

interface MindfulnessBlockProps {
  content: {
    exercise: string;
    duration: number;
  };
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({ content }) => {
  return (
    <div>
      <p className="text-white mb-1.5 sm:mb-2 text-sm sm:text-base">{content.exercise}</p>
      <p className="text-white/70 text-xs">
        Take {content.duration} seconds for this exercise
      </p>
    </div>
  );
};

export default MindfulnessBlock;
