
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, MessageCircle, Bookmark, ThumbsUp, Sparkles, Star, VolumeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
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

const getSpecialistInfo = (specialistId: string) => {
  const specialists = {
    nova: {
      name: 'Nova',
      title: 'Space Expert',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      name: 'Spark',
      title: 'Creative Genius',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      name: 'Prism',
      title: 'Science Wizard',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    pixel: {
      name: 'Pixel',
      title: 'Tech Guru',
      avatar: '/specialists/pixel-avatar.png',
      fallbackColor: 'bg-indigo-600',
      fallbackInitial: 'P',
    },
    atlas: {
      name: 'Atlas',
      title: 'History Expert',
      avatar: '/specialists/atlas-avatar.png',
      fallbackColor: 'bg-amber-700',
      fallbackInitial: 'A',
    },
    lotus: {
      name: 'Lotus',
      title: 'Nature Guide',
      avatar: '/specialists/lotus-avatar.png',
      fallbackColor: 'bg-emerald-600',
      fallbackInitial: 'L',
    },
    whizzy: {
      name: 'Whizzy',
      title: 'Assistant',
      avatar: '/specialists/whizzy-avatar.png',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'W',
    },
  };

  return specialists[specialistId as keyof typeof specialists] || specialists.whizzy;
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
  
  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(block.id, replyText);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const getBlockContent = () => {
    switch (block.type) {
      case 'fact':
      case 'funFact':
        return block.content?.fact || block.content?.text;
      case 'quiz':
        return block.content?.question;
      case 'creative':
        return block.content?.prompt;
      case 'task':
        return block.content?.task;
      case 'riddle':
        return block.content?.riddle;
      case 'news':
        return block.content?.summary;
      case 'activity':
        return block.content?.activity;
      case 'mindfulness':
        return block.content?.exercise;
      default:
        return "Content not available";
    }
  };

  const handleReadContent = () => {
    const content = getBlockContent();
    if (content && onReadAloud) {
      onReadAloud(content, block.specialist_id);
    }
  };

  // For quiz blocks, render the FireflyQuizBlock
  if (block.type === 'quiz' && block.content?.options) {
    return (
      <FireflyQuizBlock
        question={block.content.question}
        options={block.content.options}
        correctIndex={block.content.correctIndex}
        explanation={block.content.explanation}
        childAge={childAge}
      />
    );
  }

  // For mindfulness blocks, render the MindfulnessBlock
  if (block.type === 'mindfulness' && block.content) {
    return (
      <MindfulnessBlock
        title={block.content.title || "Mindfulness Moment"}
        instructions={block.content.exercise || block.content.text || "Take a moment to breathe and relax."}
        duration={block.content.duration || 180}
        benefit={block.content.benefit}
        childAge={childAge}
      />
    );
  }

  // For creative blocks, render the CreativeBlock
  if (block.type === 'creative' && block.content) {
    return (
      <CreativeBlock
        prompt={block.content.prompt || "Use your imagination to explore this topic creatively."}
        examples={block.content.examples || ["Draw a picture", "Write a story", "Make a model"]}
        specialistId={block.specialist_id}
        childAge={childAge}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-wonderwhiz-purple border-none overflow-hidden">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <Avatar className="h-12 w-12 border-2 border-white/20">
              <AvatarImage src={specialist.avatar} alt={specialist.name} />
              <AvatarFallback className={specialist.fallbackColor}>{specialist.fallbackInitial}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-white">{specialist.name}</h3>
                {block.specialist_id === 'nova' && (
                  <div className="ml-2 text-xs bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded-full">•</div>
                )}
                {block.specialist_id === 'spark' && (
                  <div className="ml-2 text-xs bg-yellow-500/30 text-yellow-200 px-1.5 py-0.5 rounded-full">•</div>
                )}
              </div>
              <p className="text-sm text-white/70">{specialist.title}</p>
            </div>
          </div>
          
          {childAge && childAge < 12 ? (
            <AgeAdaptiveContent
              content={getBlockContent()}
              childAge={childAge}
              onReadAloud={handleReadContent}
              onBookmark={() => onToggleBookmark(block.id)}
            />
          ) : (
            <div className="text-white mb-5">
              {getBlockContent()}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {block.content?.rabbitHoles?.map((question: string, index: number) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="bg-white/10 hover:bg-white/20 cursor-pointer text-white/90 border-white/20"
                onClick={() => onRabbitHoleFollow && onRabbitHoleFollow(question)}
              >
                {question}
              </Badge>
            ))}
          </div>
          
          <div className="flex space-x-4 pt-2 border-t border-white/10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleLike(block.id)}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${block.liked ? 'text-pink-400 hover:text-pink-400' : ''}`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Like
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleBookmark(block.id)}
              className={`text-white/70 hover:text-white hover:bg-white/10 ${block.bookmarked ? 'text-yellow-400 hover:text-yellow-400' : ''}`}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Save
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <MessageCircle className="h-4 w-4 mr-1" />
              Reply
            </Button>
            
            {onReadAloud && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleReadContent}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <VolumeIcon className="h-4 w-4 mr-1" />
                {childAge && childAge < 8 ? "Read to me" : "Read aloud"}
              </Button>
            )}
          </div>
          
          {showReplyInput && (
            <div className="mt-3 flex">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 bg-white/10 border-white/20 rounded-l-md p-2 text-white placeholder:text-white/50 outline-none"
              />
              <Button 
                className="rounded-l-none bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80"
                onClick={handleSubmitReply}
              >
                Send
              </Button>
            </div>
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

  return (
    <div className="space-y-6 px-4 py-4">
      {currentCurio && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">{currentCurio.title}</h2>
          
          <div className="mb-6">
            <EnhancedSearchBar
              onSearch={onSetQuery}
              placeholder="Ask another question or explore something new..."
              childAge={childAge}
            />
          </div>
          
          <QuickAnswer 
            question={currentCurio.title}
            isExpanded={false}
            onToggleExpand={() => {}}
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
          <span className="ml-3 text-white/70">Generating insights...</span>
        </div>
      )}
      
      {generationError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-white">
          <p>There was an error generating content: {generationError}</p>
          {onRefresh && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh}
              className="mt-2 border-red-500/30 text-white hover:bg-red-500/20"
            >
              Try Again
            </Button>
          )}
        </div>
      )}
      
      {contentBlocks.length === 0 && !isGenerating && !generationError && (
        <div className="text-center py-8">
          <div className="bg-wonderwhiz-purple/30 inline-block p-4 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-wonderwhiz-yellow" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No content yet</h3>
          <p className="text-white/70 max-w-md mx-auto">
            Ask a question or choose a suggested topic to start your learning journey.
          </p>
        </div>
      )}
      
      <div className="space-y-6">
        {contentBlocks.map((block) => (
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
        ))}
      </div>
      
      {hasMoreBlocks && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={onLoadMore}
            disabled={loadingBlocks}
            className="border-white/20 text-white hover:bg-white/10"
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
