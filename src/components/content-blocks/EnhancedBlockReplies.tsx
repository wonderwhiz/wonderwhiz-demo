
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Send, ThumbsUp, ThumbsDown, Smile, Image as ImageIcon, 
  Link, Bold, Italic, Sparkles, X
} from 'lucide-react';
import { toast } from 'sonner';
import { getSpecialistInfo } from '@/utils/specialists';

interface BlockReply {
  id: string;
  block_id?: string;
  content: string;
  from_user: boolean;
  created_at: string;
  user_id?: string | null;
  specialist_id?: string;
  reactions?: { emoji: string; count: number }[];
  attachments?: { type: 'image' | 'link'; url: string }[];
}

interface EnhancedBlockRepliesProps {
  replies: BlockReply[];
  specialistId: string;
  onSendReply?: (message: string, attachments?: any[]) => void;
  onReact?: (replyId: string, reaction: string) => void;
  onAttach?: (replyId: string, attachment: any) => void;
  childAge?: number;
}

const EnhancedBlockReplies: React.FC<EnhancedBlockRepliesProps> = ({ 
  replies, 
  specialistId, 
  onSendReply,
  onReact,
  onAttach,
  childAge = 10
}) => {
  const [replyText, setReplyText] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);
  const [attachments, setAttachments] = useState<{type: 'image' | 'link', url: string}[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  
  const specialist = getSpecialistInfo(specialistId);
  
  const handleSubmitReply = () => {
    if (replyText.trim() && onSendReply) {
      onSendReply(replyText, attachments);
      setReplyText('');
      setAttachments([]);
    }
  };
  
  const handleBoldClick = () => {
    setReplyText(prev => prev + '**bold text**');
  };
  
  const handleItalicClick = () => {
    setReplyText(prev => prev + '_italic text_');
  };
  
  const handleAddImage = () => {
    toast.info("This feature is coming soon!");
    // When implemented:
    // setAttachments(prev => [...prev, {type: 'image', url: 'image-url'}]);
  };
  
  const handleAddLink = () => {
    const url = prompt('Enter the URL:');
    if (url) {
      setReplyText(prev => prev + ` [link](${url})`);
    }
  };
  
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleReaction = (replyId: string, emoji: string) => {
    if (onReact) {
      onReact(replyId, emoji);
    }
  };
  
  // Quick emoji palette
  const emojis = ['👍', '👎', '😊', '🔥', '🙌', '💯', '🤔', '❤️'];
  
  const getFormattedContent = (content: string) => {
    // Simple markdown-like formatting
    let formatted = content;
    
    // Bold
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    formatted = formatted.replace(/_(.*?)_/g, '<em>$1</em>');
    
    // Links
    formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-wonderwhiz-cyan underline">$1</a>');
    
    return formatted;
  };
  
  return (
    <motion.div 
      className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-white/10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-2 sm:space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-wonderwhiz-purple/50 scrollbar-track-transparent">
        <AnimatePresence initial={false}>
          {replies.map((reply, index) => {
            const replySpecialist = reply.from_user ? null : getSpecialistInfo(reply.specialist_id || specialistId);
            
            return (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0, x: reply.from_user ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-start gap-2"
              >
                <Avatar className="h-7 w-7 border border-white/10 mt-1">
                  {reply.from_user ? (
                    <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
                  ) : (
                    <>
                      <AvatarImage src={replySpecialist?.avatar} alt={replySpecialist?.name} />
                      <AvatarFallback className={replySpecialist?.fallbackColor || 'bg-purple-600'}>
                        {replySpecialist?.fallbackInitial || 'S'}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
                
                <div className="flex-1">
                  <div className="group bg-white/5 rounded-lg p-2 text-sm text-white/90">
                    <p className="text-xs font-medium mb-1">
                      {reply.from_user ? 'You' : replySpecialist?.name}
                    </p>
                    <div 
                      className="prose prose-sm prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: getFormattedContent(reply.content) }}
                    />
                    
                    {/* Attachments */}
                    {reply.attachments && reply.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {reply.attachments.map((attachment, i) => (
                          <div key={i} className="rounded overflow-hidden border border-white/10">
                            {attachment.type === 'image' && (
                              <img 
                                src={attachment.url} 
                                alt="Attachment" 
                                className="max-h-40 w-auto object-contain cursor-pointer"
                                onClick={() => window.open(attachment.url, '_blank')}
                              />
                            )}
                            {attachment.type === 'link' && (
                              <a 
                                href={attachment.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center p-2 bg-white/5 text-wonderwhiz-cyan hover:underline"
                              >
                                <Link className="h-3 w-3 mr-1" />
                                <span className="text-xs truncate">{attachment.url}</span>
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reactions */}
                    {reply.reactions && reply.reactions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {reply.reactions.map((reaction, i) => (
                          <div 
                            key={i} 
                            className="flex items-center bg-white/5 rounded-full px-2 py-0.5 text-xs"
                          >
                            <span>{reaction.emoji}</span>
                            <span className="ml-1 text-white/60">{reaction.count}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Reaction buttons (only visible on hover for older children) */}
                    <div className={`mt-2 flex gap-1 ${childAge > 8 ? 'opacity-0 group-hover:opacity-100' : ''} transition-opacity`}>
                      {emojis.slice(0, childAge <= 8 ? 4 : emojis.length).map((emoji, i) => (
                        <button
                          key={i}
                          className="text-xs hover:bg-white/10 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
                          onClick={() => handleReaction(reply.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {new Date(reply.created_at).toLocaleDateString()} • {new Date(reply.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {/* Reply input form */}
      {onSendReply && (
        <div className="mt-3">
          <Avatar className="h-7 w-7 border border-white/10 hidden md:block float-left mr-2 mt-1">
            <AvatarFallback className="bg-indigo-500">U</AvatarFallback>
          </Avatar>
          
          <div className="md:ml-9">
            {/* Formatting toolbar */}
            {showFormatting && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-1 mb-2 bg-white/5 rounded-md p-1"
              >
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-white/70"
                  onClick={handleBoldClick}
                >
                  <Bold className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-white/70"
                  onClick={handleItalicClick}
                >
                  <Italic className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-white/70"
                  onClick={handleAddLink}
                >
                  <Link className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-white/70"
                  onClick={handleAddImage}
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </Button>
                {/* Emoji button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 rounded-md text-white/70"
                  onClick={() => setShowEmojis(!showEmojis)}
                >
                  <Smile className="h-3.5 w-3.5" />
                </Button>
              </motion.div>
            )}
            
            {/* Emoji picker */}
            <AnimatePresence>
              {showEmojis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute z-10 mb-2 bg-wonderwhiz-deep-purple/90 backdrop-blur-md border border-wonderwhiz-purple/30 rounded-lg p-2 shadow-lg"
                >
                  <div className="flex flex-wrap gap-1 max-w-[180px]">
                    {['😊', '😂', '🙌', '👍', '❤️', '🔥', '🎉', '🤔', '👏', '✨', '💡', '🌟', '👀', '🙏', '💯', '🤩'].map(emoji => (
                      <button
                        key={emoji}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-md text-lg"
                        onClick={() => {
                          setReplyText(prev => prev + emoji);
                          setShowEmojis(false);
                        }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Attachments preview */}
            {attachments.length > 0 && (
              <div className="flex gap-2 mb-2 flex-wrap">
                {attachments.map((attachment, index) => (
                  <div key={index} className="relative bg-white/5 rounded-md p-1 pr-6">
                    <div className="text-xs text-white/80 flex items-center">
                      {attachment.type === 'image' && <ImageIcon className="h-3 w-3 mr-1" />}
                      {attachment.type === 'link' && <Link className="h-3 w-3 mr-1" />}
                      <span className="truncate max-w-[100px]">
                        {attachment.type === 'image' ? 'Image' : 'Link'}
                      </span>
                    </div>
                    <button
                      className="absolute top-1 right-1 hover:bg-white/10 rounded-sm"
                      onClick={() => handleRemoveAttachment(index)}
                    >
                      <X className="h-3 w-3 text-white/60" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex items-center bg-white/5 rounded-full border border-white/10 pr-1">
              <Input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Chat with ${specialist.name}...`}
                className="border-0 bg-transparent focus-visible:ring-0 text-white placeholder:text-white/40 flex-1 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitReply();
                  }
                }}
              />
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                onClick={() => setShowFormatting(!showFormatting)}
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-indigo-500/30"
                onClick={handleSubmitReply}
                disabled={!replyText.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {childAge <= 8 && (
              <p className="text-xs text-white/40 mt-1 ml-2">
                Let {specialist.name} know what you think!
              </p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default EnhancedBlockReplies;
