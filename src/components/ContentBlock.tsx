
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
  if (isLoading) {
    return <ContentBlockLoading childAge={childAge} />;
  }

  // Verify the block type to ensure it's valid for the blockContainer function
  const blockType = isValidContentBlockType(block.type) ? block.type as ContentBlockType : 'fact';
  
  // Get age-appropriate class variant
  const getAgeVariant = () => {
    if (childAge <= 7) return 'young';
    if (childAge >= 12) return 'older';
    return 'middle';
  };
  
  // Create interaction handlers
  const handleToggleLike = () => {
    if (onLike) onLike();
  };
  
  const handleToggleBookmark = () => {
    if (onBookmark) onBookmark();
  };
  
  const [showReplyForm, setShowReplyForm] = React.useState(false);
  
  // Get related questions or rabbit holes from content if available
  const getRelatedQuestions = () => {
    if (!block.content) return [];
    if (Array.isArray(block.content.rabbitHoles)) return block.content.rabbitHoles;
    if (Array.isArray(block.content.relatedQuestions)) return block.content.relatedQuestions;
    return [];
  };
  
  // Render different block types
  const renderBlockContent = () => {
    const commonProps = {
      onLike: handleToggleLike,
      onBookmark: handleToggleBookmark,
      onReply,
      onRabbitHoleClick,
      childAge
    };
    
    switch (block.type) {
      case 'quiz':
        return (
          <div>
            <EnhancedQuizBlock 
              question={block.content.question}
              options={block.content.options}
              correctIndex={block.content.correctIndex}
              explanation={block.content.explanation}
              onCorrect={onQuizCorrect}
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
        );
        
      case 'fact':
        return (
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
        );
        
      case 'news':
        return (
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
        );
        
      case 'riddle':
        return (
          <div>
            <RiddleBlock
              content={block.content}
              specialistId={block.specialist_id}
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
        );
        
      case 'funFact':
        return (
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
        );
        
      case 'flashcard':
        return (
          <div>
            <FlashcardBlock
              content={block.content}
              specialistId={block.specialist_id}
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
        );
        
      case 'creative':
        return (
          <div>
            <CreativeBlock
              content={block.content}
              specialistId={block.specialist_id}
              onCreativeUpload={onCreativeUpload}
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
        );
        
      case 'activity':
        return (
          <div>
            <ActivityBlock
              content={block.content}
              specialistId={block.specialist_id}
              onActivityComplete={onActivityComplete}
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
        );
        
      case 'mindfulness':
        return (
          <div>
            <MindfulnessBlock
              content={block.content}
              specialistId={block.specialist_id}
              onMindfulnessComplete={onMindfulnessComplete}
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
        );
        
      case 'task':
        return (
          <div>
            <TaskBlock
              content={block.content}
              specialistId={block.specialist_id}
              onTaskComplete={onTaskComplete}
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
        );
        
      // Add simple fallback for other block types
      default:
        return (
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
        );
    }
  };

  return (
    <ContentBlockErrorBoundary onRetry={() => window.location.reload()} childAge={childAge}>
      <motion.div
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
