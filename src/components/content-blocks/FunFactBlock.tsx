
import React, { useState, useEffect, useRef } from 'react';
import BlockHeader from './BlockHeader';
import BlockInteractions from './BlockInteractions';
import { Card } from '@/components/ui/card';

interface FunFactBlockProps {
  fact: string;
  specialistId: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
}

const FunFactBlock: React.FC<FunFactBlockProps> = ({
  fact,
  specialistId,
  onLike,
  onBookmark,
  onReply,
  onRabbitHoleClick,
  updateHeight
}) => {
  const blockRef = useRef<HTMLDivElement>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  useEffect(() => {
    if (blockRef.current && updateHeight) {
      updateHeight(blockRef.current.offsetHeight);
    }
  }, [fact, updateHeight]);

  return (
    <Card ref={blockRef} className="overflow-hidden bg-white/5 backdrop-blur-lg border-primary/10 shadow-md">
      <BlockHeader type="Fun Fact" specialistId={specialistId} />
      
      <div className="p-4">
        <p className="text-white/90 mb-4">{fact}</p>
      </div>
      
      <BlockInteractions 
        id={`funfact-${Date.now()}`}
        liked={false}
        bookmarked={false}
        type="funfact"
        onToggleLike={onLike || (() => {})}
        onToggleBookmark={onBookmark || (() => {})}
        setShowReplyForm={setShowReplyForm}
        onRabbitHoleClick={onRabbitHoleClick}
        relatedQuestions={[]}
      />
    </Card>
  );
};

export default FunFactBlock;
