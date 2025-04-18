
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Mic, Image, 
  ChevronRight, Star, Heart, MessageSquarePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Message {
  id: string;
  sender: 'parent' | 'child';
  content: string;
  type: 'text' | 'voice' | 'image';
  timestamp: Date;
  starred?: boolean;
}

interface FamilyMessagingProps {
  childId: string;
  childName?: string;
  childAge?: number;
  parentName?: string;
  onSendMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onShareDiscovery?: (content: string) => void;
  initialMessages?: Message[];
}

const FamilyMessaging: React.FC<FamilyMessagingProps> = ({
  childId,
  childName = 'Explorer',
  childAge = 10,
  parentName = 'Parent',
  onSendMessage,
  onShareDiscovery,
  initialMessages = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [discoveryToShare, setDiscoveryToShare] = useState<string | null>(null);
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'child',
      content: newMessage,
      type: 'text',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
    
    if (onSendMessage) {
      onSendMessage({
        sender: 'child',
        content: newMessage,
        type: 'text'
      });
    }
    
    // Simulate parent response after a short delay
    setTimeout(() => {
      const responses = [
        "That's amazing! I'm so proud of you.",
        "Wow, you're learning so much!",
        "I can't wait to hear more about this when you get home.",
        "That's really interesting. Thanks for sharing!",
        "Great job exploring today!"
      ];
      
      const responseMessage: Message = {
        id: Date.now().toString(),
        sender: 'parent',
        content: responses[Math.floor(Math.random() * responses.length)],
        type: 'text',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
    }, 3000);
  };
  
  const handleRecordVoice = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording) {
      // Start recording simulation
      toast.info("Recording message...", {
        position: "bottom-center"
      });
      
      // Simulate ending recording after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        
        const message: Message = {
          id: Date.now().toString(),
          sender: 'child',
          content: "Voice message (tap to play)",
          type: 'voice',
          timestamp: new Date()
        };
        
        setMessages([...messages, message]);
        
        if (onSendMessage) {
          onSendMessage({
            sender: 'child',
            content: "Voice message",
            type: 'voice'
          });
        }
        
        toast.success("Voice message sent!", {
          position: "bottom-center"
        });
      }, 3000);
    } else {
      // Cancel recording
      toast.info("Recording canceled", {
        position: "bottom-center"
      });
    }
  };
  
  const handleShareDiscovery = () => {
    if (!discoveryToShare) return;
    
    const message: Message = {
      id: Date.now().toString(),
      sender: 'child',
      content: `I discovered: ${discoveryToShare}`,
      type: 'text',
      timestamp: new Date()
    };
    
    setMessages([...messages, message]);
    setDiscoveryToShare(null);
    
    if (onShareDiscovery) {
      onShareDiscovery(discoveryToShare);
    }
    
    toast.success("Your discovery has been shared with your family!", {
      icon: "🔍",
      position: "bottom-center"
    });
  };
  
  const handleStarMessage = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, starred: !message.starred } 
        : message
    ));
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      {/* Floating button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-24 right-4 z-40 rounded-full bg-wonderwhiz-bright-pink hover:bg-pink-600 text-white shadow-lg"
        onClick={handleToggle}
      >
        <MessageSquare className="h-5 w-5" />
      </Button>
      
      {/* Family messaging panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed bottom-0 inset-x-0 sm:right-0 sm:inset-x-auto sm:bottom-20 sm:mr-4 bg-gradient-to-br from-wonderwhiz-purple to-wonderwhiz-deep-purple p-4 rounded-t-2xl sm:rounded-2xl shadow-xl z-50 sm:max-w-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg">Family Chat</h3>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                onClick={handleToggle}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Message discovery share prompt */}
            <AnimatePresence>
              {discoveryToShare && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/10 rounded-lg p-3 mb-3"
                >
                  <div className="flex items-start">
                    <div className="bg-wonderwhiz-bright-pink/20 p-2 rounded-full mr-2">
                      <Star className="h-4 w-4 text-wonderwhiz-bright-pink" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">Share your discovery</h4>
                      <p className="text-white/80 text-sm mt-1">{discoveryToShare}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/10 mr-2"
                      onClick={() => setDiscoveryToShare(null)}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-wonderwhiz-bright-pink hover:bg-pink-600 text-white"
                      onClick={handleShareDiscovery}
                    >
                      Share
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Messages */}
            <div className="bg-white/5 rounded-lg p-3 h-64 overflow-y-auto mb-3 flex flex-col gap-2">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageSquarePlus className="h-12 w-12 text-white/20 mb-2" />
                  <p className="text-white/50 text-sm">No messages yet.</p>
                  <p className="text-white/50 text-sm">Share your discoveries with your family!</p>
                </div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'child' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl p-3 relative ${
                        message.sender === 'child' 
                          ? 'bg-wonderwhiz-bright-pink/30 rounded-br-none' 
                          : 'bg-white/10 rounded-bl-none'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white/70 text-xs">
                          {message.sender === 'child' ? childName : parentName}
                        </span>
                        <span className="text-white/50 text-[10px] ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      
                      {message.type === 'text' && (
                        <p className="text-white text-sm">{message.content}</p>
                      )}
                      
                      {message.type === 'voice' && (
                        <div className="bg-white/10 rounded-lg p-2 flex items-center">
                          <Mic className="h-4 w-4 text-white/70 mr-2" />
                          <span className="text-white/90 text-sm flex-1">
                            {message.content}
                          </span>
                          <div className="w-16 h-2 bg-white/20 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-white/60"
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {message.type === 'image' && (
                        <div className="bg-white/10 rounded-lg p-2">
                          <div className="h-20 bg-white/5 rounded flex items-center justify-center">
                            <Image className="h-8 w-8 text-white/30" />
                          </div>
                          <p className="text-white/90 text-xs mt-1 text-center">
                            {message.content}
                          </p>
                        </div>
                      )}
                      
                      {/* Interaction buttons */}
                      <div className="absolute -bottom-6 right-0 flex gap-1">
                        <button 
                          className="p-1 bg-white/10 rounded-full hover:bg-white/20"
                          onClick={() => handleStarMessage(message.id)}
                        >
                          <Heart 
                            className="h-3 w-3" 
                            fill={message.starred ? "#ff3b5c" : "none"} 
                            stroke={message.starred ? "#ff3b5c" : "white"} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {/* Message input */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white/10 rounded-full flex items-center pl-4 pr-2 py-1.5">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${parentName}...`}
                  className="bg-transparent border-none outline-none text-white placeholder-white/50 text-sm w-full"
                />
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                    onClick={handleRecordVoice}
                  >
                    <Mic className={`h-4 w-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                  </Button>
                </div>
              </div>
              <Button
                disabled={!newMessage.trim()}
                onClick={handleSendMessage}
                size="icon"
                className="bg-wonderwhiz-bright-pink hover:bg-pink-600 text-white rounded-full"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Child-appropriate tips */}
            {childAge < 8 && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white/80 hover:bg-white/5 text-xs w-full"
                  onClick={() => {
                    toast.info("Ask a parent to help you type a message!", {
                      position: "bottom-center"
                    });
                  }}
                >
                  <div className="flex items-center">
                    <span>Need help? Ask a grown-up</span>
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </div>
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FamilyMessaging;
