
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { getSpecialistStyle, getBlockTitle } from './content-blocks/utils/specialistUtils';
import { getSequencePosition, shouldShowWonderPrompt } from './content-blocks/utils/narrativeUtils';

import BlockHeader from './content-blocks/BlockHeader';
import BlockInteractions from './content-blocks/BlockInteractions';
import ContentBlockImage from './content-blocks/ContentBlockImage';
import ContentBlockRenderer from './content-blocks/ContentBlockRenderer';
import ContentBlockReplies from './content-blocks/ContentBlockReplies';
import WonderPrompt from './content-blocks/WonderPrompt';
import NarrativeGuide from './content-blocks/NarrativeGuide';
import ConnectionsPanel from './content-blocks/ConnectionsPanel';

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
  const [expanded, setExpanded] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);
  
  const specialistStyle = getSpecialistStyle(block.specialist_id);
  const blockTitle = getBlockTitle(block);
  
  const narrativePosition: 'beginning' | 'middle' | 'end' = getSequencePosition(sequencePosition, totalBlocks);
  
  const showWonderPromptHere = shouldShowWonderPrompt(
    block.type, 
    narrativePosition, 
    block.specialist_id, 
    sequencePosition
  );
  
  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleFollow) {
      onRabbitHoleFollow(question);
    } else if (onSetQuery) {
      onSetQuery(question);
    }
  };

  const handleCreativeUploadSuccess = (feedback: string) => {
    setUploadFeedback(feedback);
    
    if (onCreativeUpload) {
      onCreativeUpload();
    }
  };
  
  const handleBlockHeightUpdate = (height: number) => {
    console.log(`Block ${block.id} height updated to ${height}px`);
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
          <ContentBlockImage
            blockId={block.id}
            isFirstBlock={isFirstBlock}
            specialistId={block.specialist_id}
            blockContent={block.content}
            narrativePosition={narrativePosition}
          />
        )}
        
        <div className="mb-4">
          <ContentBlockRenderer
            blockType={block.type}
            blockContent={block.content}
            specialistId={block.specialist_id}
            narrativePosition={narrativePosition}
            expanded={expanded}
            setExpanded={setExpanded}
            onQuizCorrect={onQuizCorrect}
            onNewsRead={onNewsRead}
            onCreativeUpload={onCreativeUpload}
            onTaskComplete={onTaskComplete}
            onActivityComplete={onActivityComplete}
            onMindfulnessComplete={onMindfulnessComplete}
            handleRabbitHoleClick={handleRabbitHoleClick}
            uploadFeedback={uploadFeedback}
            updateHeight={handleBlockHeightUpdate}
            curioId={block.curio_id}
          />
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
        
        <ContentBlockReplies
          blockId={block.id}
          specialistId={block.specialist_id}
          blockType={block.type}
          blockContent={block.content}
          userId={userId}
          childProfileId={childProfileId}
        />
        
        <BlockInteractions
          id={block.id}
          bookmarked={block.bookmarked}
          onToggleBookmark={() => onToggleBookmark(block.id)}
          type={block.type}
          onRabbitHoleClick={handleRabbitHoleClick}
          relatedQuestions={block.content?.rabbitHoles || []}
        />
      </div>
    </Card>
  );
};

export default ContentBlock;
