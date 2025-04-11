
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Share2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface IllustratedContentBlockProps {
  topic: string;
  childId?: string;
  onLike: () => void;
  onSave: () => void;
  onShare: () => void;
  onReply: (reply: string) => void;
}

const IllustratedContentBlock: React.FC<IllustratedContentBlockProps> = ({
  topic,
  childId,
  onLike,
  onSave,
  onShare,
  onReply
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [reply, setReply] = useState('');
  
  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (reply.trim()) {
      onReply(reply);
      setReply('');
      setShowReplyForm(false);
    }
  };
  
  const imagePlaceholder = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(topic.split(' ')[0])}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="overflow-hidden bg-white/5 border-white/10">
        <div className="aspect-video bg-gradient-to-b from-wonderwhiz-bright-pink/20 to-wonderwhiz-deep-purple relative flex items-center justify-center">
          <img 
            src={imagePlaceholder} 
            alt={topic} 
            className="w-full h-full object-cover absolute inset-0 mix-blend-overlay opacity-60" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-wonderwhiz-deep-purple via-transparent to-transparent"></div>
          <h2 className="text-white text-2xl font-semibold text-center px-4 relative z-10 drop-shadow-lg">
            {topic}
          </h2>
        </div>
        
        <div className="p-4">
          <p className="text-white/80 text-sm mb-4">
            This is an illustrated overview of our learning journey on {topic}. As we explore this topic together, we'll discover fascinating facts, test our knowledge, and engage in creative activities.
          </p>
          
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLike}
                className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Heart className="h-4 w-4 mr-1.5" />
                Like
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onSave}
                className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Bookmark className="h-4 w-4 mr-1.5" />
                Save
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowReplyForm(!showReplyForm)}
                className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <MessageSquare className="h-4 w-4 mr-1.5" />
                Comment
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onShare}
                className="bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
              >
                <Share2 className="h-4 w-4 mr-1.5" />
                Share
              </Button>
            </div>
          </div>
          
          {showReplyForm && (
            <motion.form 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
              onSubmit={handleSubmitReply}
            >
              <Textarea
                placeholder="Share your thoughts..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                className="bg-white/10 border-white/10 text-white placeholder:text-white/50 resize-none"
                rows={2}
              />
              <div className="flex justify-end mt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowReplyForm(false)}
                  className="text-white/70 hover:text-white mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm" 
                  className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white"
                >
                  Send
                </Button>
              </div>
            </motion.form>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default IllustratedContentBlock;
