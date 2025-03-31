
import React from 'react';
import { Button } from '@/components/ui/button';

interface FactBlockProps {
  content: {
    fact: string;
    rabbitHoles?: string[];
  };
  onRabbitHoleClick: (question: string) => void;
}

const FactBlock: React.FC<FactBlockProps> = ({ content, onRabbitHoleClick }) => {
  return (
    <div>
      <p className="text-white text-sm sm:text-base">{content.fact}</p>
      {content.rabbitHoles && content.rabbitHoles.length > 0 && (
        <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
          <p className="text-white/70 text-xs sm:text-sm">Want to learn more?</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {content.rabbitHoles.map((question: string, idx: number) => (
              <Button 
                key={idx} 
                variant="outline" 
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm py-1 px-2 sm:px-3 h-auto min-h-[1.75rem]"
                onClick={() => onRabbitHoleClick(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FactBlock;
