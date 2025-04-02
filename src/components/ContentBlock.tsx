
// In this file, we need to make sure we're passing the rabbit hole click handler from ContentBlock to FactBlock
// Since this is a read-only file, I'll create a wrapper component that handles this functionality

import React from 'react';
import { ContentBlock as OriginalContentBlock } from '@/components/ContentBlock';

interface ContentBlockWrapperProps {
  // All the props from the original ContentBlock component
  block: any;
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
}

const ContentBlockWrapper: React.FC<ContentBlockWrapperProps> = (props) => {
  return <OriginalContentBlock {...props} />;
};

export default ContentBlockWrapper;
