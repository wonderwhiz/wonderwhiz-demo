
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentBlock } from '@/types/curio';
import FactBlock from '@/components/content-blocks/FactBlock';
import FunFactBlock from '@/components/content-blocks/FunFactBlock';
import QuizBlock from '@/components/content-blocks/QuizBlock';
import CreativeBlock from '@/components/content-blocks/CreativeBlock';
import ActivityBlock from '@/components/content-blocks/ActivityBlock';
import MindfulnessBlock from '@/components/content-blocks/MindfulnessBlock';
import NewsBlock from '@/components/content-blocks/NewsBlock';
import FlashcardBlock from '@/components/content-blocks/FlashcardBlock';
import GeneratingBlock from '@/components/content-blocks/GeneratingBlock';
import ErrorBlock from '@/components/content-blocks/ErrorBlock';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioBlockListProps {
  blocks: ContentBlock[];
  animateBlocks?: boolean;
  hasMoreBlocks?: boolean;
  loadingMoreBlocks?: boolean;
  loadTriggerRef?: React.RefObject<HTMLDivElement>;
  searchQuery?: string;
  profileId?: string;
  isFirstLoad?: boolean;
  handleToggleLike?: (blockId: string) => void;
  handleToggleBookmark?: (blockId: string) => void;
  handleReply?: (blockId: string, message: string) => void;
  handleQuizCorrect?: (blockId: string) => void;
  handleNewsRead?: (blockId: string) => void;
  handleCreativeUpload?: (blockId: string, content: any) => void;
  handleTaskComplete?: (blockId: string) => void;
  handleActivityComplete?: (blockId: string) => void;
  handleMindfulnessComplete?: (blockId: string) => void;
  handleRabbitHoleClick?: (question: string) => void;
  generationError?: string | null;
  onRefresh?: () => void;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks = true,
  hasMoreBlocks = false,
  loadingMoreBlocks = false,
  loadTriggerRef,
  searchQuery = '',
  profileId,
  isFirstLoad = false,
  handleToggleLike,
  handleToggleBookmark,
  handleReply,
  handleQuizCorrect,
  handleNewsRead,
  handleCreativeUpload,
  handleTaskComplete,
  handleActivityComplete,
  handleMindfulnessComplete,
  handleRabbitHoleClick,
  generationError,
  onRefresh
}) => {
  const [blockHeights, setBlockHeights] = useState<{[key: string]: number}>({});
  
  const updateBlockHeight = (blockId: string, height: number) => {
    setBlockHeights(prev => ({
      ...prev,
      [blockId]: height
    }));
  };

  // Filter for generating blocks
  const generatingBlocks = blocks.filter(block => 
    block.id?.startsWith('generating-')
  );
  
  // Filter for real content blocks
  const contentBlocks = blocks.filter(block => 
    !block.id?.startsWith('generating-')
  );

  return (
    <div className="space-y-6">
      {generationError && (
        <Alert variant="destructive" className="mb-6 bg-destructive/10 border-destructive/30 text-destructive">
          <AlertTitle>Content Generation Error</AlertTitle>
          <AlertDescription className="flex flex-col gap-4">
            <p>{generationError}</p>
            {onRefresh && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onRefresh}
                className="w-fit"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </AlertDescription>
        </Alert>
      )}

      {generatingBlocks.length > 0 && (
        <div className="space-y-6 mb-8">
          {generatingBlocks.map((block, index) => (
            <AnimatePresence key={block.id} mode="wait">
              <GeneratingBlock 
                isFirstBlock={index === 0} 
                animate={animateBlocks}
              />
            </AnimatePresence>
          ))}
        </div>
      )}

      {contentBlocks.map((block, index) => {
        const delay = Math.min(index * 0.1, 0.5);
        const blockHeight = blockHeights[block.id] || 'auto';
        
        let BlockComponent;
        
        switch(block.type) {
          case 'fact':
            BlockComponent = (
              <FactBlock 
                fact={block.content.fact}
                title={block.content.title}
                specialistId={block.specialist_id}
                rabbitHoles={block.content.rabbitHoles || []}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onTaskComplete={handleTaskComplete ? () => handleTaskComplete(block.id) : undefined}
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'funFact':
            BlockComponent = (
              <FunFactBlock 
                fact={block.content.text}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'quiz':
            BlockComponent = (
              <QuizBlock 
                question={block.content.question}
                options={block.content.options}
                correctIndex={block.content.correctIndex}
                explanation={block.content.explanation}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onCorrectAnswer={handleQuizCorrect ? () => handleQuizCorrect(block.id) : undefined}
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'creative':
            BlockComponent = (
              <CreativeBlock 
                prompt={block.content.prompt}
                description={block.content.description}
                examples={block.content.examples || []}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onUpload={handleCreativeUpload ? 
                  (content) => handleCreativeUpload(block.id, content) : 
                  undefined
                }
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'activity':
            BlockComponent = (
              <ActivityBlock 
                title={block.content.title}
                instructions={block.content.instructions}
                steps={block.content.steps || []}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onComplete={handleActivityComplete ? 
                  () => handleActivityComplete(block.id) : 
                  undefined
                }
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'mindfulness':
            BlockComponent = (
              <MindfulnessBlock 
                title={block.content.title}
                instruction={block.content.instruction}
                duration={block.content.duration}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onComplete={handleMindfulnessComplete ? 
                  () => handleMindfulnessComplete(block.id) : 
                  undefined
                }
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'news':
            BlockComponent = (
              <NewsBlock 
                headline={block.content.headline}
                summary={block.content.summary}
                body={block.content.body}
                source={block.content.source}
                date={block.content.date}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onRead={handleNewsRead ? 
                  () => handleNewsRead(block.id) : 
                  undefined
                }
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          case 'flashcard':
            BlockComponent = (
              <FlashcardBlock 
                front={block.content.front}
                back={block.content.back}
                hint={block.content.hint}
                specialistId={block.specialist_id}
                onLike={handleToggleLike ? () => handleToggleLike(block.id) : undefined}
                onBookmark={handleToggleBookmark ? () => handleToggleBookmark(block.id) : undefined}
                onReply={handleReply ? (message) => handleReply(block.id, message) : undefined}
                onTaskComplete={handleTaskComplete ? () => handleTaskComplete(block.id) : undefined}
                onRabbitHoleClick={handleRabbitHoleClick}
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
            break;
          default:
            BlockComponent = (
              <ErrorBlock 
                message={`Unknown block type: ${block.type}`} 
                updateHeight={(height) => updateBlockHeight(block.id, height)}
              />
            );
        }
        
        return (
          <motion.div
            key={block.id}
            initial={animateBlocks ? { opacity: 0, y: 20 } : false}
            animate={animateBlocks ? { opacity: 1, y: 0 } : false}
            transition={{ duration: 0.4, delay }}
            style={{ height: blockHeight }}
            className="transition-all duration-300"
          >
            {BlockComponent}
          </motion.div>
        );
      })}
      
      {loadTriggerRef && (
        <div ref={loadTriggerRef} className="h-10" />
      )}
    </div>
  );
};

export default CurioBlockList;
