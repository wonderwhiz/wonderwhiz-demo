import React, { useState } from 'react';

export interface RiddleBlockProps {
  content: {
    riddle: string;
    answer: string;
    question: string;
    hint: string;
  };
  specialistId: string;
  updateHeight?: (height: number) => void;
}

const RiddleBlock: React.FC<RiddleBlockProps> = ({
  content,
  specialistId,
  updateHeight
}) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
      <div className="p-4 border border-white/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">{content.question}</h3>
        <p className="text-white/90 mb-4">{content.riddle}</p>

        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="w-full py-2 bg-indigo-500/60 hover:bg-indigo-500/80 text-white text-sm rounded-md transition-colors"
        >
          {showAnswer ? "Hide Answer" : "Show Answer"}
        </button>

        {showAnswer && (
          <div className="mt-3 p-3 bg-indigo-800/20 rounded-lg">
            <h4 className="text-white font-medium mb-1">Answer:</h4>
            <p className="text-white/90">{content.answer}</p>
            {content.hint && (
              <>
                <h4 className="text-white font-medium mt-2 mb-1">Hint:</h4>
                <p className="text-white/90">{content.hint}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RiddleBlock;
