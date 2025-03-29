
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BookmarkIcon, ThumbsUpIcon, MessageCircleIcon } from 'lucide-react';
import { SPECIALISTS } from './SpecialistAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import BlockReply from './BlockReply';
import { toast } from '@/hooks/use-toast';

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
  colorVariant?: number;
  userId?: string;
  childProfileId?: string;
}

interface Reply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  timestamp: string;
  specialist_id?: string;
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
  onCreativeUpload,
  colorVariant = 0,
  userId,
  childProfileId
}) => {
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [newsRead, setNewsRead] = useState(false);
  const [creativeUploaded, setCreativeUploaded] = useState(false);
  const [flipCard, setFlipCard] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const specialist = SPECIALISTS[block.specialist_id] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };

  // Fetch existing replies when the component mounts or block changes
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const { data, error } = await supabase
          .from('block_replies')
          .select('*')
          .eq('block_id', block.id)
          .order('timestamp', { ascending: true });
          
        if (error) {
          console.error('Error fetching replies:', error);
          return;
        }
        
        if (data) {
          setReplies(data);
        }
      } catch (err) {
        console.error('Error in fetchReplies:', err);
      }
    };
    
    if (block.id) {
      fetchReplies();
    }
  }, [block.id]);

  const getBackgroundColor = () => {
    switch (colorVariant) {
      case 0:
        return 'bg-white/5';
      case 1:
        return 'bg-wonderwhiz-purple/5';
      case 2:
        return 'bg-wonderwhiz-blue/5';
      default:
        return 'bg-white/5';
    }
  };

  const getBorderColor = () => {
    switch (colorVariant) {
      case 0:
        return 'border-white/10';
      case 1:
        return 'border-wonderwhiz-purple/15';
      case 2:
        return 'border-wonderwhiz-blue/15';
      default:
        return 'border-white/10';
    }
  };

  const getTextColor = () => {
    switch (colorVariant) {
      case 0:
        return 'text-white';
      case 1:
        return 'text-white';
      case 2:
        return 'text-white';
      default:
        return 'text-white';
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) return;
    
    // First add the user's message to the UI immediately
    const userReply = {
      id: `temp-${Date.now()}`,
      block_id: block.id,
      content: replyText,
      from_user: true,
      timestamp: new Date().toISOString()
    };
    
    setReplies(prev => [...prev, userReply]);
    
    try {
      setIsLoading(true);
      
      // Send the reply using our edge function instead of direct DB insert
      const response = await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: block.id,
          content: replyText,
          from_user: true,
          user_id: userId,
          child_profile_id: childProfileId
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Call the handle reply function to get a specialist response
      await handleSpecialistReply(block.id, replyText);
      
      // Call the parent component's onReply function
      onReply(block.id, replyText);
      
      setReplyText('');
    } catch (error) {
      console.error('Error handling reply:', error);
      toast({
        title: "Couldn't send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
      
      // Remove the temporary user reply if it failed
      setReplies(prev => prev.filter(r => r.id !== `temp-${Date.now()}`));
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSpecialistReply = async (blockId: string, messageContent: string) => {
    try {
      // Get the child profile information from localStorage or context
      const childProfileString = localStorage.getItem('currentChildProfile');
      const childProfile = childProfileString ? JSON.parse(childProfileString) : {
        age: 8,
        interests: ['science', 'art', 'space']
      };
      
      const response = await supabase.functions.invoke('handle-block-chat', {
        body: {
          blockId,
          messageContent,
          blockType: block.type,
          blockContent: block.content,
          childProfile,
          specialistId: block.specialist_id
        }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      // Insert the specialist's reply using our edge function
      await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: blockId,
          content: response.data.reply,
          from_user: false,
          specialist_id: response.data.specialistId,
          user_id: userId,
          child_profile_id: childProfileId
        }
      });
      
      // Refresh the replies
      const { data, error } = await supabase
        .from('block_replies')
        .select('*')
        .eq('block_id', blockId)
        .order('timestamp', { ascending: true });
        
      if (error) {
        console.error('Error fetching replies after specialist response:', error);
        return;
      }
      
      if (data) {
        setReplies(data);
      }
      
    } catch (error) {
      console.error('Error getting specialist reply:', error);
    }
  };
  
  const handleQuizOptionSelect = (idx: number) => {
    if (quizSubmitted) return;
    
    setSelectedQuizOption(idx);
    setQuizSubmitted(true);
    
    const isCorrect = idx === block.content.correctIndex;
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
      case 'funFact':
        return (
          <div>
            <p className={`${getTextColor()} text-sm sm:text-base`}>{block.content.fact}</p>
            {block.content.rabbitHoles && block.content.rabbitHoles.length > 0 && (
              <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
                <p className="text-white/70 text-xs sm:text-sm">Want to learn more?</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {block.content.rabbitHoles.map((question: string, idx: number) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs sm:text-sm py-1 px-2 sm:px-3 h-auto min-h-[1.75rem]"
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
            <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{block.content.question}</p>
            <div className="space-y-1.5 sm:space-y-2">
              {block.content.options.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleQuizOptionSelect(idx)}
                  disabled={quizSubmitted}
                  className={`w-full p-2 sm:p-3 rounded-lg text-left transition-colors ${
                    quizSubmitted
                      ? idx === block.content.correctIndex
                        ? 'bg-green-500/20 border border-green-500'
                        : idx === selectedQuizOption
                          ? 'bg-red-500/20 border border-red-500'
                          : 'bg-white/5 border border-white/10'
                      : 'bg-white/5 border border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="h-5 w-5 sm:h-6 sm:w-6 rounded-full flex items-center justify-center mr-2 text-xs sm:text-sm font-medium border border-white/20 flex-shrink-0 text-white">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="text-xs sm:text-sm text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
            
            {quizSubmitted && (
              <p className={`mt-2 sm:mt-3 text-xs sm:text-sm ${
                selectedQuizOption === block.content.correctIndex 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {selectedQuizOption === block.content.correctIndex 
                  ? 'Correct! You earned 5 sparks!' 
                  : `Not quite! The correct answer is: ${block.content.options[block.content.correctIndex]}`
                }
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
              <div className="flip-card-front p-3 sm:p-4 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                <p className="text-white text-center text-sm sm:text-base">{block.content.front}</p>
              </div>
              <div className="flip-card-back p-3 sm:p-4 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40 flex items-center justify-center">
                <p className="text-white text-center text-sm sm:text-base">{block.content.back}</p>
              </div>
            </div>
            <p className="text-white/60 text-xs mt-2 text-center">Click to flip</p>
          </div>
        );
        
      case 'creative':
        return (
          <div>
            <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{block.content.prompt}</p>
            {!creativeUploaded ? (
              <div>
                <p className="text-white/70 text-xs sm:text-sm mb-2 sm:mb-3">
                  When you're ready, upload your {block.content.type || 'creation'} to earn 10 sparks!
                </p>
                <Button
                  onClick={handleCreativeUpload}
                  className="bg-wonderwhiz-pink hover:bg-wonderwhiz-pink/80 text-xs sm:text-sm h-8 sm:h-10"
                >
                  Upload My {block.content.type === 'drawing' ? 'Drawing' : 'Creation'}
                </Button>
              </div>
            ) : (
              <p className="text-green-400 text-xs sm:text-sm">
                Uploaded successfully! You earned 10 sparks for your creativity!
              </p>
            )}
          </div>
        );
        
      case 'task':
        return (
          <div>
            <p className="text-white mb-1 text-sm sm:text-base">{block.content.task}</p>
            <p className="text-wonderwhiz-gold flex items-center text-xs sm:text-sm">
              <span className="inline-block mr-1">✨</span> 
              Earn {block.content.reward} sparks by completing this task!
            </p>
          </div>
        );
        
      case 'riddle':
        return (
          <div>
            <p className="text-white mb-2 sm:mb-3 text-sm sm:text-base">{block.content.riddle}</p>
            <Button 
              onClick={() => setFlipCard(!flipCard)}
              variant="outline"
              size="sm"
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs sm:text-sm h-7 sm:h-9"
            >
              {flipCard ? 'Hide Answer' : 'Reveal Answer'}
            </Button>
            
            {flipCard && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-2 sm:mt-3 p-2 sm:p-3 bg-wonderwhiz-purple/20 rounded-lg border border-wonderwhiz-purple/40"
              >
                <p className="text-white text-xs sm:text-sm">{block.content.answer}</p>
              </motion.div>
            )}
          </div>
        );
        
      case 'news':
        return (
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2">{block.content.headline}</h3>
            <p className="text-white/90 mb-2 sm:mb-3 text-xs sm:text-sm">{block.content.summary}</p>
            <div className="flex flex-wrap sm:flex-nowrap sm:items-center justify-between gap-2 sm:gap-0">
              <div className="text-white/60 text-xs">Source: {block.content.source}</div>
              {!newsRead ? (
                <Button 
                  onClick={handleReadNews}
                  size="sm"
                  className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-xs sm:text-sm h-7 sm:h-8 w-full sm:w-auto"
                >
                  Mark as Read
                </Button>
              ) : (
                <p className="text-green-400 text-xs">You earned 3 sparks for reading!</p>
              )}
            </div>
          </div>
        );
        
      case 'activity':
        return (
          <div>
            <p className="text-white text-sm sm:text-base">{block.content.activity}</p>
          </div>
        );
        
      case 'mindfulness':
        return (
          <div>
            <p className="text-white mb-1.5 sm:mb-2 text-sm sm:text-base">{block.content.exercise}</p>
            <p className="text-white/70 text-xs">
              Take {block.content.duration} seconds for this exercise
            </p>
          </div>
        );
        
      default:
        return <p className="text-white/70 text-sm">This content type is not supported yet.</p>;
    }
  };
  
  return (
    <Card className={`${getBackgroundColor()} ${getBorderColor()} overflow-hidden transition-colors duration-300 hover:shadow-md w-full`}>
      <div className="p-2.5 sm:p-3 md:p-4">
        <div className="flex items-center mb-2 sm:mb-3">
          <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-full ${specialist.color} flex items-center justify-center flex-shrink-0`}>
            {specialist.emoji}
          </div>
          <div className="ml-2 min-w-0 flex-1">
            <h3 className={`font-medium ${getTextColor()} text-sm sm:text-base truncate`}>{specialist.name}</h3>
            <p className={`${getTextColor()} text-xs truncate opacity-70`}>{specialist.description}</p>
          </div>
        </div>
        
        {renderBlockContent()}
        
        {/* Replies section */}
        {replies.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
            <h4 className="text-white text-xs sm:text-sm mb-2">Conversation</h4>
            <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto px-1">
              {replies.map((reply) => (
                <BlockReply
                  key={reply.id}
                  content={reply.content}
                  fromUser={reply.from_user}
                  specialistId={reply.specialist_id || block.specialist_id}
                  timestamp={reply.timestamp}
                />
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={() => onToggleLike(block.id)}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                block.liked ? 'text-wonderwhiz-pink' : 'text-white/60'
              }`}
              aria-label={block.liked ? "Unlike" : "Like"}
            >
              <ThumbsUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            
            <button 
              onClick={() => onToggleBookmark(block.id)}
              className={`p-1 rounded-full hover:bg-white/10 transition-colors ${
                block.bookmarked ? 'text-wonderwhiz-gold' : 'text-white/60'
              }`}
              aria-label={block.bookmarked ? "Remove bookmark" : "Bookmark"}
            >
              <BookmarkIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            
            <button 
              onClick={() => setShowReplyForm(prev => !prev)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white/60"
              aria-label={showReplyForm ? "Hide reply form" : "Reply"}
            >
              <MessageCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
          
          <div className="text-white/60 text-xs">
            {block.type === 'fact' || block.type === 'funFact' ? 'Fact' : 
             block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </div>
        </div>
        
        {showReplyForm && (
          <div className="mt-2 sm:mt-3 flex items-center space-x-2">
            <Input 
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply..."
              className="bg-white/10 border-white/20 text-white text-xs sm:text-sm h-8 sm:h-10"
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSubmitReply()}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSubmitReply}
              size="icon"
              className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white h-8 w-8 sm:h-10 sm:w-10"
              disabled={!replyText.trim() || isLoading}
            >
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContentBlock;
