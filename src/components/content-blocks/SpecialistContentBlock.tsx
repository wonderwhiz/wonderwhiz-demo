
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSpecialistInfo } from '@/utils/specialists';
import BlockReplies from '@/components/content-blocks/BlockReplies';
import { toast } from 'sonner';

interface SpecialistContentBlockProps {
  specialistId: string;
  title: string;
  content: React.ReactNode;
  contentType?: string;
  difficultyLevel?: 1 | 2 | 3;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onShare?: () => void;
  onReadAloud?: () => void;
  childAge?: number;
  relatedQuestions?: string[];
  onRabbitHoleClick?: (question: string) => void;
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
  onRabbitHoleClick
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replies, setReplies] = useState<any[]>([]);
  
  const specialist = getSpecialistInfo(specialistId);
  
  // Specialist-specific styling
  const getSpecialistStyles = () => {
    switch (specialistId) {
      case 'nova':
        return {
          gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
          borderColor: 'border-blue-600/20',
          badgeBg: 'bg-blue-600/20',
          badgeText: 'text-blue-300'
        };
      case 'spark':
        return {
          gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
          borderColor: 'border-amber-500/20',
          badgeBg: 'bg-amber-500/20',
          badgeText: 'text-amber-300'
        };
      case 'prism':
        return {
          gradient: 'from-purple-600/20 via-fuchsia-600/10 to-transparent',
          borderColor: 'border-purple-600/20',
          badgeBg: 'bg-purple-600/20',
          badgeText: 'text-purple-300'
        };
      case 'pixel':
        return {
          gradient: 'from-cyan-500/20 via-blue-500/10 to-transparent',
          borderColor: 'border-cyan-500/20',
          badgeBg: 'bg-cyan-500/20',
          badgeText: 'text-cyan-300'
        };
      case 'atlas':
        return {
          gradient: 'from-amber-700/20 via-yellow-600/10 to-transparent',
          borderColor: 'border-amber-700/20',
          badgeBg: 'bg-amber-700/20',
          badgeText: 'text-amber-300'
        };
      case 'lotus':
        return {
          gradient: 'from-emerald-500/20 via-green-500/10 to-transparent',
          borderColor: 'border-emerald-500/20',
          badgeBg: 'bg-emerald-500/20',
          badgeText: 'text-emerald-300'
        };
      default:
        return {
          gradient: 'from-wonderwhiz-deep-purple/20 via-wonderwhiz-light-purple/10 to-transparent',
          borderColor: 'border-wonderwhiz-deep-purple/20',
          badgeBg: 'bg-wonderwhiz-deep-purple/20',
          badgeText: 'text-wonderwhiz-light-purple'
        };
    }
  };
  
  const { gradient, borderColor, badgeBg, badgeText } = getSpecialistStyles();
  
  // Show difficulty based on level
  const getDifficultyStars = () => {
    return Array(difficultyLevel).fill(0).map((_, i) => (
      <Star key={i} className="h-3 w-3 fill-current" />
    ));
  };

  const handleSendReply = (message: string) => {
    if (onReply) {
      onReply(message);
      // Add optimistic update for the reply
      const newReply = {
        id: Date.now().toString(),
        content: message,
        from_user: true,
        created_at: new Date().toISOString()
      };
      setReplies([...replies, newReply]);
      toast.success('Reply sent!');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`mb-8 rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-b ${gradient} border ${borderColor}`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="p-5">
        {/* Specialist header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={specialist.avatarUrl} 
              alt={specialist.name} 
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h3 className={`text-white font-medium ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
                {specialist.name}
              </h3>
              <p className="text-white/60 text-xs">
                {specialist.role}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {contentType && (
              <Badge variant="outline" className={`${badgeBg} ${badgeText} border-none`}>
                {contentType}
              </Badge>
            )}
            
            {difficultyLevel > 0 && (
              <div className="flex items-center text-amber-400">
                {getDifficultyStars()}
              </div>
            )}
          </div>
        </div>
        
        {/* Content title */}
        {title && (
          <h4 className={`text-white font-medium mb-3 ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
            {title}
          </h4>
        )}
        
        {/* Main content */}
        <div className={`text-white/90 ${childAge <= 8 ? 'text-base' : 'text-sm'}`}>
          {content}
        </div>
        
        {/* Related questions */}
        {relatedQuestions && relatedQuestions.length > 0 && (
          <div className="mt-4 space-y-2">
            {relatedQuestions.map((question, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.01, x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onRabbitHoleClick?.(question)}
                className="w-full flex items-center text-left p-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-sm transition-all"
              >
                {question}
              </motion.button>
            ))}
          </div>
        )}
        
        {/* Block interactions */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 justify-end">
            {onReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="text-white/70 hover:text-blue-400 hover:bg-white/5"
              >
                <MessageCircle className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Reply</span>
              </Button>
            )}
            
            {onBookmark && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onBookmark}
                className="text-white/70 hover:text-yellow-400 hover:bg-white/5"
              >
                <Bookmark className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Save</span>
              </Button>
            )}
            
            {onShare && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onShare}
                className="text-white/70 hover:text-green-400 hover:bg-white/5"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                <span className="text-xs">Share</span>
              </Button>
            )}
            
            {onReadAloud && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReadAloud}
                className="text-white/70 hover:text-purple-400 hover:bg-white/5"
              >
                <span className="text-xs">Read Aloud</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Reply form */}
        {showReplyForm && (
          <BlockReplies
            replies={replies}
            specialistId={specialistId}
            onSendReply={handleSendReply}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SpecialistContentBlock;
