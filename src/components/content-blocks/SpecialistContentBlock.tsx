
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Share2, MessageCircle, Bookmark, ThumbsUp, VolumeUp, Loader2 } from 'lucide-react';
import { getSpecialistInfo } from '@/lib/specialists';
import { ContentBlockType } from '@/types/curio';
import BlockReplies from './BlockReplies';

interface SpecialistContentBlockProps {
  specialistId: string;
  title?: string;
  content: React.ReactNode;
  contentType: ContentBlockType;
  difficultyLevel?: 1 | 2 | 3;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onShare?: () => void;
  onReadAloud?: () => void;
  childAge?: number;
  relatedQuestions?: string[];
  onRabbitHoleClick?: (question: string) => void;
  className?: string;
  isLoading?: boolean;
}

const SpecialistContentBlock: React.FC<SpecialistContentBlockProps> = ({
  specialistId,
  title,
  content,
  contentType,
  difficultyLevel = 1,
  onBookmark,
  onReply,
  onShare,
  onReadAloud,
  childAge = 10,
  relatedQuestions = [],
  onRabbitHoleClick,
  className = '',
  isLoading = false
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const specialist = getSpecialistInfo(specialistId);
  
  const contentTypeColor: Record<ContentBlockType, string> = {
    fact: 'bg-blue-600/80',
    quiz: 'bg-purple-600/80',
    flashcard: 'bg-emerald-600/80',
    creative: 'bg-pink-600/80',
    task: 'bg-amber-600/80',
    riddle: 'bg-cyan-600/80',
    funFact: 'bg-amber-600/80',
    activity: 'bg-teal-600/80',
    news: 'bg-red-600/80',
    mindfulness: 'bg-indigo-600/80'
  };
  
  const getBadgeStyle = () => {
    return contentTypeColor[contentType] || 'bg-gray-600/80';
  };
  
  const handleRabbitHoleClick = (question: string) => {
    if (onRabbitHoleClick) {
      onRabbitHoleClick(question);
    }
  };
  
  return (
    <Card className={`overflow-hidden border border-white/10 bg-wonderwhiz-deep-purple/40 backdrop-blur-sm ${className} ${isLoading ? 'animate-pulse' : ''}`}>
      <div className="p-4 sm:p-5">
        {/* Specialist header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex-shrink-0">
              {isLoading ? (
                <div className="w-10 h-10 bg-white/10"></div>
              ) : specialist?.avatar ? (
                <img 
                  src={specialist.avatar} 
                  alt={specialist.name} 
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-purple-700 to-pink-600"></div>
              )}
            </div>
            <div className="ml-3">
              <div className="font-semibold text-white">
                {isLoading ? (
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                ) : (
                  specialist?.name || specialistId
                )}
              </div>
              <div className="text-xs text-white/60">
                {isLoading ? (
                  <div className="h-3 w-32 bg-white/10 rounded mt-1"></div>
                ) : (
                  specialist?.title || 'Specialist'
                )}
              </div>
            </div>
          </div>
          <Badge className={`${getBadgeStyle()} text-white`}>
            {contentType === 'funFact' ? 'Fun Fact' : contentType.charAt(0).toUpperCase() + contentType.slice(1)}
          </Badge>
        </div>
        
        {/* Block content */}
        <div className="mt-3 text-white">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/6"></div>
            </div>
          ) : (
            <>
              {title && <h3 className="text-lg font-semibold mb-2">{title}</h3>}
              <div className="text-white/90 leading-relaxed">{content}</div>
            </>
          )}
        </div>
        
        {/* Related Questions */}
        {relatedQuestions.length > 0 && !isLoading && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-white/70">Related Questions</h4>
            <div className="flex flex-wrap gap-2">
              {relatedQuestions.slice(0, 3).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-white/5 text-white/80 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20 transition-colors"
                  onClick={() => handleRabbitHoleClick(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Interaction buttons */}
        {!isLoading && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {onReadAloud && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onReadAloud}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <VolumeUp className="h-4 w-4 mr-1.5" />
                Read
              </Button>
            )}
            
            {onBookmark && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBookmark}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Bookmark className="h-4 w-4 mr-1.5" />
                Save
              </Button>
            )}
            
            {onReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowReplies(!showReplies)}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" />
                Reply
              </Button>
            )}
            
            {onShare && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onShare}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </Button>
            )}
          </div>
        )}
        
        {/* Loading state interaction buttons */}
        {isLoading && (
          <div className="mt-4 flex items-center">
            <div className="flex items-center justify-center w-full">
              <Loader2 className="h-5 w-5 animate-spin text-white/50 mr-2" />
              <span className="text-sm text-white/50">Generating content...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Replies section */}
      {showReplies && onReply && (
        <BlockReplies 
          onReply={onReply} 
          childAge={childAge} 
        />
      )}
    </Card>
  );
};

export default SpecialistContentBlock;
