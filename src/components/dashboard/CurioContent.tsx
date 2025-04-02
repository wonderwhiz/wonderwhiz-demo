
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContentBlock from '@/components/ContentBlock';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

interface CurioContentProps {
  currentCurio: Curio | null;
  contentBlocks: ContentBlock[];
  blockReplies: Record<string, BlockReply[]>;
  isGenerating: boolean;
  loadingBlocks: boolean;
  visibleBlocksCount: number;
  profileId?: string;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (question: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
}

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  contentBlocks,
  blockReplies,
  isGenerating,
  loadingBlocks,
  visibleBlocksCount,
  profileId,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload
}) => {
  const feedEndRef = useRef<HTMLDivElement>(null);

  if (!currentCurio) return null;

  return (
    <div>
      <AnimatePresence>
        {(isGenerating || loadingBlocks) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="p-4 mb-6 bg-wonderwhiz-purple/20 backdrop-blur-sm rounded-lg border border-wonderwhiz-purple/30 flex items-center"
          >
            <div className="mr-3">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            </div>
            <p className="text-white">
              {isGenerating ? "Generating your personalized content..." : "Loading content blocks..."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 px-3 sm:px-4 pt-4">{currentCurio.title}</h2>
      <div className="space-y-4 px-3 sm:px-4 pb-4">
        {contentBlocks.slice(0, visibleBlocksCount).map((block, index) => (
          <motion.div 
            key={block.id} 
            className="space-y-2" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <ContentBlock 
              block={block} 
              onToggleLike={() => onToggleLike(block.id)} 
              onToggleBookmark={() => onToggleBookmark(block.id)} 
              onReply={(message) => onReply(block.id, message)} 
              onSetQuery={onSetQuery} 
              onRabbitHoleFollow={onRabbitHoleFollow} 
              onQuizCorrect={() => onQuizCorrect(block.id)} 
              onNewsRead={() => onNewsRead(block.id)} 
              onCreativeUpload={() => onCreativeUpload(block.id)} 
              colorVariant={index % 3} 
              userId={profileId} 
              childProfileId={profileId} 
            />
            
            {blockReplies[block.id] && blockReplies[block.id].length > 0 && (
              <div className="pl-3 sm:pl-4 border-l-2 border-white/20 ml-3 sm:ml-4">
                {blockReplies[block.id].map(reply => (
                  <div 
                    key={reply.id}
                    className={`mb-3 ${reply.from_user ? 'ml-auto' : ''}`}
                  >
                    <div className={`
                      p-3
                      rounded-lg
                      max-w-[85%]
                      ${reply.from_user 
                        ? 'bg-wonderwhiz-purple/30 ml-auto' 
                        : 'bg-white/10'
                      }
                    `}>
                      <p className="text-white text-sm">{reply.content}</p>
                      <div className="text-xs text-white/50 mt-1">
                        {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Load more text shown if there are more blocks to display */}
        {visibleBlocksCount < contentBlocks.length && (
          <div className="h-10 flex items-center justify-center text-white/50 text-sm">
            <div className="animate-pulse">Loading more content...</div>
          </div>
        )}
      </div>
      
      <div ref={feedEndRef} />
    </div>
  );
};

export default CurioContent;
