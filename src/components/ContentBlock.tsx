
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Thumbs } from '@/utilities/Icons';
import { BookmarkIcon, ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import SpecialistAvatar from './SpecialistAvatar';
import FlashcardBlock from './content-blocks/FlashcardBlock';
import CreativeBlock from './content-blocks/CreativeBlock';
import TaskBlock from './content-blocks/TaskBlock';
import RiddleBlock from './content-blocks/RiddleBlock';
import NewsBlock from './content-blocks/NewsBlock';
import ActivityBlock from './content-blocks/ActivityBlock';
import MindfulnessBlock from './content-blocks/MindfulnessBlock';
import QuizBlock from './QuizBlock';

interface ContentBlockProps {
  block: any;
  onLike?: () => void;
  onBookmark?: () => void;
  onReply?: (message: string) => void;
  onCreativeUpload?: () => void;
  onTaskComplete?: () => void;
  onActivityComplete?: () => void;
  onMindfulnessComplete?: () => void;
  onNewsRead?: () => void;
  onQuizCorrect?: () => void;
  onRabbitHoleClick?: (question: string) => void;
  profileId?: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  block,
  onLike,
  onBookmark,
  onReply,
  onCreativeUpload,
  onTaskComplete,
  onActivityComplete,
  onMindfulnessComplete,
  onNewsRead,
  onQuizCorrect,
  onRabbitHoleClick,
  profileId
}) => {
  const [height, setHeight] = useState<number | null>(null);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reply, setReply] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [creativeUploadFeedback, setCreativeUploadFeedback] = useState<string | null>(null);
  
  const updateHeight = (newHeight: number) => {
    if (height !== newHeight) {
      setHeight(newHeight);
    }
  };
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim() && onReply) {
      onReply(reply);
      setReply('');
      setShowReplyForm(false);
      toast.success("Reply sent!");
      setShowFeedback(true);
      
      setTimeout(() => {
        setShowFeedback(false);
      }, 3000);
    }
  };
  
  const handleCreativeUpload = () => {
    if (onCreativeUpload) {
      onCreativeUpload();
      setCreativeUploadFeedback("Your artwork is amazing! I love the colors and creativity you've shown. You're a wonderful artist!");
    }
  };
  
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 p-4 sm:p-5 shadow-sm"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex mb-3">
        <SpecialistAvatar specialistId={block.specialist_id} />
        <div className="ml-3">
          <h3 className="text-white font-medium">{getSpecialistName(block.specialist_id)}</h3>
          <p className="text-white/60 text-xs">{getSpecialistTitle(block.specialist_id)}</p>
        </div>
      </div>
      
      <div className="mb-4">
        {block.type === 'fact' && (
          <p className="text-white text-sm sm:text-base">{block.content.fact}</p>
        )}
        
        {block.type === 'funFact' && (
          <div className="p-4 bg-gradient-to-br from-wonderwhiz-bright-pink/20 to-wonderwhiz-blue-accent/20 rounded-lg">
            <p className="text-white text-sm sm:text-base">{block.content.text}</p>
          </div>
        )}
        
        {block.type === 'quiz' && (
          <QuizBlock
            question={block.content.question}
            options={block.content.options}
            correctIndex={block.content.correctIndex}
            onCorrect={onQuizCorrect}
            specialistId={block.specialist_id}
          />
        )}
        
        {block.type === 'flashcard' && (
          <FlashcardBlock
            content={block.content}
            specialistId={block.specialist_id}
            updateHeight={updateHeight}
          />
        )}
        
        {block.type === 'creative' && (
          <CreativeBlock
            content={block.content}
            specialistId={block.specialist_id}
            onCreativeUpload={handleCreativeUpload}
            uploadFeedback={creativeUploadFeedback}
            updateHeight={updateHeight}
            curioId={block.curio_id}
          />
        )}
        
        {block.type === 'task' && (
          <TaskBlock
            content={block.content}
            specialistId={block.specialist_id}
            onTaskComplete={onTaskComplete}
            updateHeight={updateHeight}
          />
        )}
        
        {block.type === 'riddle' && (
          <RiddleBlock
            content={block.content}
            specialistId={block.specialist_id}
            updateHeight={updateHeight}
          />
        )}
        
        {block.type === 'news' && (
          <NewsBlock
            content={block.content}
            specialistId={block.specialist_id}
            onNewsRead={onNewsRead}
            updateHeight={updateHeight}
          />
        )}
        
        {block.type === 'activity' && (
          <ActivityBlock
            content={block.content}
            specialistId={block.specialist_id}
            onActivityComplete={onActivityComplete}
            updateHeight={updateHeight}
          />
        )}
        
        {block.type === 'mindfulness' && (
          <MindfulnessBlock
            content={block.content}
            specialistId={block.specialist_id}
            onMindfulnessComplete={onMindfulnessComplete}
            updateHeight={updateHeight}
          />
        )}
      </div>
      
      {/* Block interactions: like, bookmark, reply */}
      <div className="flex flex-wrap gap-3 mt-3">
        <button 
          onClick={onLike}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs ${
            block.liked 
              ? 'bg-wonderwhiz-purple text-white' 
              : 'bg-white/5 hover:bg-white/10 text-white'
          }`}
        >
          <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
          {block.liked ? 'Liked' : 'Like'}
        </button>
        
        <button 
          onClick={onBookmark}
          className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs ${
            block.bookmarked 
              ? 'bg-wonderwhiz-gold text-black' 
              : 'bg-white/5 hover:bg-white/10 text-white'
          }`}
        >
          <BookmarkIcon className="mr-1.5 h-3.5 w-3.5" />
          {block.bookmarked ? 'Saved' : 'Save'}
        </button>
        
        {onReply && (
          <button 
            onClick={() => setShowReplyForm(prev => !prev)}
            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white"
          >
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Reply
          </button>
        )}
        
        <button 
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Check out what I learned!',
                text: getShareText(block),
              }).catch((error) => console.log('Error sharing', error));
            } else {
              // Fallback
              navigator.clipboard.writeText(getShareText(block))
                .then(() => toast.success("Content copied to clipboard!"))
                .catch(err => console.error('Could not copy text: ', err));
            }
          }}
          className="inline-flex items-center rounded-full px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white ml-auto"
        >
          <Share2 className="mr-1.5 h-3.5 w-3.5" />
          Share
        </button>
      </div>
      
      {/* Reply form */}
      {showReplyForm && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <form onSubmit={handleSubmitReply} className="space-y-3">
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reply.trim()}
                className="px-3 py-1.5 text-xs bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Reply feedback */}
      {showFeedback && (
        <motion.div 
          className="mt-4 p-3 bg-white/5 rounded-lg border border-wonderwhiz-purple/30"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <p className="text-white text-sm">
            Thank you for sharing your thoughts! Your perspective helps make learning more engaging.
          </p>
        </motion.div>
      )}
      
      {/* Related questions for rabbit hole journeys */}
      {block.content?.rabbitHoles && block.content.rabbitHoles.length > 0 && onRabbitHoleClick && (
        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-white/70 text-xs mb-2">Related questions to explore:</p>
          <div className="flex flex-wrap gap-2">
            {block.content.rabbitHoles.map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => onRabbitHoleClick(question)}
                className="text-xs px-3 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Helper functions
const getSpecialistName = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova': return 'Nova';
    case 'spark': return 'Spark';
    case 'prism': return 'Prism';
    case 'pixel': return 'Pixel';
    case 'atlas': return 'Atlas';
    case 'lotus': return 'Lotus';
    default: return 'Specialist';
  }
};

const getSpecialistTitle = (specialistId: string): string => {
  switch (specialistId) {
    case 'nova': return 'Space Explorer';
    case 'spark': return 'Creative Expert';
    case 'prism': return 'Science Specialist';
    case 'pixel': return 'Tech Wizard';
    case 'atlas': return 'History Guide';
    case 'lotus': return 'Nature Scholar';
    default: return 'Knowledge Specialist';
  }
};

const getShareText = (block: any): string => {
  let text = `I learned something cool with WonderWhiz! `;
  
  switch (block.type) {
    case 'fact':
      text += block.content.fact;
      break;
    case 'funFact':
      text += block.content.text;
      break;
    case 'quiz':
      text += `Quiz: ${block.content.question}`;
      break;
    case 'flashcard':
      text += `Did you know: ${block.content.front} ${block.content.back}`;
      break;
    default:
      text += `Check out this ${block.type} content I discovered!`;
  }
  
  return text;
};

export default ContentBlock;
