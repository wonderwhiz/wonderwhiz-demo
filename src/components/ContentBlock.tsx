import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { BookmarkIcon, ThumbsUpIcon, MessageCircleIcon } from 'lucide-react';
import { SPECIALISTS } from './SpecialistAvatar';
import BlockReply from './BlockReply';
import BlockReplyForm from './BlockReplyForm';
import { getBackgroundColor, getBorderColor, getTextColor, getTextSize } from './BlockStyleUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Import Block Type Components
import FactBlock from './content-blocks/FactBlock';
import QuizBlock from './content-blocks/QuizBlock';
import FlashcardBlock from './content-blocks/FlashcardBlock';
import CreativeBlock from './content-blocks/CreativeBlock';
import TaskBlock from './content-blocks/TaskBlock';
import RiddleBlock from './content-blocks/RiddleBlock';
import NewsBlock from './content-blocks/NewsBlock';
import ActivityBlock from './content-blocks/ActivityBlock';
import MindfulnessBlock from './content-blocks/MindfulnessBlock';

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
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
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

interface DbReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  specialist_id?: string;
}

const getSpecialistStyle = (specialistId: string) => {
  switch (specialistId) {
    case 'nova':
      return {
        gradient: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
        introPhrase: 'Did you know...',
        tone: 'soft wonder'
      };
    case 'spark':
      return {
        gradient: 'bg-gradient-to-r from-yellow-400 via-yellow-300 to-amber-300',
        introPhrase: 'Let\'s find out!',
        tone: 'energetic'
      };
    case 'prism':
      return {
        gradient: 'bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-400',
        introPhrase: 'Imagine this...',
        tone: 'dreamy'
      };
    case 'lotus':
      return {
        gradient: 'bg-gradient-to-r from-pink-200 via-pink-300 to-purple-300',
        introPhrase: 'Take a breath...',
        tone: 'gentle mindfulness'
      };
    case 'pixel':
      return {
        gradient: 'bg-gradient-to-r from-blue-300 via-blue-400 to-teal-400',
        introPhrase: 'According to the latest research...',
        tone: 'snappy & newsy'
      };
    case 'atlas':
      return {
        gradient: 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-400',
        introPhrase: 'Here\'s a mission for you...',
        tone: 'exploratory'
      };
    default:
      return {
        gradient: 'bg-gradient-to-r from-gray-400 to-gray-300',
        introPhrase: 'Let\'s explore...',
        tone: 'friendly'
      };
  }
};

const getBlockTitle = (block: any) => {
  switch (block.type) {
    case 'fact':
    case 'funFact':
      return block.content.fact.split('.')[0] + '.';
    case 'quiz':
      return block.content.question;
    case 'flashcard':
      return block.content.front;
    case 'creative':
      return block.content.prompt.split('.')[0] + '.';
    case 'task':
      return block.content.task.split('.')[0] + '.';
    case 'riddle':
      return block.content.riddle.split('?')[0] + '?';
    case 'news':
      return block.content.headline;
    case 'activity':
      return block.content.activity.split('.')[0] + '.';
    case 'mindfulness':
      return block.content.exercise.split('.')[0] + '.';
    default:
      return '';
  }
};

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
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  colorVariant = 0,
  userId,
  childProfileId
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const specialist = SPECIALISTS[block.specialist_id] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };
  
  const specialistStyle = getSpecialistStyle(block.specialist_id);
  const blockTitle = getBlockTitle(block);
  const contentTooLong = block.type === 'fact' && block.content.fact.length > 120;
  
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('block_replies').select('*').eq('block_id', block.id).order('created_at', {
          ascending: true
        });
        
        if (error) {
          console.error('Error fetching replies:', error);
          return;
        }
        
        if (data) {
          const mappedReplies: Reply[] = data.map((reply: DbReply) => ({
            id: reply.id,
            block_id: reply.block_id,
            content: reply.content,
            from_user: reply.from_user,
            timestamp: reply.created_at,
            specialist_id: reply.specialist_id
          }));
          setReplies(mappedReplies);
        }
      } catch (err) {
        console.error('Error in fetchReplies:', err);
      }
    };
    
    if (block.id) {
      fetchReplies();
    }
  }, [block.id]);
  
  const handleSubmitReply = async (replyText: string) => {
    if (!replyText.trim() || !userId || !childProfileId) {
      if (!userId || !childProfileId) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to send messages.",
          variant: "destructive"
        });
      }
      return;
    }
    
    const tempId = `temp-${Date.now()}`;
    const tempTimestamp = new Date().toISOString();

    // Optimistically add the reply to the UI
    const userReply: Reply = {
      id: tempId,
      block_id: block.id,
      content: replyText,
      from_user: true,
      timestamp: tempTimestamp
    };
    
    setReplies(prev => [...prev, userReply]);
    
    try {
      setIsLoading(true);
      console.log('Ensuring block exists in database:', block.id);

      // Always ensure the block exists in the database first using the edge function
      const {
        data: ensureBlockData,
        error: ensureBlockError
      } = await supabase.functions.invoke('ensure-block-exists', {
        body: {
          block: {
            id: block.id,
            curio_id: block.curio_id || null,
            type: block.type,
            specialist_id: block.specialist_id,
            content: block.content,
            liked: block.liked,
            bookmarked: block.bookmarked,
            child_profile_id: childProfileId // Add this to support creating a temporary curio if needed
          }
        }
      });
      
      if (ensureBlockError) {
        throw new Error(`Failed to save block: ${ensureBlockError}`);
      }
      
      console.log('Block ensured in database:', ensureBlockData);

      // Now send the reply to the edge function - REMOVED specialist_id from the request
      const {
        data: replyData,
        error: replyError
      } = await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: block.id,
          content: replyText,
          from_user: true,
          user_id: userId,
          child_profile_id: childProfileId
        }
      });
      
      if (replyError) {
        throw new Error(`Reply error: ${replyError}`);
      }

      // Handle specialist reply
      await handleSpecialistReply(block.id, replyText);

      // Notify parent component
      onReply(block.id, replyText);
    } catch (error) {
      console.error('Error handling reply:', error);

      // Remove the optimistically added reply
      setReplies(prev => prev.filter(r => r.id !== tempId));
      
      toast({
        title: "Couldn't send message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSpecialistReply = async (blockId: string, messageContent: string) => {
    try {
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
      
      // Update this to match the handle-block-replies function that doesn't expect specialist_id
      const {
        data: aiReplyData,
        error: aiReplyError
      } = await supabase.functions.invoke('handle-block-replies', {
        body: {
          block_id: blockId,
          content: response.data.reply,
          from_user: false,
          user_id: userId,
          child_profile_id: childProfileId
        }
      });
      
      if (aiReplyError) throw aiReplyError;
      
      // Refresh the replies from the database after adding specialist response
      const {
        data,
        error
      } = await supabase.from('block_replies').select('*').eq('block_id', blockId).order('created_at', {
        ascending: true
      });
      
      if (error) {
        console.error('Error fetching replies after specialist response:', error);
        return;
      }
      
      if (data) {
        const mappedReplies: Reply[] = data.map((reply: DbReply) => ({
          id: reply.id,
          block_id: reply.block_id,
          content: reply.content,
          from_user: reply.from_user,
          timestamp: reply.created_at,
          specialist_id: reply.specialist_id
        }));
        setReplies(mappedReplies);
      }
    } catch (error) {
      console.error('Error getting specialist reply:', error);
      toast({
        title: "Couldn't get specialist response",
        description: "There was an error getting a response. Please try again.",
        variant: "destructive"
      });
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
        return <FactBlock content={block.content} onRabbitHoleClick={handleRabbitHoleClick} expanded={expanded} setExpanded={setExpanded} textSize={getTextSize(block.type)} />;
      case 'quiz':
        return <QuizBlock content={block.content} onQuizCorrect={onQuizCorrect} />;
      case 'flashcard':
        return <FlashcardBlock content={block.content} />;
      case 'creative':
        return <CreativeBlock content={block.content} onCreativeUpload={onCreativeUpload || (() => {})} />;
      case 'task':
        return <TaskBlock content={block.content} onTaskComplete={onTaskComplete || (() => {})} />;
      case 'riddle':
        return <RiddleBlock content={block.content} />;
      case 'news':
        return <NewsBlock content={block.content} onNewsRead={onNewsRead || (() => {})} />;
      case 'activity':
        return <ActivityBlock content={block.content} onActivityComplete={onActivityComplete || (() => {})} />;
      case 'mindfulness':
        return <MindfulnessBlock content={block.content} onMindfulnessComplete={onMindfulnessComplete || (() => {})} />;
      default:
        return <p className="text-white/70 text-sm">This content type is not supported yet.</p>;
    }
  };
  
  return (
    <Card className={`overflow-hidden transition-colors duration-300 hover:shadow-md w-full ${specialistStyle.gradient} bg-opacity-10`}>
      <div className="p-2.5 sm:p-3 md:p-4 bg-wonderwhiz-purple">
        {/* Persona Icon Row */}
        <div className="flex items-center mb-3 sm:mb-4">
          <motion.div 
            className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ${specialist.color} flex items-center justify-center flex-shrink-0 shadow-md`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            {specialist.emoji}
          </motion.div>
          <div className="ml-2 min-w-0 flex-1">
            <h3 className="font-medium text-white text-sm sm:text-base truncate">{specialist.name}</h3>
            <p className="text-white/70 text-xs truncate">{specialist.description}</p>
          </div>
        </div>
        
        {/* Title / Hook */}
        <motion.h4 
          className="text-base sm:text-lg font-bold text-white mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {blockTitle}
        </motion.h4>
        
        {/* Core Content */}
        <div className="mb-4">
          {renderBlockContent()}
        </div>
        
        {replies.length > 0 && (
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10">
            <h4 className="text-white text-xs sm:text-sm mb-2">Conversation</h4>
            <div className="space-y-2 sm:space-y-3 max-h-60 overflow-y-auto px-1">
              {replies.map(reply => (
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
            <motion.button 
              onClick={() => onToggleLike(block.id)} 
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${block.liked ? 'text-wonderwhiz-pink' : 'text-white/70'}`}
              aria-label={block.liked ? "Unlike" : "Like"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ThumbsUpIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            
            <motion.button 
              onClick={() => onToggleBookmark(block.id)} 
              className={`p-1.5 rounded-full hover:bg-white/10 transition-colors ${block.bookmarked ? 'text-wonderwhiz-gold' : 'text-white/70'}`}
              aria-label={block.bookmarked ? "Remove bookmark" : "Bookmark"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <BookmarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
            
            <motion.button 
              onClick={() => setShowReplyForm(prev => !prev)} 
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-white/70"
              aria-label={showReplyForm ? "Hide reply form" : "Reply"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircleIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            </motion.button>
          </div>
          
          <div className="text-white/70 text-xs px-2 py-1 rounded-full bg-black/20">
            {block.type === 'fact' || block.type === 'funFact' ? 'Fact' : block.type.charAt(0).toUpperCase() + block.type.slice(1)}
          </div>
        </div>
        
        {showReplyForm && (
          <BlockReplyForm isLoading={isLoading} onSubmit={handleSubmitReply} />
        )}
      </div>
    </Card>
  );
};

export default ContentBlock;
