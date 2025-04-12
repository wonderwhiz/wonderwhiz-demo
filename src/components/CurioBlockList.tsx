
import React from 'react';
import { motion } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CurioBlockListProps {
  blocks: any[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef?: React.RefObject<HTMLDivElement>;
  searchQuery?: string;
  profileId?: string;
  isFirstLoad?: boolean;
  handleToggleLike?: (blockId: string) => void;
  handleToggleBookmark?: (blockId: string) => void;
  handleReply?: (blockId: string, message: string) => void;
  handleQuizCorrect?: (blockId: string) => void;
  handleNewsRead?: (blockId: string) => void;
  handleCreativeUpload?: (blockId: string) => void;
  handleTaskComplete?: (blockId: string) => void;
  handleActivityComplete?: (blockId: string) => void;
  handleMindfulnessComplete?: (blockId: string) => void;
  handleRabbitHoleClick?: (question: string) => void;
  generationError?: boolean;
  onRefresh?: () => void;
}

const CurioBlockList: React.FC<CurioBlockListProps> = ({
  blocks,
  animateBlocks,
  hasMoreBlocks,
  loadingMoreBlocks,
  loadTriggerRef,
  searchQuery,
  profileId,
  isFirstLoad,
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
  const getStaggerDelay = (index: number) => {
    return searchQuery ? 0 : Math.min(index * 0.05, 0.3);
  };
  
  return (
    <div className="space-y-6 mb-10">
      {blocks.map((block, index) => (
        <motion.div
          key={block.id}
          initial={animateBlocks ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: getStaggerDelay(index)
          }}
        >
          <ContentBlock
            block={block}
            onLike={() => handleToggleLike && handleToggleLike(block.id)}
            onBookmark={() => handleToggleBookmark && handleToggleBookmark(block.id)}
            onReply={(message) => handleReply && handleReply(block.id, message)}
            onQuizCorrect={() => handleQuizCorrect && handleQuizCorrect(block.id)}
            onNewsRead={() => handleNewsRead && handleNewsRead(block.id)}
            onCreativeUpload={() => handleCreativeUpload && handleCreativeUpload(block.id)}
            onTaskComplete={() => handleTaskComplete && handleTaskComplete(block.id)}
            onActivityComplete={() => handleActivityComplete && handleActivityComplete(block.id)} 
            onMindfulnessComplete={() => handleMindfulnessComplete && handleMindfulnessComplete(block.id)}
            onRabbitHoleClick={handleRabbitHoleClick}
            profileId={profileId}
          />
        </motion.div>
      ))}
      
      {loadingMoreBlocks && (
        <div className="w-full text-center py-4">
          <div className="inline-block h-6 w-6 rounded-full border-2 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        </div>
      )}
      
      {blocks.length === 0 && !loadingMoreBlocks && searchQuery && (
        <div className="text-center py-10">
          <p className="text-white/70 mb-3">No results found for "{searchQuery}"</p>
        </div>
      )}
      
      {generationError && (
        <div className="text-center py-6 bg-white/5 rounded-lg border border-white/10">
          <p className="text-white/70 mb-3">
            Oops! We had trouble generating more content.
          </p>
          
          {onRefresh && (
            <Button 
              onClick={onRefresh}
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      )}
      
      {loadTriggerRef && (
        <div ref={loadTriggerRef} className="h-20"></div>
      )}
    </div>
  );
};

export default CurioBlockList;
