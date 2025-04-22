
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlipHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlashcardBlockProps } from './interfaces';

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({
  content,
  specialistId,
  updateHeight,
  childAge = 10
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="my-4">
      <motion.div
        className="relative min-h-[200px] w-full perspective-1000"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`absolute w-full h-full backface-hidden ${
          isFlipped ? 'hidden' : 'block'
        } bg-gradient-to-br from-indigo-600/20 to-purple-600/20 rounded-xl p-6 border border-white/10`}>
          <p className={`text-white ${childAge && childAge <= 8 ? 'text-lg' : 'text-base'}`}>
            {content.front}
          </p>
        </div>
        
        <div className={`absolute w-full h-full backface-hidden ${
          isFlipped ? 'block' : 'hidden'
        } bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-6 border border-white/10`}
        style={{ transform: 'rotateY(180deg)' }}>
          <p className={`text-white ${childAge && childAge <= 8 ? 'text-lg' : 'text-base'}`}>
            {content.back}
          </p>
        </div>
      </motion.div>
      
      <Button 
        onClick={() => setIsFlipped(!isFlipped)}
        className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white"
      >
        <FlipHorizontal className="h-4 w-4 mr-2" />
        {childAge && childAge <= 8 ? "Flip Card!" : "Flip Card"}
      </Button>
      
      {content.hint && (
        <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/80 text-sm">
            <span className="font-medium">Hint:</span> {content.hint}
          </p>
        </div>
      )}
    </div>
  );
};

export default FlashcardBlock;
