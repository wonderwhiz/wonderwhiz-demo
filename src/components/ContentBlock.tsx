
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { BookmarkIcon, ThumbsUpIcon, MessageCircleIcon, ImageIcon, Loader, AlertCircle, Image, ImageOff, RefreshCw } from 'lucide-react';
import { SPECIALISTS } from './SpecialistAvatar';
import BlockReply from './BlockReply';
import BlockReplyForm from './BlockReplyForm';
import { getBackgroundColor, getBorderColor, getTextColor, getTextSize, getContextualImageStyle } from './BlockStyleUtils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

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
  isFirstBlock?: boolean;
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
  childProfileId,
  isFirstBlock = false
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [contextualImage, setContextualImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageRetryCount, setImageRetryCount] = useState(0);
  const [imageTimeout, setImageTimeout] = useState<NodeJS.Timeout | null>(null);
  const [imageRequestId, setImageRequestId] = useState<string>(`img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const [initialImageLoadAttempted, setInitialImageLoadAttempted] = useState(false);
  
  const specialist = SPECIALISTS[block.specialist_id] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };
  
  const specialistStyle = getSpecialistStyle(block.specialist_id);
  const blockTitle = getBlockTitle(block);
  
  const generateImage = useCallback(async () => {
    if (!isFirstBlock || contextualImage || imageLoading || imageRetryCount > 2) return;
    
    try {
      const reqId = imageRequestId;
      console.log(`[${reqId}][${block.id}] Starting image generation for block type:`, block.type);
      setImageLoading(true);
      setImageError(null);
      
      // Set timeout for image generation (12 seconds)
      const timeoutId = setTimeout(() => {
        console.log(`[${reqId}][${block.id}] Image generation timed out after 12 seconds`);
        setImageError("Generation timed out. Please try again.");
        setImageLoading(false);
      }, 12000);
      
      setImageTimeout(timeoutId);
      
      // Call the Supabase Edge Function to generate the image
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('generate-contextual-image', {
        body: {
          blockContent: block.content,
          blockType: block.type,
          requestId: reqId,
          timestamp: new Date().toISOString()
        }
      });
      
      // Clear timeout as we got a response (either success or error)
      if (imageTimeout) {
        clearTimeout(imageTimeout);
        setImageTimeout(null);
      }
      
      const duration = (Date.now() - startTime) / 1000;
      console.log(`[${reqId}][${block.id}] Image generation response received after ${duration}s:`, { success: !!data, hasError: !!error });
      
      if (error) {
        console.error(`[${reqId}][${block.id}] Supabase function error:`, error);
        throw new Error(`Edge function error: ${error.message}`);
      }
      
      if (!data) {
        throw new Error("No data returned from image generation function");
      }
      
      if (data.error) {
        console.error(`[${reqId}][${block.id}] Image generation error:`, data.error);
        throw new Error(data.error);
      }
      
      if (data && data.image) {
        console.log(`[${reqId}][${block.id}] Image generated successfully, size: ${data.image.length} chars`);
        setContextualImage(data.image);
      } else {
        throw new Error("No image data in response");
      }
    } catch (err) {
      console.error(`[${block.id}] Error generating contextual image:`, err);
      setImageError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setImageLoading(false);
      setInitialImageLoadAttempted(true);
    }
  }, [isFirstBlock, block, contextualImage, imageLoading, imageRetryCount, imageRequestId]);
  
  // Initial image generation - load immediately for first block
  useEffect(() => {
    if (isFirstBlock && !initialImageLoadAttempted && !contextualImage && !imageLoading) {
      console.log(`[${block.id}] Initial image generation triggering immediately`);
      generateImage();
    }
    
    return () => {
      if (imageTimeout) {
        clearTimeout(imageTimeout);
      }
    };
  }, [isFirstBlock, contextualImage, imageLoading, generateImage, block.id, imageTimeout, initialImageLoadAttempted]);
  
  // Set up retry logic with shorter timeout (1.5s) for better UX
  useEffect(() => {
    if (imageError && imageRetryCount < 3 && !contextualImage && !imageLoading) {
      const retryDelay = 1500; // Shorter retry delay: 1.5 seconds
      console.log(`[${block.id}] Setting up retry ${imageRetryCount + 1} in ${retryDelay}ms`);
      
      const retryTimer = setTimeout(() => {
        console.log(`[${block.id}] Retrying image generation (attempt ${imageRetryCount + 1})`);
        setImageRetryCount(prev => prev + 1);
        setImageError(null);
        // Generate a new request ID for this retry
        setImageRequestId(`img-retry-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
        generateImage();
      }, retryDelay);
      
      return () => clearTimeout(retryTimer);
    }
  }, [imageError, imageRetryCount, contextualImage, imageLoading, block.id, generateImage]);
  
  // Fetch replies
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
    
    if (block.id && !block.id.startsWith('generating-')) {
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

    setReplies(prev => [...prev, {
      id: tempId,
      block_id: block.id,
      content: replyText,
      from_user: true,
      timestamp: tempTimestamp
    }]);
    
    try {
      setIsLoading(true);
      console.log('Ensuring block exists in database:', block.id);

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
            child_profile_id: childProfileId
          }
        }
      });
      
      if (ensureBlockError) {
        throw new Error(`Failed to save block: ${ensureBlockError}`);
      }
      
      console.log('Block ensured in database:', ensureBlockData);

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

      await handleSpecialistReply(block.id, replyText);

      onReply(block.id, replyText);
    } catch (error) {
      console.error('Error handling reply:', error);

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
  
  const handleRetryImage = () => {
    console.log(`[${block.id}] Manual image retry requested`);
    setContextualImage(null);
    setImageError(null);
    setImageRetryCount(0);
    setImageLoading(false);
    setInitialImageLoadAttempted(false);
    setImageRequestId(`img-manual-retry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    setTimeout(() => {
      generateImage();
    }, 100);
  };
  
  // Skip rendering temporarily generated blocks
  if (block.id.startsWith('generating-') && !isFirstBlock) {
    return null;
  }

  return (
    <Card className={`overflow-hidden transition-colors duration-300 hover:shadow-md w-full ${specialistStyle.gradient} bg-opacity-10`}>
      <div className="p-2.5 sm:p-3 md:p-4 bg-wonderwhiz-purple">
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
        
        <motion.h4 
          className="text-base sm:text-lg font-bold text-white mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {blockTitle}
        </motion.h4>
        
        {isFirstBlock && (
          <div className="mb-4 relative">
            <AnimatePresence mode="wait">
              {imageLoading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${getContextualImageStyle()} flex items-center justify-center bg-gradient-to-r from-purple-900/30 to-indigo-900/30`}
                >
                  <div className="flex flex-col items-center">
                    <Loader className="h-8 w-8 text-white/60 mb-2 animate-spin" />
                    <p className="text-white/80 text-sm">Creating illustration...</p>
                    <div className="w-48 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-wonderwhiz-purple"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 10, ease: "linear" }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : contextualImage ? (
                <motion.div
                  key="image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative group"
                >
                  <img 
                    src={contextualImage} 
                    alt={`Illustration for ${blockTitle}`} 
                    className={`${getContextualImageStyle()} shadow-lg`}
                    loading="eager"
                    onError={() => {
                      console.error(`[${block.id}] Image failed to load from data URL`);
                      setImageError("Image failed to load");
                      setContextualImage(null);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-2">
                    <div className="text-xs bg-black/50 px-2 py-1 rounded-full text-white/90 backdrop-blur-sm">
                      AI-generated illustration
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="error-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`${getContextualImageStyle()} flex flex-col items-center justify-center bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-dashed border-white/20 p-4`}
                >
                  {imageError ? (
                    <div className="flex flex-col items-center text-center">
                      <AlertCircle className="h-7 w-7 text-white/40 mb-2" />
                      <p className="text-white/70 text-sm mb-2 max-w-[220px]">
                        {imageError.includes("API") ? "Could not generate illustration" : "Failed to load illustration"}
                      </p>
                      <button 
                        onClick={handleRetryImage}
                        className="text-xs flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-white transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Try Again
                      </button>
                    </div>
                  ) : initialImageLoadAttempted ? (
                    <div className="flex flex-col items-center text-center">
                      <ImageOff className="h-7 w-7 text-white/30 mb-2" />
                      <p className="text-white/50 text-xs mb-2">
                        Illustration not available
                      </p>
                      <button 
                        onClick={handleRetryImage}
                        className="text-xs flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full text-white transition-colors"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Generate Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <ImageIcon className="h-6 w-6 text-white/30 mb-1.5" />
                      <p className="text-white/50 text-xs">
                        Preparing illustration...
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        
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
