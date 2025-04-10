import React from 'react';
import { motion } from 'framer-motion';
import FactBlock from './content-blocks/FactBlock';
import QuizBlock from './content-blocks/QuizBlock';
import CreativeBlock from './content-blocks/CreativeBlock';
import NewsBlock from './content-blocks/NewsBlock';
import ActivityBlock from './content-blocks/ActivityBlock';
import MindfulnessBlock from './content-blocks/MindfulnessBlock';
import IllustratedContentBlock from './content-blocks/IllustratedContentBlock';
import ContextualRecommendations from './content-blocks/ContextualRecommendations';
import { ContentBlock } from '@/types/curio';
import { Refresh } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CurioBlockListProps {
  blocks: ContentBlock[];
  animateBlocks: boolean;
  hasMoreBlocks: boolean;
  loadingMoreBlocks: boolean;
  loadTriggerRef: React.RefObject<HTMLDivElement>;
  searchQuery: string;
  profileId?: string;
  isFirstLoad: boolean;
  handleToggleLike: (blockId: string) => void;
  handleToggleBookmark: (blockId: string) => void;
  handleReply: (blockId: string, message: string) => void;
  handleQuizCorrect: (blockId: string, isCorrect: boolean) => void;
  handleNewsRead: (blockId: string) => void;
  handleCreativeUpload: (blockId: string, fileUrl: string) => void;
  handleTaskComplete: (blockId: string) => void;
  handleActivityComplete: (blockId: string) => void;
  handleMindfulnessComplete: (blockId: string) => void;
  handleRabbitHoleClick: (question: string) => void;
  generationError: string | null;
  onRefresh: () => void;
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
  const blockVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut"
      }
    }
  };
  
  if (blocks.length === 0 && !isFirstLoad) {
    return (
      <div className="text-center text-white/60 mt-6">
        {searchQuery ? (
          <>
            <p>No results found for "{searchQuery}".</p>
          </>
        ) : (
          <>
            {generationError ? (
              <>
                <p>{generationError}</p>
                <Button onClick={onRefresh} variant="secondary" size="sm" className="mt-2">
                  <Refresh className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </>
            ) : (
              <p>No content available.</p>
            )}
          </>
        )}
      </div>
    );
  }
  
  return (
    <>
      {blocks.map((block, index) => (
        <motion.div
          key={block.id}
          variants={blockVariants}
          initial="hidden"
          animate={animateBlocks ? "hidden" : "visible"}
          transition={{ delay: index * 0.1 }}
        >
          {block.type === 'fact' && (
            <FactBlock
              fact={block.content.fact}
              title={block.content.title}
              specialistId={block.specialist_id}
              rabbitHoles={block.content.rabbitHoles}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
              onRabbitHoleClick={handleRabbitHoleClick}
            />
          )}
          
          {block.type === 'funFact' && (
            <FactBlock
              fact={block.content.fact}
              title="Fun Fact"
              specialistId={block.specialist_id}
              rabbitHoles={block.content.rabbitHoles}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
              onRabbitHoleClick={handleRabbitHoleClick}
            />
          )}
          
          {block.type === 'quiz' && (
            <QuizBlock
              question={block.content.question}
              options={block.content.options}
              correctAnswer={block.content.correctAnswer}
              explanation={block.content.explanation}
              specialistId={block.specialist_id}
              onCorrect={(isCorrect) => handleQuizCorrect(block.id, isCorrect)}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
          
          {block.type === 'creative' && (
            <CreativeBlock
              prompt={block.content.prompt}
              specialistId={block.specialist_id}
              onUpload={(fileUrl) => handleCreativeUpload(block.id, fileUrl)}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
          
          {block.type === 'news' && (
            <NewsBlock
              title={block.content.title}
              content={block.content.content}
              source={block.content.source}
              imageUrl={block.content.imageUrl}
              specialistId={block.specialist_id}
              onRead={() => handleNewsRead(block.id)}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
          
          {block.type === 'activity' && (
            <ActivityBlock
              title={block.content.title}
              description={block.content.description}
              steps={block.content.steps}
              materials={block.content.materials}
              specialistId={block.specialist_id}
              onComplete={() => handleActivityComplete(block.id)}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
          
          {block.type === 'mindfulness' && (
            <MindfulnessBlock
              title={block.content.title}
              description={block.content.description}
              audioUrl={block.content.audioUrl}
              specialistId={block.specialist_id}
              onComplete={() => handleMindfulnessComplete(block.id)}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
          
          {block.type === 'illustrated' && (
            <IllustratedContentBlock
              topic={block.content.topic}
              specialistId={block.specialist_id}
              onLike={() => handleToggleLike(block.id)}
              onBookmark={() => handleToggleBookmark(block.id)}
              onReply={(message) => handleReply(block.id, message)}
            />
          )}
        </motion.div>
      ))}
      
      {profileId && blocks.length > 0 && (
        <ContextualRecommendations
          recommendations={[
            "Why is the sky blue?",
            "How do birds fly?",
            "What is a black hole?",
            "Why do we have seasons?"
          ]}
          onRecommendationClick={handleRabbitHoleClick}
          profileId={profileId}
        />
      )}

      {hasMoreBlocks && (
        <div ref={loadTriggerRef} className="py-6 text-center text-white/60">
          {loadingMoreBlocks ? (
            <p>Loading more content...</p>
          ) : (
            <p>Loading more content...</p>
          )}
        </div>
      )}
    </>
  );
};

export default CurioBlockList;
