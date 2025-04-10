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
import WonderPrompt from './content-blocks/WonderPrompt';
import NarrativeGuide from './content-blocks/NarrativeGuide';
import ConnectionsPanel from './content-blocks/ConnectionsPanel';

// Utils
import { getSpecialistStyle, getBlockTitle } from './content-blocks/utils/specialistUtils';
import { getContextualImage, checkImageCache } from './content-blocks/utils/imageUtils';
import { getSequencePosition, shouldShowWonderPrompt } from './content-blocks/utils/narrativeUtils';

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
  totalBlocks?: number;
  sequencePosition?: number;
  previousBlock?: any;
  nextBlock?: any;
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
  specialist_id?: string;
}

interface DbReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
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
  isFirstBlock = false,
  totalBlocks = 1,
  sequencePosition = 0,
  previousBlock,
  nextBlock
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<BlockReply[]>([]);
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
  
  const narrativePosition = getSequencePosition(sequencePosition, totalBlocks);
  
  const showWonderPromptHere = shouldShowWonderPrompt(
    block.type, 
    narrativePosition, 
    block.specialist_id, 
    sequencePosition
  );
  
  useEffect(() => {
    const loadCachedImage = async () => {
      if (!isFirstBlock || contextualImage || imageRequestInProgress) {
        return;
      }
      
      const cachedImage = checkImageCache(block.id);
      if (cachedImage) {
        console.log(`[${block.id}] Found cached image, using it immediately`);
        setContextualImage(cachedImage);
        return;
      } 
      
      console.log(`[${block.id}] No cached image found, proceeding silently`);
      tryGenerateImage();
    };
    
    if (isFirstBlock) {
      loadCachedImage();
    }

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
            const mappedReplies: BlockReply[] = data.map((reply: DbReply) => ({
              id: reply.id,
              block_id: reply.block_id,
              content: reply.content,
              from_user: reply.from_user,
              created_at: reply.created_at,
              user_id: reply.user_id,
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
    
    const timerId = setTimeout(() => {
      console.log(`[${reqId}][${block.id}] Image generation taking longer than expected`);
      setImageTimerId(null);
    }, 5000) as unknown as number;
    
    setImageTimerId(timerId);
    
    const result = await getContextualImage(block, isFirstBlock, reqId, imageRetryCountRef);
    
    if (imageTimerId) {
      clearTimeout(imageTimerId);
      setImageTimerId(null);
    }
    
    setContextualImage(result.contextualImage);
    setImageError(result.imageError);
    setImageLoading(result.imageLoading);
    setImageRequestInProgress(result.imageRequestInProgress);
    setImageDescription(result.imageDescription || "A magical adventure awaits!");
    
    if (result.imageError) {
      imageRetryCountRef.current += 1;
      
      setImageLoading(false);
      setImageRequestInProgress(false);
    }
  }, [isFirstBlock, block, contextualImage, imageLoading, imageRequestId, imageTimerId]);
  
  const handleImageLoadError = () => {
    console.error(`[${block.id}] Image failed to load from data URL`);
    setImageError("Image failed to load");
    setContextualImage(null);
    
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
      created_at: tempTimestamp,
      user_id: userId
    }]);
    
    try {
      setIsLoading(true);
      console.log('Ensuring block exists in database:', block.id);

      if (!block.id.startsWith('generating-') && !block.id.startsWith('error-')) {
        try {
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
            console.error('Error ensuring block exists:', ensureBlockError);
          } else {
            console.log('Block ensured in database:', ensureBlockData);
          }
        } catch (ensureError) {
          console.error('Exception ensuring block exists:', ensureError);
        }
      }

      try {
        const {
          data: replyData,
          error: replyError
        } = await supabase
          .from('block_replies')
          .insert({
            block_id: block.id,
            content: replyText,
            from_user: true
          })
          .select();
          
        if (replyError) {
          throw new Error(`Reply error: ${replyError.message}`);
        }
        
        console.log('Reply added successfully:', replyData);
        
        await handleSpecialistReply(block.id, replyText);
        
        onReply(block.id, replyText);
      } catch (replyError) {
        console.error('Error adding reply directly:', replyError);
        throw replyError;
      }
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
        const mappedReplies: BlockReply[] = data.map((reply: DbReply) => ({
          id: reply.id,
          block_id: reply.block_id,
          content: reply.content,
          from_user: reply.from_user,
          created_at: reply.created_at,
          user_id: reply.user_id,
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
    
    if (onCreativeUpload) {
      onCreativeUpload();
    }
  };
  
  const renderBlockContent = () => {
    switch (block.type) {
      case 'fact':
      case 'funFact':
        return <FactBlock 
          fact={block.content?.fact || block.content?.text}
          title={block.content?.title}
          specialistId={block.specialist_id}
          rabbitHoles={block.content?.rabbitHoles || []}
          expanded={expanded} 
          setExpanded={setExpanded} 
          textSize={getTextSize(block.type)}
          narrativePosition={narrativePosition}
          onRabbitHoleClick={handleRabbitHoleClick}
        />;
      case 'quiz':
        return <QuizBlock 
          question={block.content?.question}
          options={block.content?.options}
          correctIndex={block.content?.correctIndex}
          explanation={block.content?.explanation}
          specialistId={block.specialist_id}
          onQuizCorrect={onQuizCorrect}
        />;
      case 'flashcard':
        return <FlashcardBlock 
          front={block.content?.front}
          back={block.content?.back}
          hint={block.content?.hint}
          specialistId={block.specialist_id}
        />;
      case 'creative':
        return <CreativeBlock 
          prompt={block.content?.prompt}
          description={block.content?.description}
          examples={block.content?.examples || []}
          specialistId={block.specialist_id}
          onCreativeUpload={() => handleCreativeUploadSuccess(uploadFeedback || "Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!")} 
          uploadFeedback={uploadFeedback}
        />;
      case 'task':
        return <TaskBlock 
          title={block.content?.title}
          description={block.content?.description}
          steps={block.content?.steps || []}
          specialistId={block.specialist_id}
          onTaskComplete={onTaskComplete || (() => {})}
        />;
      case 'riddle':
        return <RiddleBlock 
          question={block.content?.question}
          answer={block.content?.answer}
          hint={block.content?.hint}
          specialistId={block.specialist_id}
        />;
      case 'news':
        return <NewsBlock 
          headline={block.content?.headline}
          summary={block.content?.summary}
          body={block.content?.body}
          source={block.content?.source}
          date={block.content?.date}
          specialistId={block.specialist_id}
          onNewsRead={onNewsRead || (() => {})}
        />;
      case 'activity':
        return <ActivityBlock 
          title={block.content?.title}
          instructions={block.content?.instructions}
          steps={block.content?.steps || []}
          specialistId={block.specialist_id}
          onActivityComplete={onActivityComplete || (() => {})}
        />;
      case 'mindfulness':
        return <MindfulnessBlock 
          title={block.content?.title}
          instruction={block.content?.instruction}
          duration={block.content?.duration}
          specialistId={block.specialist_id}
          onMindfulnessComplete={onMindfulnessComplete || (() => {})}
        />;
      default:
        return <p className="text-white/70 text-sm">This content type is not supported yet.</p>;
    }
  };
  
  if (block.id?.startsWith('generating-') && !isFirstBlock) {
    return null;
  }

  return (
    <Card className={`overflow-hidden transition-colors duration-300 hover:shadow-md w-full ${specialistStyle.gradient} bg-opacity-10 relative`}>
      {sequencePosition > 0 && (
        <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 hidden md:block">
          <div 
            className={`h-1.5 w-8 ${
              narrativePosition === 'beginning' ? 'bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink' : 
              narrativePosition === 'middle' ? 'bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-cyan' :
              'bg-gradient-to-r from-wonderwhiz-cyan to-wonderwhiz-vibrant-yellow'
            } rounded-full opacity-80`}
          />
        </div>
      )}
      
      <div className="p-2.5 sm:p-3 md:p-4 bg-wonderwhiz-purple relative">
        {narrativePosition === 'beginning' && (
          <NarrativeGuide 
            specialistId={block.specialist_id}
            blockType={block.type}
            previousBlock={previousBlock}
            nextBlock={nextBlock}
          />
        )}
        
        <BlockHeader 
          specialistId={block.specialist_id} 
          blockTitle={blockTitle}
          blockType={block.type}
          narrativePosition={narrativePosition}
          type={block.type}
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
                narrativePosition={narrativePosition}
              />
            </AnimatePresence>
          </div>
        )}
        
        <div className="mb-4">
          {renderBlockContent()}
        </div>
        
        {showWonderPromptHere && (
          <WonderPrompt 
            specialistId={block.specialist_id}
            blockType={block.type}
            blockContent={block.content}
            onRabbitHoleClick={handleRabbitHoleClick}
            narrativePosition={narrativePosition}
          />
        )}
        
        {narrativePosition === 'end' && (
          <ConnectionsPanel
            blockType={block.type}
            blockContent={block.content}
            specialistId={block.specialist_id}
            onRabbitHoleClick={handleRabbitHoleClick}
          />
        )}
        
        <BlockReplies 
          replies={replies} 
          specialistId={block.specialist_id} 
        />
        
        <BlockInteractions
          id={block.id}
          liked={block.liked}
          bookmarked={block.bookmarked}
          onToggleLike={() => onToggleLike(block.id)}
          onToggleBookmark={() => onToggleBookmark(block.id)}
          setShowReplyForm={setShowReplyForm}
          type={block.type}
        />
        
        {showReplyForm && (
          <BlockReplyForm isLoading={isLoading} onSubmit={handleSubmitReply} />
        )}
      </div>
    </Card>
  );
};

export default ContentBlock;
