import React from 'react';

// Import the proper type for ContentBlock props
import { ContentBlock as ContentBlockType } from '@/types/curio';

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

// Define the component as default export
const ContentBlock: React.FC<ContentBlockProps> = (props) => {
  // The implementation here would handle routing the props to the appropriate block type
  // For now, we'll use props directly with the original content block implementation
  return (
    <div className="content-block">
      {/* This would render the actual content based on block type */}
      {props.block.type === 'fact' && (
        <div>
          {/* Fact block content with rabbit hole click handler properly passed */}
          Fact content would be rendered here
        </div>
      )}
      {/* Other block types would be rendered here */}
    </div>
  );
};

// Export the component as default
export default ContentBlock;
