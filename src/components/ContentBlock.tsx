import React from 'react';
import { motion } from 'framer-motion';
import ContentBlockErrorBoundary from './content-blocks/ContentBlockErrorBoundary';
import ContentBlockLoading from './content-blocks/ContentBlockLoading';
import EnhancedQuizBlock from './content-blocks/EnhancedQuizBlock';
import FactBlock from './content-blocks/FactBlock';
import NewsBlock from './content-blocks/NewsBlock';
import RiddleBlock from './content-blocks/RiddleBlock';
import FlashcardBlock from './content-blocks/FlashcardBlock';
import CreativeBlock from './content-blocks/CreativeBlock';
import ActivityBlock from './content-blocks/ActivityBlock';
import MindfulnessBlock from './content-blocks/MindfulnessBlock';
import TaskBlock from './content-blocks/TaskBlock';
import FunFactBlock from './content-blocks/FunFactBlock';
import BlockInteractions from './content-blocks/BlockInteractions';
import { blockContainer } from './content-blocks/utils/blockStyles';
import { blockVariants } from './content-blocks/utils/blockAnimations';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';

interface ContentBlockProps {
  block: {
    id: string;
    type: string;
    content: any;
    specialist_id: string;
    liked?: boolean;
    bookmarked?: boolean;
  };
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  onNewsRead?: () => void;
  onQuizCorrect?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  onReadAloud?: (text: string) => void;
  childAge?: number;
  profileId?: string;
  isLoading?: boolean;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onLike,
  onBookmark,
  onReply,
  onCreativeUpload,
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  onNewsRead,
  onQuizCorrect,
  onRabbitHoleClick,
  onReadAloud,
  childAge = 10,
  profileId,
  isLoading
}) => {
  const [renderKey, setRenderKey] = React.useState(`block-${block.id}-${Date.now()}`);
  
  const [hasRenderError, setHasRenderError] = React.useState(false);
  const [renderErrorDetails, setRenderErrorDetails] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    setHasRenderError(false);
    setRenderErrorDetails(null);
    setRenderKey(`block-${block.id}-${Date.now()}`);
  }, [block.id, block.type]);

  if (isLoading) {
    return <ContentBlockLoading childAge={childAge} />;
  }

  if (!block || !block.type || !block.id) {
    console.error('Invalid block data received:', block);
    return (
      <div className="p-4 bg-red-900/20 rounded-lg border border-red-500/30 text-white">
        <p>Error: Invalid block data received</p>
      </div>
    );
  }

  const blockType = isValidContentBlockType(block.type) ? block.type as ContentBlockType : 'fact';
  
  const getAgeVariant = () => {
    if (childAge <= 7) return 'young';
    if (childAge >= 12) return 'older';
    return 'middle';
  };
  
  const handleToggleLike = () => {
    if (onLike) onLike();
  };
  
  const handleToggleBookmark = () => {
    if (onBookmark) onBookmark();
  };
  
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  
  const getRelatedQuestions = () => {
    if (!block.content) return [];
    if (Array.isArray(block.content.rabbitHoles)) return block.content.rabbitHoles;
    if (Array.isArray(block.content.relatedQuestions)) return block.content.relatedQuestions;
    return [];
  };
  
  const handleBlockRenderError = (error: Error) => {
    console.error(`Error rendering block type '${block.type}':`, error);
    setHasRenderError(true);
    setRenderErrorDetails(error.message);
    
    setTimeout(() => {
      setRenderKey(`block-${block.id}-fallback-${Date.now()}`);
    }, 100);
  };
  
  const safeRenderBlock = (renderFunction: () => React.ReactNode) => {
    try {
      return renderFunction();
    } catch (error: any) {
      handleBlockRenderError(error);
      
      return (
        <div className="p-4 bg-wonderwhiz-purple/30 rounded-lg border border-white/10">
          <p className="text-white/90">This content couldn't be displayed properly.</p>
          {renderErrorDetails && (
            <p className="text-white/60 text-sm mt-2 italic">Error: {renderErrorDetails}</p>
          )}
        </div>
      );
    }
  };
  
  const getSafeContent = () => {
    if (!block.content) return { title: "", text: "" };
    
    try {
      const extractedContent = {
        title: "",
        text: ""
      };
      
      if (typeof block.content.title === 'string') {
        extractedContent.title = block.content.title;
      } else if (typeof block.content.question === 'string') {
        extractedContent.title = block.content.question;
      } else if (typeof block.content.front === 'string') {
        extractedContent.title = block.content.front;
      } else if (typeof block.content.headline === 'string') {
        extractedContent.title = block.content.headline;
      }
      
      if (typeof block.content.fact === 'string') {
        extractedContent.text = block.content.fact;
      } else if (typeof block.content.text === 'string') {
        extractedContent.text = block.content.text;
      } else if (typeof block.content.description === 'string') {
        extractedContent.text = block.content.description;
      } else if (typeof block.content.prompt === 'string') {
        extractedContent.text = block.content.prompt;
      } else if (typeof block.content.instruction === 'string') {
        extractedContent.text = block.content.instruction;
      } else if (typeof block.content.body === 'string') {
        extractedContent.text = block.content.body;
      } else if (typeof block.content.explanation === 'string') {
        extractedContent.text = block.content.explanation;
      }
      
      return extractedContent;
    } catch (e) {
      console.error("Error extracting safe content:", e);
      return { title: "", text: "" };
    }
  };
  
  const renderFallbackBlock = () => {
    const safeContent = getSafeContent();
    
    return (
      <div className={blockContainer({ type: blockType, childAge: getAgeVariant() })}>
        {safeContent.title && (
          <h3 className="text-lg font-medium text-white mb-2">{safeContent.title}</h3>
        )}
        
        {safeContent.text && (
          <p className="text-white/90 mb-3">{safeContent.text}</p>
        )}
        
        {!safeContent.title && !safeContent.text && (
          <p className="text-white/70">This {block.type} content is available but can't be displayed properly.</p>
        )}
        
        <div className="mt-2 pt-2 border-t border-white/10">
          <p className="text-white/60 text-sm">Content type: {block.type}</p>
        </div>
      </div>
    );
  };
  
  const renderBlockContent = () => {
    if (hasRenderError && renderKey.includes('fallback')) {
      return renderFallbackBlock();
    }
    
    const commonProps = {
      onLike: handleToggleLike,
      onBookmark: handleToggleBookmark,
      onReply,
      onRabbitHoleClick,
      childAge
    };
    
    switch (block.type) {
      case 'quiz':
        return safeRenderBlock(() => (
          <div>
            <EnhancedQuizBlock 
              question={block.content.question}
              options={block.content.options}
              correctIndex={block.content.correctIndex}
              explanation={block.content.explanation}
              onQuizCorrect={onQuizCorrect}
              childAge={childAge}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'fact':
        return safeRenderBlock(() => (
          <div>
            <FactBlock 
              fact={block.content.fact}
              title={block.content.title}
              specialistId={block.specialist_id}
              rabbitHoles={block.content.rabbitHoles}
              onRabbitHoleClick={onRabbitHoleClick}
              onReadAloud={onReadAloud}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'news':
        return safeRenderBlock(() => (
          <div>
            <NewsBlock 
              content={block.content}
              specialistId={block.specialist_id}
              onNewsRead={onNewsRead}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'riddle':
        return safeRenderBlock(() => (
          <div>
            <RiddleBlock
              content={block.content}
              specialistId={block.specialist_id}
              updateHeight={() => {}}
              childAge={childAge}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'funFact':
        return safeRenderBlock(() => (
          <div>
            <FunFactBlock 
              fact={block.content.text || block.content.fact}
              specialistId={block.specialist_id}
              onLike={handleToggleLike}
              onBookmark={handleToggleBookmark}
              onReply={onReply}
              onRabbitHoleClick={onRabbitHoleClick}
              childAge={childAge}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'flashcard':
        return safeRenderBlock(() => (
          <div>
            <FlashcardBlock
              content={block.content}
              specialistId={block.specialist_id}
              childAge={childAge}
              updateHeight={() => {}}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'creative':
        return safeRenderBlock(() => (
          <div>
            <CreativeBlock
              content={block.content}
              specialistId={block.specialist_id}
              onCreativeUpload={onCreativeUpload}
              childAge={childAge}
              updateHeight={() => {}}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'activity':
        return safeRenderBlock(() => (
          <div>
            <ActivityBlock
              content={block.content}
              specialistId={block.specialist_id}
              onActivityComplete={onActivityComplete}
              childAge={childAge}
              updateHeight={() => {}}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'mindfulness':
        return safeRenderBlock(() => (
          <div>
            <MindfulnessBlock
              content={block.content}
              specialistId={block.specialist_id}
              onMindfulnessComplete={onMindfulnessComplete}
              childAge={childAge}
              updateHeight={() => {}}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      case 'task':
        return safeRenderBlock(() => (
          <div>
            <TaskBlock
              content={block.content}
              specialistId={block.specialist_id}
              onTaskComplete={onTaskComplete}
              childAge={childAge}
              updateHeight={() => {}}
            />
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
        
      default:
        return safeRenderBlock(() => (
          <div>
            <div className={blockContainer({ type: blockType, childAge: getAgeVariant() })}>
              {block.content && typeof block.content === 'object' ? (
                <div className="space-y-2">
                  {block.content.title && (
                    <h3 className="text-lg font-medium text-white">{block.content.title}</h3>
                  )}
                  
                  {block.content.text && (
                    <p className="text-white/90">{block.content.text}</p>
                  )}
                  
                  {block.content.description && (
                    <p className="text-white/90">{block.content.description}</p>
                  )}
                  
                  {block.content.prompt && (
                    <p className="text-white/90">{block.content.prompt}</p>
                  )}
                  
                  {block.content.instruction && (
                    <p className="text-white/90">{block.content.instruction}</p>
                  )}
                  
                  {!block.content.title && !block.content.text && !block.content.description && 
                  !block.content.prompt && !block.content.instruction && (
                    <pre className="text-white/90 whitespace-pre-wrap text-sm">
                      {JSON.stringify(block.content, null, 2)}
                    </pre>
                  )}
                </div>
              ) : (
                <pre className="text-white/90 whitespace-pre-wrap text-sm">
                  {JSON.stringify(block.content, null, 2)}
                </pre>
              )}
            </div>
            <BlockInteractions
              id={block.id}
              liked={block.liked}
              bookmarked={block.bookmarked}
              type={block.type}
              onToggleLike={handleToggleLike}
              onToggleBookmark={handleToggleBookmark}
              setShowReplyForm={setShowReplyForm}
              onRabbitHoleClick={onRabbitHoleClick}
              relatedQuestions={getRelatedQuestions()}
            />
          </div>
        ));
    }
  };

  return (
    <ContentBlockErrorBoundary onRetry={() => setRenderKey(`block-${block.id}-retry-${Date.now()}`)} childAge={childAge}>
      <motion.div
        key={renderKey}
        variants={blockVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="mb-6"
      >
        {renderBlockContent()}
        
        {showReplyForm && onReply && (
          <div className="mt-2 p-3 bg-white/5 rounded-lg">
            <textarea
              className="w-full bg-white/10 border border-white/20 rounded p-2 text-white placeholder-white/50"
              placeholder="Write your reply..."
              rows={3}
              onBlur={(e) => {
                if (e.target.value.trim()) {
                  onReply(e.target.value);
                  setShowReplyForm(false);
                }
              }}
            />
            <div className="flex justify-end mt-2">
              <button 
                className="px-3 py-1 text-sm bg-wonderwhiz-bright-pink rounded-md text-white"
                onClick={() => setShowReplyForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </ContentBlockErrorBoundary>
  );
};

export default ContentBlock;
