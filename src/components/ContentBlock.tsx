
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, BookmarkPlus } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SpecialistAvatar, { SPECIALISTS } from '@/components/SpecialistAvatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export interface ContentBlockProps {
  block: {
    id: string;
    type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
    specialist_id: string;
    content: any;
    liked: boolean;
    bookmarked: boolean;
  };
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({ 
  block, 
  onToggleLike, 
  onToggleBookmark,
  onReply,
  onSetQuery
}) => {
  const [reply, setReply] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  
  let content;
  switch (block.type) {
    case 'fact':
    case 'funFact':
      content = (
        <div className="space-y-3">
          <p>{block.content.fact}</p>
          {block.content.rabbitHoles && (
            <div className="pt-2">
              <p className="text-sm font-medium mb-2">Want to know more?</p>
              <div className="flex flex-col space-y-2">
                {block.content.rabbitHoles.map((question: string, idx: number) => (
                  <Button 
                    key={idx} 
                    variant="outline" 
                    className="justify-start bg-white/10 hover:bg-white/20 border-white/20 text-white"
                    onClick={() => onSetQuery(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
      break;
    
    case 'quiz':
      const [selectedOption, setSelectedOption] = useState<number | null>(null);
      const [showAnswer, setShowAnswer] = useState(false);
      
      content = (
        <div className="space-y-4">
          <p className="font-medium">{block.content.question}</p>
          <div className="space-y-2">
            {block.content.options.map((option: string, idx: number) => (
              <Button
                key={idx}
                variant={showAnswer 
                  ? (idx === block.content.correctIndex ? "default" : "outline")
                  : (selectedOption === idx ? "secondary" : "outline")
                }
                className={`justify-start w-full ${
                  showAnswer && idx === block.content.correctIndex 
                    ? "bg-green-600 hover:bg-green-700 text-white" 
                    : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                }`}
                onClick={() => {
                  if (!showAnswer) {
                    setSelectedOption(idx);
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </div>
          {selectedOption !== null && !showAnswer && (
            <Button 
              className="mt-2" 
              onClick={() => setShowAnswer(true)}
            >
              Check Answer
            </Button>
          )}
          {showAnswer && (
            <div className="p-3 bg-white/10 rounded-lg">
              {selectedOption === block.content.correctIndex ? (
                <p className="text-green-400">Correct! ✅</p>
              ) : (
                <p className="text-amber-400">
                  Not quite! The correct answer is: {block.content.options[block.content.correctIndex]}
                </p>
              )}
            </div>
          )}
        </div>
      );
      break;
      
    case 'flashcard':
      content = (
        <div className="flip-card">
          <div className="flip-card-inner">
            <div className="flip-card-front bg-white/20 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
              <p className="font-medium text-center">{block.content.front}</p>
            </div>
            <div className="flip-card-back bg-white/30 p-6 flex items-center justify-center rounded-lg min-h-[120px]">
              <p className="text-center">{block.content.back}</p>
            </div>
          </div>
        </div>
      );
      break;
      
    case 'creative':
      content = (
        <div className="space-y-4">
          <p>{block.content.prompt}</p>
          <div className="p-4 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center hover:border-wonderwhiz-pink transition-colors cursor-pointer">
            <p className="text-white/60 text-sm">Tap to upload your {block.content.type}</p>
          </div>
        </div>
      );
      break;
      
    case 'task':
      content = (
        <div className="space-y-4">
          <p>{block.content.task}</p>
          <Button className="space-x-2">
            <span>Mark Complete</span>
            <Sparkles className="h-4 w-4" />
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">+{block.content.reward} Sparks</span>
          </Button>
        </div>
      );
      break;
      
    case 'riddle':
      content = (
        <div className="space-y-4">
          <p>{block.content.riddle}</p>
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                Reveal Answer
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 p-3 bg-white/10 rounded-lg">
              {block.content.answer}
            </CollapsibleContent>
          </Collapsible>
        </div>
      );
      break;
      
    case 'activity':
      content = (
        <div className="space-y-2">
          <p className="font-medium">Try This Activity:</p>
          <p>{block.content.activity}</p>
        </div>
      );
      break;
      
    case 'news':
      content = (
        <div className="space-y-3">
          <h3 className="text-lg font-bold">{block.content.headline}</h3>
          <p className="italic text-white/80">{block.content.summary}</p>
          <p className="text-xs text-white/60">Source: {block.content.source}</p>
        </div>
      );
      break;
      
    case 'mindfulness':
      content = (
        <div className="space-y-3">
          <p className="font-medium">Mindfulness Exercise ({block.content.duration} seconds)</p>
          <p>{block.content.exercise}</p>
          <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
            Start Timer
          </Button>
        </div>
      );
      break;
      
    default:
      content = <p>This content is still loading...</p>;
  }
  
  const handleSubmitReply = () => {
    if (reply.trim()) {
      onReply(block.id, reply);
      setReply('');
      setChatOpen(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <Card className={`overflow-hidden`}>
        <CardContent className="p-0">
          <div className={`p-3 flex items-center ${block.specialist_id ? SPECIALISTS[block.specialist_id]?.color : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}>
            <SpecialistAvatar specialistId={block.specialist_id} showName={true} />
          </div>
          <div className="p-4 text-white bg-wonderwhiz-dark">
            {content}
          </div>
          <div className="p-2 bg-wonderwhiz-dark/80 flex justify-end space-x-1 border-t border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hover:bg-white/10 ${block.liked ? 'text-red-400' : 'text-white/70'}`}
              onClick={() => onToggleLike(block.id)}
            >
              <Star className="h-4 w-4" />
            </Button>
            
            <Dialog open={chatOpen} onOpenChange={setChatOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white/70 hover:bg-white/10"
                >
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-wonderwhiz-dark text-white border-wonderwhiz-purple/30">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <SpecialistAvatar specialistId={block.specialist_id} size="sm" className="mr-2" />
                    <span>Chat with {SPECIALISTS[block.specialist_id]?.name || 'Wonder Wizard'}</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <p className="text-sm text-white/80">
                      {block.type === 'fact' || block.type === 'funFact' 
                        ? block.content.fact 
                        : block.type === 'quiz' 
                          ? block.content.question
                          : 'What would you like to know about this?'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Textarea 
                      placeholder={`Ask ${SPECIALISTS[block.specialist_id]?.name || 'Wonder Wizard'} a question...`}
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
                    />
                    <Button 
                      onClick={handleSubmitReply} 
                      disabled={!reply.trim()}
                      className="w-full bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`hover:bg-white/10 ${block.bookmarked ? 'text-wonderwhiz-blue' : 'text-white/70'}`}
              onClick={() => onToggleBookmark(block.id)}
            >
              <BookmarkPlus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContentBlock;
