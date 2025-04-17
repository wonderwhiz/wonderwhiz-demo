
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Volume2, VolumeX, ChevronDown, ChevronUp, Sparkles, Send, PhoneCall } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceIndicator } from './VoiceIndicator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useIsMobile } from '@/hooks/use-mobile';

interface WhizzyMessage {
  role: 'user' | 'model';
  content: string;
}

interface WhizzyChatProps {
  messages: WhizzyMessage[];
  onSend: (message: string) => void;
  isListening: boolean;
  isProcessing: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onToggleVoice: () => void;
  transcript?: string;
  childAge?: number;
  onClose?: () => void; // Added this prop to fix the type error
}

const WhizzyChat: React.FC<WhizzyChatProps> = ({
  messages,
  onSend,
  isListening,
  isProcessing,
  isMuted,
  onToggleMute,
  onToggleVoice,
  transcript,
  childAge = 10,
  onClose // Added to the destructuring
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const isMobile = useIsMobile();

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple shadow-lg shadow-purple-500/30 p-0 flex items-center justify-center"
        >
          <PhoneCall className="h-5 w-5 text-white" />
          <span className="sr-only">Talk to Whizzy</span>
          
          <motion.div 
            className="absolute -top-1 -right-1 bg-wonderwhiz-vibrant-yellow rounded-full p-0.5"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Sparkles className="h-2 w-2 text-wonderwhiz-deep-purple" />
          </motion.div>
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={`fixed z-50 ${isMobile ? 'bottom-0 left-0 right-0' : 'bottom-0 right-0 w-full md:w-96'} bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple shadow-2xl rounded-t-xl overflow-hidden border-t border-white/20`}>
      <div 
        className="px-4 py-3 flex items-center justify-between cursor-pointer bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-md"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple p-2 rounded-full shadow-glow-brand-pink">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <motion.div 
              className="absolute -top-1 -right-1 bg-wonderwhiz-vibrant-yellow rounded-full p-0.5"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Sparkles className="h-2 w-2 text-wonderwhiz-deep-purple" />
            </motion.div>
          </div>
          <span className="text-white font-medium font-nunito">Talk to Whizzy</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className={`h-8 w-8 rounded-full ${isMuted ? 'text-red-500' : 'text-white/70'}`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onClose ? onClose() : setIsOpen(false)} // Use onClose if provided, otherwise use local state
            className="h-8 w-8 rounded-full text-white/70"
          >
            <ChevronDown className="h-4 w-4 text-white/70" />
          </Button>
        </div>
      </div>

      <motion.div 
        className="h-[300px] px-4 py-3 overflow-y-auto scrollbar-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="inline-block bg-wonderwhiz-bright-pink/20 p-3 rounded-full mb-3">
                <Sparkles className="h-6 w-6 text-wonderwhiz-bright-pink" />
              </div>
              <p className="text-white/80 text-sm">
                {childAge < 10 
                  ? "Hi there! I'm Whizzy. What would you like to explore today?" 
                  : "Ask me anything about your curiosities and I'll help you explore!"}
              </p>
            </motion.div>
          )}
          
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start mb-3 ${message.role === 'model' ? '' : 'justify-end'}`}
            >
              {message.role === 'model' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple flex items-center justify-center mr-2 shadow-glow-brand-pink">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
              )}
              <div className={`rounded-lg p-3 text-white max-w-[80%] ${
                message.role === 'model' 
                  ? 'bg-white/10 backdrop-blur-sm' 
                  : 'bg-gradient-to-r from-wonderwhiz-bright-pink/30 to-wonderwhiz-purple/30 backdrop-blur-sm'
              }`}>
                {message.content}
              </div>
            </motion.div>
          ))}

          {transcript && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start justify-end mb-3"
            >
              <div className="rounded-lg p-3 text-white/80 max-w-[80%] bg-wonderwhiz-bright-pink/20 border border-wonderwhiz-bright-pink/30 backdrop-blur-sm">
                {transcript}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="p-3 bg-black/20 backdrop-blur-md border-t border-white/10">
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Type a message..."}
              disabled={isListening}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-full focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50 text-white placeholder:text-white/50"
            />
            <Button
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:opacity-90 disabled:opacity-50"
              disabled={!input.trim() || isProcessing}
              onClick={handleSend}
            >
              <Send className="h-3.5 w-3.5 text-white" />
            </Button>
          </div>
          <Button
            onClick={onToggleVoice}
            disabled={isProcessing}
            className={`h-10 w-10 rounded-full ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple'
            }`}
          >
            <div className="flex items-center justify-center">
              {isListening ? (
                <VoiceIndicator isActive={true} />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22"></line>
                </svg>
              )}
            </div>
          </Button>
        </div>
        
        <div className="flex justify-center">
          <motion.div
            className="text-xs text-white/50 flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Sparkles className="h-3 w-3 mr-1 text-wonderwhiz-vibrant-yellow" />
            {childAge < 10 
              ? "Ask me anything about our wonderful world!" 
              : "Voice commands available - try asking a question"}
          </motion.div>
        </div>
      </div>

      {isProcessing && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full text-white text-xs flex items-center space-x-2">
          <div className="h-2 w-2 bg-wonderwhiz-bright-pink rounded-full animate-ping" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default WhizzyChat;
