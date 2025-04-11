
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb, BookmarkPlus, ThumbsUp, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
    hint?: string;
    rabbitHoles?: string[];
  };
  specialistId: string;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
}

const getSpecialistInfo = (specialistId: string) => {
  const specialists = {
    nova: {
      name: 'Nova',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      name: 'Spark',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      name: 'Prism',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    default: {
      name: 'Specialist',
      avatar: '',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'S',
    }
  };
  
  return specialists[specialistId as keyof typeof specialists] || specialists.default;
};

const FlashcardBlock: React.FC<FlashcardBlockProps> = ({ 
  content, 
  specialistId,
  onLike,
  onBookmark,
  onReply,
  onRabbitHoleClick,
  updateHeight
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const specialist = getSpecialistInfo(specialistId);
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (cardRef.current && updateHeight) {
      const observer = new ResizeObserver(() => {
        updateHeight(cardRef.current?.offsetHeight || 0);
      });
      
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [updateHeight, isFlipped, showReplyForm]);
  
  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };
  
  return (
    <Card 
      ref={cardRef}
      className="overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20"
    >
      <div className="p-5">
        <div className="flex items-center mb-4">
          <Avatar className="h-10 w-10 border-2 border-white/10">
            <AvatarImage src={specialist.avatar} alt={specialist.name} />
            <AvatarFallback className={specialist.fallbackColor}>{specialist.fallbackInitial}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h3 className="text-white font-medium">{specialist.name}</h3>
            <p className="text-xs text-white/60">Flashcard</p>
          </div>
        </div>
        
        <div className="mb-4 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
          <div className="relative perspective-1000">
            <motion.div
              className={`w-full transition-all duration-500 ${isFlipped ? 'invisible opacity-0 absolute' : 'visible opacity-100'}`}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
            >
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col justify-center min-h-[100px]">
                <p className="text-white text-center">{content.front}</p>
                {content.hint && (
                  <div className="mt-3 text-center">
                    <Badge variant="outline" className="bg-white/10 text-white/70 border-none">
                      <Lightbulb className="h-3 w-3 mr-1 text-yellow-400" />
                      Hint: {content.hint}
                    </Badge>
                  </div>
                )}
              </div>
              <div className="text-center mt-2">
                <Badge variant="outline" className="bg-white/5 text-white/60 text-xs border-white/10">
                  Tap to reveal answer
                </Badge>
              </div>
            </motion.div>
            
            <motion.div
              className={`w-full transition-all duration-500 ${!isFlipped ? 'invisible opacity-0 absolute' : 'visible opacity-100'}`}
              animate={{ rotateY: !isFlipped ? 180 : 0 }}
            >
              <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 flex flex-col justify-center min-h-[100px]">
                <p className="text-white text-center">{content.back}</p>
              </div>
              <div className="text-center mt-2">
                <Badge variant="outline" className="bg-white/5 text-white/60 text-xs border-white/10">
                  Tap to see question
                </Badge>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Rabbit Holes */}
        {content.rabbitHoles && content.rabbitHoles.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {content.rabbitHoles.map((question, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 cursor-pointer text-white/80 border-white/20"
                onClick={() => onRabbitHoleClick && onRabbitHoleClick(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex space-x-2 mt-2 pt-2 border-t border-white/10">
          {onLike && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLike}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Like
            </Button>
          )}
          
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBookmark}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <BookmarkPlus className="h-4 w-4 mr-1" />
              Save
            </Button>
          )}
          
          {onReply && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
          )}
        </div>
        
        {/* Reply form */}
        {showReplyForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-3"
          >
            <div className="flex">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-white/5 border border-white/10 rounded-l-md px-3 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button 
                onClick={handleSubmitReply} 
                className="rounded-l-none bg-indigo-600 hover:bg-indigo-700"
              >
                Send
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default FlashcardBlock;
