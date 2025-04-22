
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Bookmark, Share2, VolumeIcon } from 'lucide-react';
import { toast } from 'sonner';
import FireflyQuizBlock from './FireflyQuizBlock';
import MindfulnessBlock from './MindfulnessBlock';
import CreativeBlock from './CreativeBlock';
import EnhancedSearchBar from './EnhancedSearchBar';

interface EnhancedCurioContentProps {
  title: string;
  blocks: any[];
  onSearch: (query: string) => void;
  onVoiceCapture?: (transcript: string) => void;
  onImageCapture?: (file: File) => void;
  onLike?: (blockId: string) => void;
  onBookmark?: (blockId: string) => void;
  onReply?: (blockId: string, message: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  onExplore?: () => void;
  onRabbitHoleClick?: (question: string) => void;
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

const SpecialistBlock: React.FC<{
  specialistId: string;
  content: string;
  followupQuestions?: string[];
  blockId: string;
  onRabbitHoleClick?: (question: string) => void;
  onLike?: (blockId: string) => void;
  onBookmark?: (blockId: string) => void;
  onReply?: (blockId: string, message: string) => void;
  onReadAloud?: (text: string, specialistId: string) => void;
  childAge?: number;
}> = ({ 
  specialistId, 
  content, 
  followupQuestions = [],
  blockId,
  onRabbitHoleClick,
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  childAge = 10
}) => {
  const specialist = getSpecialistInfo(specialistId);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const handleReply = () => {
    if (replyText.trim() && onReply) {
      onReply(blockId, replyText);
      setReplyText('');
      setShowReplyInput(false);
      toast.success("Reply sent!");
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 bg-wonderwhiz-purple rounded-xl overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={specialist.avatar} alt={specialist.name} />
            <AvatarFallback className={specialist.fallbackColor}>{specialist.fallbackInitial}</AvatarFallback>
          </Avatar>
          
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-white">{specialist.name}</h3>
              {specialistId === 'nova' && (
                <div className="ml-2 h-2 w-2 rounded-full bg-blue-400"></div>
              )}
              {specialistId === 'spark' && (
                <div className="ml-2 h-2 w-2 rounded-full bg-yellow-400"></div>
              )}
            </div>
            <p className="text-sm text-white/60">{specialist.title}</p>
          </div>
        </div>
        
        <div className="text-white mb-5 whitespace-pre-line">
          {content}
          
          {followupQuestions.length > 0 && (
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="text-white/60 text-sm mb-2">I wonder...</p>
              <div className="space-y-2">
                {followupQuestions.map((question, idx) => (
                  <div 
                    key={idx}
                    className="bg-white/10 hover:bg-white/15 rounded-lg px-4 py-3 cursor-pointer text-white/90"
                    onClick={() => onRabbitHoleClick && onRabbitHoleClick(question)}
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3 pt-2 border-t border-white/10">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onLike && onLike(blockId)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Heart className="h-4 w-4 mr-1" />
            Like
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onBookmark && onBookmark(blockId)}
            className="text-white/70 hover:text-white hover:bg-white/10"
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
              onClick={() => onReadAloud(content, specialistId)}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <VolumeIcon className="h-4 w-4 mr-1" />
              {childAge && childAge < 8 ? "Read to me" : "Read aloud"}
            </Button>
          )}
        </div>
        
        {showReplyInput && (
          <div className="mt-3 bg-white/5 p-3 rounded-lg">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write your reply..."
              className="w-full bg-white/10 border border-white/20 rounded-lg p-2 text-white placeholder-white/50 text-sm"
              rows={2}
            />
            
            <div className="flex justify-end mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2 border-white/20 text-white"
                onClick={() => setShowReplyInput(false)}
              >
                Cancel
              </Button>
              
              <Button 
                size="sm" 
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90"
                onClick={handleReply}
                disabled={!replyText.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const EnhancedCurioContent: React.FC<EnhancedCurioContentProps> = ({
  title,
  blocks,
  onSearch,
  onVoiceCapture,
  onImageCapture,
  onLike,
  onBookmark,
  onReply,
  onReadAloud,
  onExplore,
  onRabbitHoleClick,
  childAge = 10
}) => {
  // Use the actual blocks passed from props instead of hardcoded examples
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-indigo-950 to-purple-950">
      <div className="sticky top-0 z-40 bg-gradient-to-b from-indigo-950/95 to-indigo-950/90 backdrop-blur-sm py-4 px-4 border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">{title}</h1>
          <EnhancedSearchBar 
            onSearch={onSearch}
            onVoiceCapture={onVoiceCapture}
            onImageCapture={onImageCapture}
            onExplore={onExplore}
            childAge={childAge}
          />
        </div>
      </div>
      
      <main className="flex-grow py-6">
        <div className="max-w-3xl mx-auto px-4">
          {blocks.length > 0 ? (
            blocks.map((block) => {
              if (block.type === 'quiz') {
                return (
                  <FireflyQuizBlock
                    key={block.id}
                    question={block.content.question}
                    options={block.content.options}
                    correctIndex={block.content.correctIndex}
                    explanation={block.content.explanation}
                    childAge={childAge}
                  />
                );
              } else if (block.type === 'mindfulness') {
                return (
                  <MindfulnessBlock
                    key={block.id}
                    title={block.content.title}
                    instructions={block.content.instruction}
                    duration={block.content.duration}
                    benefit={block.content.benefit}
                    childAge={childAge}
                  />
                );
              } else if (block.type === 'creative') {
                return (
                  <CreativeBlock
                    key={block.id}
                    prompt={block.content.prompt}
                    examples={block.content.examples}
                    specialistId={block.specialist_id}
                    childAge={childAge}
                  />
                );
              } else {
                // For fact, funFact, and other text-based blocks
                const content = block.content?.fact || block.content?.text || '';
                const followupQuestions = block.content?.rabbitHoles || [];
                
                return (
                  <SpecialistBlock
                    key={block.id}
                    blockId={block.id}
                    specialistId={block.specialist_id}
                    content={content}
                    followupQuestions={followupQuestions}
                    onRabbitHoleClick={onRabbitHoleClick}
                    onLike={onLike}
                    onBookmark={onBookmark}
                    onReply={onReply}
                    onReadAloud={onReadAloud}
                    childAge={childAge}
                  />
                );
              }
            })
          ) : (
            <div className="text-center py-16">
              <p className="text-white/60">No content blocks available for this curio.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EnhancedCurioContent;
