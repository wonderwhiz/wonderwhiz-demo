import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, MessageCircle, Bookmark, ThumbsUp, Sparkles, Star, VolumeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import EnhancedSearchBar from '@/components/curio/EnhancedSearchBar';
import QuickAnswer from '@/components/curio/QuickAnswer';
import InteractiveImageBlock from '@/components/content-blocks/InteractiveImageBlock';
import { ContentBlock as CurioContentBlock } from '@/types/curio';
import { toast } from 'sonner';

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

interface CurioContentProps {
  currentCurio: {
    id: string;
    title: string;
    query: string;
    created_at: string;
  } | null;
  contentBlocks: ContentBlock[];
  blockReplies: Record<string, any[]>;
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
  onReply: (blockId: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  childAge?: number;
  onRabbitHoleFollow?: (question: string) => void;
}) => {
  const specialist = getSpecialistInfo(block.specialist_id);
  const [replyText, setReplyText] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);
  
  const blockContent = block.content || {};
  const displayText = blockContent.text || blockContent.fact || 
    blockContent.description || blockContent.instruction || 
    blockContent.question || blockContent.front || 
    "Let's learn amazing things together!";
  
  const hasRabbitHoles = Array.isArray(blockContent.rabbitHoles) && blockContent.rabbitHoles.length > 0;
  
  const generatedRabbitHoles = hasRabbitHoles ? blockContent.rabbitHoles : [
    `Tell me more about this`,
    `Why is this important?`
  ];

  // Auto-read text for young children
  React.useEffect(() => {
    if (childAge && childAge < 7 && onReadAloud) {
      setTimeout(() => {
        onReadAloud(displayText, specialist.id || '');
      }, 800);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 overflow-hidden shadow-xl rounded-xl">
        <div className="p-6">
          <div className="flex items-center mb-4">
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
          </div>

          <div className="text-white mb-5 font-inter text-lg">
            {displayText}
          </div>

          {generatedRabbitHoles.length > 0 && childAge && childAge > 7 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {generatedRabbitHoles.slice(0, 2).map((question, index) => (
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
            </div>
          )}

          <div className="flex space-x-4 pt-3 border-t border-wonderwhiz-light-purple/20">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onToggleLike(block.id)}
              className={`text-white/70 hover:text-wonderwhiz-bright-pink font-inter ${
                block.liked ? 'text-wonderwhiz-bright-pink' : ''
              }`}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              {childAge && childAge < 8 ? "Like" : "Like"}
            </Button>

            {childAge && childAge > 7 && (
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
            )}

            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onReadAloud && onReadAloud(displayText, specialist.id || '')}
              className="text-white/70 hover:text-wonderwhiz-blue font-inter"
            >
              <VolumeIcon className="h-4 w-4 mr-1" />
              {childAge && childAge < 8 ? "Read to me" : "Read aloud"}
            </Button>
          </div>
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

  const [quickAnswerExpanded, setQuickAnswerExpanded] = useState(true);

  const handlePlayText = (text: string, specialistId: string) => {
    if (playText) {
      playText(text, specialistId);
      toast.success("Reading to you...");
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
              placeholder="What else would you like to learn?"
              childAge={childAge}
            />
          </div>
          
          <QuickAnswer 
            question={currentCurio.title}
            isExpanded={quickAnswerExpanded}
            onToggleExpand={() => setQuickAnswerExpanded(!quickAnswerExpanded)}
            onStartJourney={() => setQuickAnswerExpanded(false)}
            childId={profileId}
            childAge={childAge}
          />

          {profileId && childAge && childAge < 8 && (
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
          <span className="ml-3 text-white/70 font-inter">Finding cool things to learn...</span>
        </div>
      )}
      
      {generationError && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-white">
          <p className="font-inter">Oops! Something went wrong. Let's try again!</p>
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
          <h3 className="text-xl font-semibold text-white mb-2 font-nunito">Let's start exploring!</h3>
          <p className="text-white/70 max-w-md mx-auto font-inter">
            Ask a question or pick a topic to begin your learning adventure!
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
            onReadAloud={handlePlayText}
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
            className="border-white/20 text-white hover:bg-white/10 font-nunito"
          >
            {loadingBlocks ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/50 border-t-white rounded-full"></div>
                Loading...
              </>
            ) : (
              'Show More Fun Facts'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CurioContent;
