import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  ThumbsUp,
  Bookmark,
  Share2,
  Sparkles,
  VolumeIcon,
  MessageCircle,
  ArrowRightCircle,
  RefreshCw,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';
import BlockInteractions from '@/components/content-blocks/BlockInteractions';
import EnhancedContentBlock from '@/components/content-blocks/EnhancedContentBlock';
import ErrorBlock from '@/components/content-blocks/ErrorBlock';

export interface CurioContentProps {
  currentCurio: any;
  contentBlocks: any[];
  blockReplies: Record<string, any[]>;
  isGenerating: boolean;
  loadingBlocks: boolean;
  visibleBlocksCount: number;
  profileId?: string;
  onLoadMore: () => void;
  hasMoreBlocks: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (question: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
  onRefresh?: () => void;
  generationError?: string | null;
  playText?: (text: string) => void; 
  childAge?: number;
  triggerGeneration?: () => Promise<void>;
}

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  contentBlocks,
  blockReplies,
  isGenerating,
  loadingBlocks,
  visibleBlocksCount,
  profileId,
  onLoadMore,
  hasMoreBlocks,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload,
  onRefresh,
  generationError,
  playText,
  childAge,
  triggerGeneration
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const { interactionSize, interactionStyle } = useAgeAdaptation(childAge);
  const [loadingContent, setLoadingContent] = useState(true);
  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generationAttempts, setGenerationAttempts] = useState(0);
  
  useEffect(() => {
    // After a short delay, set loading state to false to show content
    const timer = setTimeout(() => {
      setLoadingContent(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleReplySubmit = (blockId: string) => {
    if (replyText.trim() && onReply) {
      onReply(blockId, replyText);
      setReplyText('');
      setShowReplyForm(false);
    }
  };

  const handleRabbitHoleClick = (question: string) => {
    onSetQuery(question);
    onRabbitHoleFollow(question);
  };

  const handleReadAloud = (text: string) => {
    if (playText) {
      playText(text);
    } else {
      toast.info('Read aloud feature coming soon!', {
        duration: 2000
      });
    }
  };

  const handleTriggerGeneration = async () => {
    if (!triggerGeneration) return;
    
    setIsGeneratingContent(true);
    setGenerationAttempts(prev => prev + 1);
    
    try {
      toast.loading("Generating new content...");
      await triggerGeneration();
      toast.dismiss();
      toast.success("Content generation started!");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to generate content. Please try again.");
      console.error("Error triggering content generation:", err);
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const renderLoadingState = () => (
    <div className="space-y-4 py-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={`skeleton-${i}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="bg-white/5 rounded-lg p-6 h-32"
        />
      ))}
      <div className="text-center text-white/60 pt-4">
        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
        <p>Generating amazing content for you...</p>
      </div>
    </div>
  );

  const renderGenerationErrorState = () => (
    <div className="text-center text-white/70 py-8 space-y-4">
      <AlertCircle className="h-12 w-12 text-red-400 mx-auto" />
      <p className="text-lg">We encountered an issue generating content.</p>
      <p className="text-sm text-white/60 max-w-md mx-auto">{generationError}</p>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-center mt-4">
        {onRefresh && (
          <Button 
            variant="secondary" 
            onClick={onRefresh}
            disabled={isGeneratingContent}
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        )}
        {triggerGeneration && (
          <Button 
            variant="default" 
            onClick={handleTriggerGeneration}
            disabled={isGeneratingContent || generationAttempts >= 3}
            className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80"
          >
            {isGeneratingContent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Content
              </>
            )}
          </Button>
        )}
      </div>
      {generationAttempts >= 3 && (
        <p className="text-sm text-amber-400 mt-2">
          Multiple generation attempts failed. Please try refreshing the page.
        </p>
      )}
    </div>
  );

  const renderNoContentState = () => {
    // Check if blocks contain only placeholder content
    const hasOnlyPlaceholders = contentBlocks.every(block => {
      const id = block.id || '';
      return id.startsWith('placeholder-');
    });

    return (
      <div className="text-center text-white/70 py-8 space-y-4">
        {hasOnlyPlaceholders ? (
          <>
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-wonderwhiz-bright-pink animate-spin" />
            </div>
            <p className="text-lg">Creating your personalized learning experience...</p>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              Our AI specialists are crafting amazing content just for you.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg">No content found for this topic yet.</p>
            <p className="text-sm text-white/60 max-w-md mx-auto">
              {isGenerating ? "Content is being generated..." : "Try refreshing or asking a different question."}
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              {onRefresh && (
                <Button 
                  variant="secondary" 
                  onClick={onRefresh}
                  className="mt-2"
                >
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              )}
              {triggerGeneration && (
                <Button 
                  variant="default" 
                  onClick={handleTriggerGeneration}
                  disabled={isGeneratingContent}
                  className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 mt-2"
                >
                  {isGeneratingContent ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" /> Generate Content
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Get a valid content block type, defaulting to 'fact' if invalid
  const getValidBlockType = (block: any): ContentBlockType => {
    if (!block || !block.type) return 'fact';
    return isValidContentBlockType(block.type) ? block.type : 'fact';
  };

  return (
    <div className="p-4 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white font-nunito">{currentCurio?.title}</h2>
        <p className="text-sm text-white/70 mt-1 font-lato">{currentCurio?.query}</p>
      </motion.div>

      {loadingBlocks || isGenerating ? (
        renderLoadingState()
      ) : generationError ? (
        renderGenerationErrorState()
      ) : contentBlocks && contentBlocks.length > 0 ? (
        <>
          {contentBlocks.map((block, index) => (
            <motion.div
              key={block.id || `block-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                "relative",
                block.id?.startsWith('placeholder-') ? "animate-pulse" : ""
              )}
            >
              <EnhancedContentBlock
                content={
                  block.content?.fact || 
                  block.content?.text || 
                  block.content?.question || 
                  block.content?.description || 
                  'Content is being generated...'
                }
                type={getValidBlockType(block)}
                childAge={childAge}
              />
              
              {!block.id?.startsWith('placeholder-') && (
                <BlockInteractions
                  id={block.id}
                  onToggleLike={() => onToggleLike(block.id)}
                  onToggleBookmark={() => onToggleBookmark(block.id)}
                  onReadAloud={() => playText && playText(
                    block.content?.fact || 
                    block.content?.text || 
                    block.content?.question || 
                    'No content available for reading'
                  )}
                  type={getValidBlockType(block)}
                  liked={block.liked}
                  bookmarked={block.bookmarked}
                  relatedQuestions={block.content?.rabbitHoles || []}
                  onRabbitHoleClick={onRabbitHoleFollow}
                  childAge={childAge}
                />
              )}
            </motion.div>
          ))}
        </>
      ) : (
        renderNoContentState()
      )}

      {hasMoreBlocks && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onLoadMore}
            disabled={loadingBlocks}
            className="bg-white/5 hover:bg-white/10 text-white"
          >
            {loadingBlocks ? (
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading More...
              </div>
            ) : (
              'Load More'
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CurioContent;
