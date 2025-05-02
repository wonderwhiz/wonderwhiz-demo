import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, MessageCircle, Bookmark, ThumbsUp, Sparkles, Star, VolumeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import InteractiveSearchBar from '@/components/dashboard/SearchBar';
import QuickAnswer from '@/components/curio/QuickAnswer';
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import { ContentBlock as CurioContentBlock } from '@/types/curio';
import { toast } from 'sonner';
import AgeAdaptiveContent from '@/components/curio/AgeAdaptiveContent';
import EnhancedSearchBar from '@/components/curio/EnhancedSearchBar';
import FireflyQuizBlock from '@/components/curio/FireflyQuizBlock';
import MindfulnessBlock from '@/components/curio/MindfulnessBlock';
import CreativeBlock from '@/components/curio/CreativeBlock';
import ActivityBlock from '@/components/content-blocks/ActivityBlock';
import TaskBlock from '@/components/content-blocks/TaskBlock';
import RiddleBlock from '@/components/content-blocks/RiddleBlock';
import FlashcardBlock from '@/components/content-blocks/FlashcardBlock';
import { BlockError } from '@/components/content-blocks/BlockError';

interface ContentBlock {
  id: string;
  type: 'fact' | 'quiz' | 'flashcard' | 'creative' | 'task' | 'riddle' | 'funFact' | 'activity' | 'news' | 'mindfulness';
  specialist_id: string;
  content: any;
  liked: boolean;
  bookmarked: boolean;
  curio_id?: string;
  learningContext?: {
    sequencePosition: number;
    totalBlocks: number;
    cognitiveLevel: string;
    timeOfDay: string;
    recommendedPacing: string;
  };
}

interface BlockReply {
  id: string;
  block_id: string;
  content: string;
  from_user: boolean;
  created_at: string;
}

interface Curio {
  id: string;
  title: string;
  query: string;
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
  onLoadMore: () => void;
  hasMoreBlocks: boolean;
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onSetQuery: (query: string) => void;
  onRabbitHoleFollow: (question: string) => void;
  onQuizCorrect: (blockId: string) => void;
  onNewsRead: (blockId: string) => void;
  onCreativeUpload: (blockId: string) => void;
  onRefresh?: () => void;
  generationError?: string | null;
  playText?: (text: string, specialistId: string) => void;
  childAge?: number;
}

interface SpecialistInfo {
  id?: string;
  name: string;
  title?: string;
  avatar: string;
  fallbackColor: string;
  fallbackInitial: string;
}

const getSpecialistInfo = (specialistId: string): SpecialistInfo => {
  const specialists = {
    nova: {
      id: 'nova',
      name: 'Nova',
      title: 'Space Expert',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      id: 'spark',
      name: 'Spark',
      title: 'Creative Genius',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      id: 'prism',
      name: 'Prism',
      title: 'Science Wizard',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    pixel: {
      id: 'pixel',
      name: 'Pixel',
      title: 'Tech Guru',
      avatar: '/specialists/pixel-avatar.png',
      fallbackColor: 'bg-indigo-600',
      fallbackInitial: 'P',
    },
    atlas: {
      id: 'atlas',
      name: 'Atlas',
      title: 'History Expert',
      avatar: '/specialists/atlas-avatar.png',
      fallbackColor: 'bg-amber-700',
      fallbackInitial: 'A',
    },
    lotus: {
      id: 'lotus',
      name: 'Lotus',
      title: 'Nature Guide',
      avatar: '/specialists/lotus-avatar.png',
      fallbackColor: 'bg-emerald-600',
      fallbackInitial: 'L',
    },
    whizzy: {
      id: 'whizzy',
      name: 'Whizzy',
      title: 'Assistant',
      avatar: '/specialists/whizzy-avatar.png',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'W',
    },
  };

  return specialists[specialistId as keyof typeof specialists] || {
    id: 'default',
    name: 'Whizzy',
    title: 'Assistant',
    avatar: '/specialists/whizzy-avatar.png',
    fallbackColor: 'bg-purple-600',
    fallbackInitial: 'W',
  };
};

const CurioBlock = ({ 
  block, 
  onToggleLike, 
  onToggleBookmark, 
  onReply,
  onReadAloud,
  childAge = 10,
  onRabbitHoleFollow
}: { 
  block: ContentBlock; 
  onToggleLike: (blockId: string) => void;
  onToggleBookmark: (blockId: string) => void;
  onReply: (blockId: string, message: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  childAge?: number;
  onRabbitHoleFollow?: (question: string) => void;
}) => {
  const specialist = getSpecialistInfo(block.specialist_id);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { 
      y: childAge <= 7 ? -8 : childAge <= 11 ? -4 : -2,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 5 }
  };

  const blockContent = block.content || {};
  const displayText = blockContent.text || blockContent.fact || 
    blockContent.description || blockContent.instruction || 
    blockContent.question || blockContent.front || 
    "Discover more amazing facts about this topic with our specialists!";
  
  const hasRabbitHoles = Array.isArray(blockContent.rabbitHoles) && blockContent.rabbitHoles.length > 0;
  
  const generatedRabbitHoles = hasRabbitHoles ? blockContent.rabbitHoles : [
    `Tell me more about ${block.type === 'fact' ? 'this fact' : 'this topic'}`,
    `Why is this ${block.type === 'fact' ? 'fact' : 'information'} important?`
  ];

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.4 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 overflow-hidden shadow-xl rounded-xl">
        <div className="p-6">
          <motion.div 
            className="flex items-center mb-4"
            variants={contentVariants}
          >
            <Avatar className="h-12 w-12 border-2 border-white/20 ring-2 ring-wonderwhiz-bright-pink/20">
              <AvatarImage src={specialist.avatar} alt={specialist.name} />
              <AvatarFallback className={`${specialist.fallbackColor} font-nunito`}>
                {specialist.fallbackInitial}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="text-lg font-bold text-white font-nunito">{specialist.name}</h3>
                <div className={`ml-2 h-2 w-2 rounded-full ${
                  specialist.id === 'nova' ? 'bg-wonderwhiz-bright-pink' :
                  specialist.id === 'spark' ? 'bg-wonderwhiz-vibrant-yellow' :
                  'bg-wonderwhiz-cyan'
                }`} />
              </div>
              <p className="text-sm text-white/70 font-inter">{specialist.title}</p>
            </div>
          </motion.div>

          <motion.div 
            className="text-white mb-5 font-inter"
            variants={contentVariants}
          >
            {displayText}
          </motion.div>

          {generatedRabbitHoles.length > 0 && (
            <motion.div 
              className="flex flex-wrap gap-2 mb-4"
              variants={contentVariants}
            >
              {generatedRabbitHoles.map((question, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-white/5 hover:bg-white/10 border-wonderwhiz-bright-pink/30 hover:border-wonderwhiz-bright-pink text-white cursor-pointer transition-all duration-300 font-inter"
                  onClick={() => onRabbitHoleFollow && onRabbitHoleFollow(question)}
                >
                  <Sparkles className="w-3 h-3 mr-1 text-wonderwhiz-vibrant-yellow" />
                  {question}
                </Badge>
              ))}
            </motion.div>
          )}

          <motion.div 
            className="flex space-x-4 pt-3 border-t border-wonderwhiz-light-purple/20"
            variants={contentVariants}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleLike(block.id)}
              className={`text-white/70 hover:text-wonderwhiz-bright-pink font-inter ${
                block.liked ? 'text-wonderwhiz-bright-pink' : ''
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Like
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleBookmark(block.id)}
              className={`text-white/70 hover:text-wonderwhiz-vibrant-yellow font-inter ${
                block.bookmarked ? 'text-wonderwhiz-vibrant-yellow' : ''
              }`}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-white/70 hover:text-wonderwhiz-cyan font-inter"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>

            {onReadAloud && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onReadAloud(displayText, specialist.id || '')}
                className="text-white/70 hover:text-wonderwhiz-blue font-inter"
              >
                <VolumeIcon className="h-4 w-4 mr-1" />
                {childAge && childAge < 8 ? "Read to me" : "Read aloud"}
              </Button>
            )}
          </motion.div>

          {showReplyInput && (
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full bg-white/5 border border-wonderwhiz-light-purple/30 rounded-lg px-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50 font-inter"
                />
                <Button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                  size="sm"
                  onClick={() => {
                    if (replyText.trim()) {
                      onReply(block.id, replyText);
                      setReplyText('');
                      setShowReplyInput(false);
                    }
                  }}
                >
                  Send
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

const CurioContent: React.FC<CurioContentProps> = ({
  currentCurio,
  contentBlocks,
  blockReplies,
  isGenerating,
  loadingBlocks,
  visibleBlocksCount,
  profileId,
  onLoadMore,
  hasMoreBlocks,
  onToggleLike,
  onToggleBookmark,
  onReply,
  onSetQuery,
  onRabbitHoleFollow,
  onQuizCorrect,
  onNewsRead,
  onCreativeUpload,
  onRefresh,
  generationError,
  playText,
  childAge
}) => {
  const convertedBlocks: CurioContentBlock[] = contentBlocks.map(block => ({
    ...block,
    curio_id: block.curio_id || currentCurio?.id || ''
  }));

  const handlePlayText = (text: string, specialistId: string) => {
    toast.success("Playing audio...");
    if (playText) {
      playText(text, specialistId);
    }
  };

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'quiz':
        return (
          <FireflyQuizBlock
            key={block.id}
            question={block.content?.question || "Question not available"}
            options={block.content?.options || []}
            correctIndex={block.content?.correctIndex || 0}
            explanation={block.content?.explanation || ""}
            specialistId={block.specialist_id || "whizzy"}
            onQuizCorrect={() => onQuizCorrect(block.id)}
            childAge={childAge}
          />
        );
        
      case 'mindfulness':
        return (
          <MindfulnessBlock
            key={block.id}
            title={block.content?.title || "Mindfulness Exercise"}
            instructions={block.content?.instruction || block.content?.exercise || "Take a deep breath..."}
            duration={block.content?.duration || 180}
            benefit={block.content?.benefit || ""}
            onComplete={() => onToggleLike(block.id)}
            childAge={childAge}
          />
        );
        
      case 'creative':
        return (
          <CreativeBlock
            key={block.id}
            content={block.content || {}}
            specialistId={block.specialist_id || "spark"}
            onCreativeUpload={() => onCreativeUpload(block.id)}
            childAge={childAge}
          />
        );
        
      case 'activity':
        return (
          <ActivityBlock
            key={block.id}
            content={block.content || {}}
            specialistId={block.specialist_id || "nova"}
            onActivityComplete={() => onToggleLike(block.id)}
            updateHeight={() => {}}
            childAge={childAge}
          />
        );
        
      case 'task':
        return (
          <TaskBlock
            key={block.id}
            content={block.content || {}}
            specialistId={block.specialist_id || "lotus"}
            onTaskComplete={() => onToggleLike(block.id)}
            updateHeight={() => {}}
            childAge={childAge}
          />
        );
        
      case 'riddle':
        return (
          <RiddleBlock
            key={block.id}
            content={block.content || {}}
            specialistId={block.specialist_id || "atlas"}
            updateHeight={() => {}}
            childAge={childAge}
          />
        );
        
      case 'flashcard':
        return (
          <FlashcardBlock
            key={block.id}
            content={block.content || {}}
            specialistId={block.specialist_id || "prism"}
            updateHeight={() => {}}
            childAge={childAge}
          />
        );
        
      default:
        return (
          <CurioBlock 
            key={block.id}
            block={block}
            onToggleLike={onToggleLike}
            onToggleBookmark={onToggleBookmark}
            onReply={onReply}
            onReadAloud={playText}
            childAge={childAge}
            onRabbitHoleFollow={onRabbitHoleFollow}
          />
        );
    }
  };

  return (
    <div className="space-y-6 px-4 py-4">
      {currentCurio && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 font-nunito">{currentCurio.title}</h2>
          
          <div className="mb-6">
            <EnhancedSearchBar
              onSearch={onSetQuery}
              placeholder="Ask another question or explore something new..."
              childAge={childAge}
            />
          </div>
          
          <QuickAnswer 
            question={currentCurio.title}
            onStartJourney={() => {}}
            childId={profileId}
          />

          {profileId && (
            <InteractiveImageBlock
              topic={currentCurio.title}
              childId={profileId}
              childAge={childAge || 10}
              onShare={() => toast.success("Image shared!")}
            />
          )}
        </div>
      )}
      
      {isGenerating && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wonderwhiz-bright-pink"></div>
          <span className="ml-3 text-white/70 font-inter">Generating insights...</span>
        </div>
      )}
      
      {generationError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-white">
          <p className="font-inter">There was an error generating content: {generationError}</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="mt-2 border-red-500/30 text-white hover:bg-red-500/20 font-inter"
            >
              Try Again
            </Button>
          )}
        </div>
      )}
      
      {contentBlocks.length === 0 && !isGenerating && !generationError && (
        <div className="text-center py-8">
          <div className="bg-wonderwhiz-purple/30 inline-block p-4 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-wonderwhiz-vibrant-yellow" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2 font-nunito">No content yet</h3>
          <p className="text-white/70 max-w-md mx-auto font-inter">
            Ask a question or choose a suggested topic to start your learning journey.
          </p>
        </div>
      )}
      
      <motion.div 
        className="space-y-8 px-6 py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'linear-gradient(to bottom, rgba(30, 30, 40, 0.3), rgba(15, 15, 25, 0.5))',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
        }}
      >
        {contentBlocks.map((block, idx) => (
          <motion.div
            key={block.id || idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: idx * 0.1,
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
          >
            {renderBlock(block)}
          </motion.div>
        ))}
      </motion.div>
      
      {hasMoreBlocks && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingBlocks}
            className="border-white/20 text-white hover:bg-white/10 font-nunito"
          >
            {loadingBlocks ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/50 border-t-white rounded-full"></div>
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CurioContent;
