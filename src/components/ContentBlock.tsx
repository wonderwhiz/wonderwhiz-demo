
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedQuizBlock from './content-blocks/EnhancedQuizBlock';
import FactBlock from './content-blocks/FactBlock';
import NewsBlock from './content-blocks/NewsBlock';
import { blockContainer } from './content-blocks/utils/blockStyles';
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
  profileId
}) => {
  // Verify the block type to ensure it's valid for the blockContainer function
  const blockType = isValidContentBlockType(block.type) ? block.type : 'fact';
  
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
        
      default:
        return (
          <div className={blockContainer({ type: blockType })}>
            <pre className="text-white/90 whitespace-pre-wrap">
              {JSON.stringify(block.content, null, 2)}
            </pre>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="mb-6"
    >
      {renderBlockContent()}
    </motion.div>
  );
};

export default ContentBlock;
