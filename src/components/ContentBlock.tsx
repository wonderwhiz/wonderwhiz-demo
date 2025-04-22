
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
import { blockContainer } from './content-blocks/utils/blockStyles';
import { blockVariants } from './content-blocks/utils/blockAnimations';
import { ContentBlockType, isValidContentBlockType } from '@/types/curio';

interface ContentBlockProps {
  block: {
    id: string;
    type: string;
    content: any;
    specialist_id: string;
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
  
  // Render different block types
  const renderBlockContent = () => {
    switch (block.type) {
      case 'quiz':
        return (
          <EnhancedQuizBlock 
            question={block.content.question}
            options={block.content.options}
            correctIndex={block.content.correctIndex}
            explanation={block.content.explanation}
            onCorrect={onQuizCorrect}
            childAge={childAge}
          />
        );
        
      case 'fact':
        return (
          <FactBlock 
            fact={block.content.fact}
            title={block.content.title}
            specialistId={block.specialist_id}
            rabbitHoles={block.content.rabbitHoles}
            onRabbitHoleClick={onRabbitHoleClick}
            onReadAloud={onReadAloud}
          />
        );
        
      case 'news':
        return (
          <NewsBlock 
            content={block.content}
            specialistId={block.specialist_id}
            onNewsRead={onNewsRead}
          />
        );
        
      case 'riddle':
        return (
          <RiddleBlock
            content={block.content}
            specialistId={block.specialist_id}
          />
        );
        
      case 'funFact':
        return (
          <FunFactBlock 
            fact={block.content.text || block.content.fact}
            specialistId={block.specialist_id}
            onLike={onLike}
            onBookmark={onBookmark}
            onReply={onReply}
            onRabbitHoleClick={onRabbitHoleClick}
            childAge={childAge}
          />
        );
        
      case 'flashcard':
        return (
          <FlashcardBlock
            content={block.content}
            specialistId={block.specialist_id}
            childAge={childAge}
          />
        );
        
      case 'creative':
        return (
          <CreativeBlock
            content={block.content}
            specialistId={block.specialist_id}
            onCreativeUpload={onCreativeUpload}
            childAge={childAge}
          />
        );
        
      case 'activity':
        return (
          <ActivityBlock
            content={block.content}
            specialistId={block.specialist_id}
            onActivityComplete={onActivityComplete}
            childAge={childAge}
          />
        );
        
      case 'mindfulness':
        return (
          <MindfulnessBlock
            content={block.content}
            specialistId={block.specialist_id}
            onMindfulnessComplete={onMindfulnessComplete}
            childAge={childAge}
          />
        );
        
      case 'task':
        return (
          <TaskBlock
            content={block.content}
            specialistId={block.specialist_id}
            onTaskComplete={onTaskComplete}
            childAge={childAge}
          />
        );
        
      // Add simple fallback for other block types
      default:
        return (
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
      </motion.div>
    </ContentBlockErrorBoundary>
  );
};

export default ContentBlock;
