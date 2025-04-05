
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

import BlockReplyForm from './BlockReplyForm';
import { getBackgroundColor, getBorderColor, getTextColor, getTextSize, getContextualImageStyle } from './BlockStyleUtils';

// Block content components
import FactBlock from './content-blocks/FactBlock';
import QuizBlock from './content-blocks/QuizBlock';
import FlashcardBlock from './content-blocks/FlashcardBlock';
import CreativeBlock from './content-blocks/CreativeBlock';
import TaskBlock from './content-blocks/TaskBlock';
import RiddleBlock from './content-blocks/RiddleBlock';
import NewsBlock from './content-blocks/NewsBlock';
import ActivityBlock from './content-blocks/ActivityBlock';
import MindfulnessBlock from './content-blocks/MindfulnessBlock';

// Refactored components
import BlockHeader from './content-blocks/BlockHeader';
import BlockInteractions from './content-blocks/BlockInteractions';
import BlockReplies from './content-blocks/BlockReplies';
import ContextualImage from './content-blocks/ContextualImage';

// Utils
import { getSpecialistStyle, getBlockTitle } from './content-blocks/utils/specialistUtils';
import { getContextualImage, checkImageCache } from './content-blocks/utils/imageUtils';

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
  const [imageDescription, setImageDescription] = useState<string>("A magical adventure awaits!");
  const [imageRequestInProgress, setImageRequestInProgress] = useState(false);
  const [imageTimerId, setImageTimerId] = useState<number | null>(null);
  const [imageRequestId, setImageRequestId] = useState<string>(`img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  const imageRetryCountRef = useRef(0);
  
  const specialistStyle = getSpecialistStyle(block.specialist_id);
  const blockTitle = getBlockTitle(block);

  useEffect(() => {
    const loadCachedImage = async () => {
      if (!isFirstBlock || contextualImage || imageRequestInProgress) {
        return;
      }
      
      // Try to get image from cache first
      const cachedImage = checkImageCache(block.id);
      if (cachedImage) {
        console.log(`[${block.id}] Found cached image, using it immediately`);
        setContextualImage(cachedImage);
        return;
      } 
      
      // Generate a new image if needed
      console.log(`[${block.id}] No cached image found, proceeding silently`);
      tryGenerateImage();
    };
    
    if (isFirstBlock) {
      loadCachedImage();
    }

    // Fetch existing replies when the block loads
    const fetchReplies = async () => {
      if (block.id && !block.id.startsWith('generating-') && !block.id.startsWith('error-')) {
        try {
          const { data, error } = await supabase
            .from('block_replies')
            .select('*')
            .eq('block_id', block.id)
            .order('created_at', { ascending: true });
            
          if (error) throw error;
          
          if (data && data.length > 0) {
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
          console.error('Error fetching replies:', error);
        }
      }
    };
    
    fetchReplies();
  }, [isFirstBlock, block.id, contextualImage, imageRequestInProgress]);
  
  const tryGenerateImage = useCallback(async () => {
    if (!isFirstBlock || contextualImage || imageLoading || imageRetryCountRef.current > 2) {
      return;
    }

    setImageLoading(true);
    setImageRequestInProgress(true);
    setImageError(null);
      
    const reqId = imageRequestId;
    console.log(`[${reqId}][${block.id}] Starting image generation`);
    
    // Set a timeout to show loading state for a bit
    const timerId = setTimeout(() => {
      console.log(`[${reqId}][${block.id}] Image generation taking longer than expected`);
      setImageTimerId(null);
    }, 5000) as unknown as number;
    
    setImageTimerId(timerId);
    
    // Call the image generation function
    const result = await getContextualImage(block, isFirstBlock, reqId, imageRetryCountRef);
    
    // Clear any loading timer
    if (imageTimerId) {
      clearTimeout(imageTimerId);
      setImageTimerId(null);
    }
    
    // Update state based on result
    setContextualImage(result.contextualImage);
    setImageError(result.imageError);
    setImageLoading(result.imageLoading);
    setImageRequestInProgress(result.imageRequestInProgress);
    setImageDescription(result.imageDescription || "A magical adventure awaits!");
    
    // If there was an error, increment retry count but continue silently
    if (result.imageError) {
      imageRetryCountRef.current += 1;
      
      // Don't retry automatically - we'll silently fail with a friendly message
      setImageLoading(false);
      setImageRequestInProgress(false);
    }
  }, [isFirstBlock, block, contextualImage, imageLoading, imageRequestId, imageTimerId]);
  
  const handleImageLoadError = () => {
    console.error(`[${block.id}] Image failed to load from data URL`);
    setImageError("Image failed to load");
    setContextualImage(null);
    
    // Don't retry automatically - we'll silently fail with a friendly message
    setImageLoading(false);
    setImageRequestInProgress(false);
  };
  
  const handleRetryImage = () => {
    console.log(`[${block.id}] Manual image retry requested`);
    setContextualImage(null);
    setImageError(null);
    imageRetryCountRef.current = 0;
    setImageLoading(false);
    setImageRequestInProgress(false);
    setImageRequestId(`img-manual-retry-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
    
    setTimeout(() => {
      tryGenerateImage();
    }, 100);
  };
  
  const handleSubmitReply = async (replyText: string) => {
    if (!replyText.trim() || !userId || !childProfileId) {
      if (!userId || !childProfileId) {
        toast.error("You need to be logged in to send messages.");
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
      
      toast.error("There was an error sending your message. Please try again.");
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
      toast.error("There was an error getting a response. Please try again.");
    }
  };
  
  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleFollow) {
      onRabbitHoleFollow(question);
    } else if (onSetQuery) {
      onSetQuery(question);
    }
  };

  const handleCreativeUploadSuccess = (feedback: string) => {
    setUploadFeedback(feedback);
    
    // Display toast with sparks earned
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Uploaded successfully!</span> 
        <span className="text-sm opacity-90">You earned 10 sparks for your creativity!</span>
      </div>,
      {
        position: "top-center",
        duration: 5000,
        className: "bg-wonderwhiz-purple text-white",
        icon: "✨"
      }
    );
    
    // Call the parent handler
    if (onCreativeUpload) {
      onCreativeUpload();
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
        return <CreativeBlock 
          content={block.content} 
          onCreativeUpload={() => handleCreativeUploadSuccess(uploadFeedback || "Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!")} 
          uploadFeedback={uploadFeedback}
        />;
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
  
  if (block.id.startsWith('generating-') && !isFirstBlock) {
    return null;
  }

  return (
    <Card className={`overflow-hidden transition-colors duration-300 hover:shadow-md w-full ${specialistStyle.gradient} bg-opacity-10`}>
      <div className="p-2.5 sm:p-3 md:p-4 bg-wonderwhiz-purple">
        <BlockHeader 
          specialistId={block.specialist_id} 
          blockTitle={blockTitle}
        />
        
        {isFirstBlock && (
          <div className="mb-4 relative">
            <AnimatePresence mode="wait">
              <ContextualImage
                isFirstBlock={isFirstBlock}
                imageLoading={imageLoading}
                contextualImage={contextualImage}
                imageError={imageError}
                imageDescription={imageDescription}
                blockTitle={blockTitle}
                handleImageLoadError={handleImageLoadError}
                handleRetryImage={handleRetryImage}
                getContextualImageStyle={getContextualImageStyle}
              />
            </AnimatePresence>
          </div>
        )}
        
        <div className="mb-4">
          {renderBlockContent()}
        </div>
        
        <BlockReplies 
          replies={replies} 
          specialistId={block.specialist_id} 
        />
        
        <BlockInteractions
          blockId={block.id}
          liked={block.liked}
          bookmarked={block.bookmarked}
          onToggleLike={onToggleLike}
          onToggleBookmark={onToggleBookmark}
          setShowReplyForm={setShowReplyForm}
          blockType={block.type}
        />
        
        {showReplyForm && (
          <BlockReplyForm isLoading={isLoading} onSubmit={handleSubmitReply} />
        )}
      </div>
    </Card>
  );
};

export default ContentBlock;
