import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { BookmarkIcon, ThumbsUpIcon, MessageCircleIcon } from 'lucide-react';
import { SPECIALISTS } from './SpecialistAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

interface ContentBlockProps {
  block: any;
  onToggleLike: (id: string) => void;
  onToggleBookmark: (id: string) => void;
  onReply: (id: string, message: string) => void;
  onSetQuery?: (query: string) => void;
  onRabbitHoleFollow?: (question: string) => void;
  onQuizCorrect?: () => void;
  onNewsRead?: () => void;
  onCreativeUpload?: () => void;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [newsRead, setNewsRead] = useState(false);
  const [creativeUploaded, setCreativeUploaded] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  
  const specialist = SPECIALISTS[block.specialist_id] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    
    onReply(block.id, replyText);
    setReplyText('');
    setShowReplyForm(false);
  };
  
  const handleQuizSubmit = () => {
    if (selectedQuizOption === null) return;
    
    const isCorrect = selectedQuizOption === block.content.correctIndex;
    setQuizSubmitted(true);
    
    if (isCorrect && onQuizCorrect) {
      onQuizCorrect();
    }
  };
  
  const handleReadNews = () => {
    if (!newsRead && onNewsRead) {
      setNewsRead(true);
      onNewsRead();
    }
  };
  
  const handleCreativeUpload = () => {
    if (!creativeUploaded && onCreativeUpload) {
      setCreativeUploaded(true);
      onCreativeUpload();
    }
  };
  
  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleFollow) {
      onRabbitHoleFollow(question);
    } else if (onSetQuery) {
      onSetQuery(question);
    }
  };
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'fact':
        return (
          <div>
            <p className="text-white">{block.content.fact}</p>
            {block.content.rabbitHoles && block.content.rabbitHoles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-white/70 text-sm">Want to learn more?</p>
                <div className="flex flex-wrap gap-2">
                  {block.content.rabbitHoles.map((question: string, idx: number) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      size="sm"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      onClick={() => handleRabbitHoleClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'funFact':
        return (
          <div>
            <p className="text-white">{block.content.fact}</p>
            {block.content.rabbitHoles && block.content.rabbitHoles.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-white/70 text-sm">Want to learn more?</p>
                <div className="flex flex-wrap gap-2">
                  {block.content.rabbitHoles.map((question: string, idx: number) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      size="sm"
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                      onClick={() => handleRabbitHoleClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'quiz':
        return (
          <div>
            <p className="text-white mb-3">{block.content.question}</p>
            <div className="space-y-2">
              {block.content.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => !quizSubmitted && setSelectedQuizOption(idx)}
                  disabled={quizSubmitted}
                  className={`w-full p-3 rounded-lg text-left transition-colors ${
                    quizSubmitted
                      ? idx === block.content.correctIndex
                        ? 'bg-green-500/20 border border-green-500'
                        : idx === selectedQuizOption
                          ? 'bg-red-500/20 border border-red-500'
                          : 'bg-white/5 border border-white/10'
                      : selectedQuizOption === idx
                        ? 'bg-wonderwhiz-purple/20 border border-wonderwhiz-purple'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="h-6 w-6 rounded-full flex items-center justify-center mr-2 text-sm font-medium border border-white/20">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {!quizSubmitted ? (
              <Button 
                onClick={handleQuizSubmit}
                disabled={selectedQuizOption === null}
                className="mt-3 bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80"
              >
                Submit Answer
              </Button>
            ) : selectedQuizOption === block.content.correctIndex ? (
              <p className="mt-3 text-green-400">Correct! You earned 5 sparks!</p>
            ) : (
              <p className="mt-3 text-red-400">
                Not quite! The correct answer is: {block.content.options[block.content.correctIndex]}
              </p>
            )}
          </div>
        );
        
      case 'flashcard':
        return (
          <div 
            className="flip-card"
            tabIndex={0}
            onClick={() => setFlipCard(!flipCard)}
            onKeyDown={(e) => e.key === 'Enter' && setFlipCard(!flipCard)}
          >
            <div className={`flip-card-inner ${flipCard ? 'flipped' : ''}`}>
              <div className="flip-card-front p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <p className="text-white text-center">{block.content.front}</p>
              </div>
              <div className="flip-card-back p-4 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40 flex items-center justify-center">
                <p className="text-white text-center">{block.content.back}</p>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-2 text-center">Click to flip</p>
          </div>
        );
        
      case 'creative':
        return (
          <div>
            <p className="text-white mb-3">{block.content.prompt}</p>
            {!creativeUploaded ? (
              <div>
                <p className="text-white/70 text-sm mb-3">
                  When you're ready, upload your {block.content.type || 'creation'} to earn 10 sparks!
                </p>
                <Button
                  onClick={handleCreativeUpload}
                  className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80"
                >
                  Upload My {block.content.type === 'drawing' ? 'Drawing' : 'Creation'}
                </Button>
              </div>
            ) : (
              <p className="text-green-400">
                Uploaded successfully! You earned 10 sparks for your creativity!
              </p>
            )}
          </div>
        );
        
      case 'task':
        return (
          <div>
            <p className="text-white mb-1">{block.content.task}</p>
            <p className="text-wonderwhiz-gold flex items-center text-sm">
              <span className="inline-block mr-1">✨</span> 
              Earn {block.content.reward} sparks by completing this task!
            </p>
          </div>
        );
        
      case 'riddle':
        return (
          <div>
            <p className="text-white mb-3">{block.content.riddle}</p>
            <Button 
              onClick={() => setFlipCard(!flipCard)}
              variant="outline"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              {flipCard ? 'Hide Answer' : 'Reveal Answer'}
            </Button>
            
            {flipCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40"
              >
                <p className="text-white">{block.content.answer}</p>
              </motion.div>
            )}
          </div>
        );
        
      case 'news':
        return (
          <div>
            <h3 className="text-xl font-bold text-white mb-2">{block.content.headline}</h3>
            <p className="text-white/90 mb-3">{block.content.summary}</p>
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm">Source: {block.content.source}</div>
              {!newsRead ? (
                <Button 
                  onClick={handleReadNews}
                  size="sm"
                  className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80"
                >
                  Mark as Read
                </Button>
              ) : (
                <p className="text-green-400 text-sm">You earned 3 sparks for reading!</p>
              )}
            </div>
          </div>
        );
        
      case 'activity':
        return (
          <div>
            <p className="text-white">{block.content.activity}</p>
          </div>
        );
        
      case 'mindfulness':
        return (
          <div>
            <p className="text-white mb-2">{block.content.exercise}</p>
            <p className="text-white/70 text-sm">
              Take {block.content.duration} seconds for this exercise
            </p>
          </div>
        );
        
      default:
        return <p className="text-white/70">This content type is not supported yet.</p>;
    }
  };
  
  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className={`h-8 w-8 rounded-full ${specialist.color} flex items-center justify-center`}>
            {specialist.emoji}
          </div>
          <div className="ml-2">
            <h3 className="font-medium text-white">{specialist.name}</h3>
            <p className="text-white/60 text-xs">{specialist.description}</p>
          </div>
        </div>
        
        {renderBlockContent()}
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onToggleLike(block.id)}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                block.liked ? 'text-wonderwhiz-pink' : 'text-white/60'
              }`}
            >
              <ThumbsUpIcon className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => onToggleBookmark(block.id)}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                block.bookmarked ? 'text-wonderwhiz-gold' : 'text-white/60'
              }`}
            >
              <BookmarkIcon className="h-4 w-4" />
            </button>
            
            <button 
              onClick={() => setShowReplyForm(prev => !prev)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60"
            >
              <MessageCircleIcon className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-white/60 text-xs">
            {block.type === 'fact' || block.type === 'funFact' ? 'Fact' : 
             block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </div>
        </div>
        
        {showReplyForm && (
          <div className="mt-3 flex items-center space-x-2">
            <Input 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
            />
            <Button 
              onClick={handleSubmitReply}
              size="icon"
              className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white"
              disabled={!replyText.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentBlock;
