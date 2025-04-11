import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Lightbulb, BookmarkPlus, BookmarkCheck, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface FlashcardBlockProps {
  content: {
    front: string;
    back: string;
    hint?: string;
    rabbitHoles?: string[];
  };
  specialistId: string;
  onBookmark?: () => void;
  isBookmarked?: boolean;
  onReply?: (message: string) => void;
  onRabbitHoleClick?: (question: string) => void;
  updateHeight?: (height: number) => void;
  replies?: Array<{
    id: string;
    content: string;
    from_user: boolean;
    created_at: string;
    specialist_id?: string;
  }>;
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
  onBookmark,
  isBookmarked,
  onReply,
  onRabbitHoleClick,
  updateHeight,
  replies = []
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [replyText, setReplyText] = useState('');
  const specialist = getSpecialistInfo(specialistId);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const commentBoxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (cardRef.current && updateHeight) {
      const observer = new ResizeObserver(() => {
        updateHeight(cardRef.current?.offsetHeight || 0);
      });
      
      observer.observe(cardRef.current);
      return () => observer.disconnect();
    }
  }, [updateHeight, isFlipped, replyText]);
  
  const handleSubmitReply = () => {
    if (replyText.trim() && onReply) {
      onReply(replyText);
      setReplyText('');
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
        
        {/* Save button */}
        <div className="flex space-x-2 mt-2 pt-2 border-t border-white/10">
          {onBookmark && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBookmark}
              className="text-white/70 hover:text-white hover:bg-white/10 flex items-center"
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-1 text-yellow-400" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <BookmarkPlus className="h-4 w-4 mr-1" />
                  <span>Save</span>
                </>
              )}
            </Button>
          )}
        </div>
        
        {/* Comment thread section */}
        <div ref={commentBoxRef} className="mt-4 border-t border-white/10 pt-3">
          {/* Existing replies */}
          {replies.length > 0 && (
            <div className="space-y-3 mb-3">
              {replies.map((reply) => {
                const replySpecialist = reply.from_user ? null : getSpecialistInfo(reply.specialist_id || specialistId);
                
                return (
                  <div key={reply.id} className="flex items-start gap-2">
                    <Avatar className="h-7 w-7 border border-white/10 flex-shrink-0">
                      {reply.from_user ? (
                        <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={replySpecialist?.avatar} alt={replySpecialist?.name} />
                          <AvatarFallback className={replySpecialist?.fallbackColor || 'bg-purple-600'}>
                            {replySpecialist?.fallbackInitial || 'S'}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-white/5 rounded-lg p-2 text-sm text-white/90">
                        <p className="text-xs font-medium mb-1">
                          {reply.from_user ? 'You' : replySpecialist?.name}
                        </p>
                        {reply.content}
                      </div>
                      <p className="text-xs text-white/40 mt-1">
                        {new Date(reply.created_at).toLocaleDateString()} • {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {/* Comment input */}
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border border-white/10 flex-shrink-0">
              <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
            </Avatar>
            <div className="flex-1 flex items-center bg-white/5 rounded-full border border-white/10 pr-1">
              <Input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Chat with ${specialist.name}...`}
                className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-white/40 flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-indigo-500/30"
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FlashcardBlock;
