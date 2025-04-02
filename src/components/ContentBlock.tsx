import React from 'react';
import { ContentBlock as ContentBlockType } from '@/types/curio';
import FactBlock from '@/components/content-blocks/FactBlock';

interface ContentBlockProps {
  block: ContentBlockType;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onRabbitHoleClick: (question: string) => void;
  colorVariant?: number;
  userId?: string;
  childProfileId?: string;
  onQuizCorrect?: () => void;
  onNewsRead?: () => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  isFirstBlock?: boolean;
  onSetQuery?: (query: string) => void;
}

const ContentBlock = (props: ContentBlockProps) => {
  // The implementation here would handle routing the props to the appropriate block type
  // For now, we'll use props directly with the original content block implementation
  return (
    <div className="content-block">
      {/* This would render the actual content based on block type */}
      {props.block.type === 'fact' && (
        <FactBlock 
          content={props.block.content} 
          onRabbitHoleClick={props.onRabbitHoleClick}
        />
      )}
      {/* Other block types would be rendered here */}
    </div>
  );
};

export default ContentBlock;
