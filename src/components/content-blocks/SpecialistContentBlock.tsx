
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getSpecialistInfo } from '@/utils/specialists';
import BlockActions from './BlockActions';
import BlockReplies from './BlockReplies';
import { toast } from 'sonner';
import EnhancedBlockReplies from './EnhancedBlockReplies';
import { Star } from 'lucide-react';

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
  
  const getDifficultyStars = () => {
    if (!difficultyLevel) return null;
    
    const stars = [];
    for (let i = 0; i < difficultyLevel; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-current" />
      );
    }
    return stars;
  };
  
  const { gradient, borderColor, badgeBg, badgeText } = getSpecialistStyles();
  
  const handleSendReply = (message: string) => {
    if (onReply) {
      onReply(message);
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
      className={`mb-8 rounded-xl overflow-hidden backdrop-blur-sm bg-gradient-to-b ${gradient} border ${borderColor} shadow-xl`}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="p-5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <img 
              src={specialist.avatar} 
              alt={specialist.name} 
              className="w-10 h-10 rounded-full border border-white/20"
            />
            <div>
              <h3 className={`text-white font-medium ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
                {specialist.name}
              </h3>
              <p className="text-white/60 text-xs">
                {specialist.title}
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
        
        {title && (
          <h4 className={`text-white font-medium mb-3 ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
            {title}
          </h4>
        )}
        
        <div className={`text-white/90 ${childAge <= 8 ? 'text-base' : 'text-sm'}`}>
          {content}
        </div>
        
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
        
        <div className="mt-4 pt-3 border-t border-white/10">
          <BlockActions
            onBookmark={onBookmark}
            onReply={() => setShowReplyForm(!showReplyForm)}
            onShare={onShare}
            onReadAloud={onReadAloud}
            childAge={childAge}
          />
        </div>
        
        {showReplyForm && (
          <EnhancedBlockReplies
            replies={replies}
            specialistId={specialistId}
            onSendReply={handleSendReply}
            childAge={childAge}
          />
        )}
      </div>
    </motion.div>
  );
};

export default SpecialistContentBlock;
