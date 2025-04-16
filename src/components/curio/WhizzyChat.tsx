
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Message2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceIndicator } from './VoiceIndicator';

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
  childAge = 10
}) => {
  return (
    <div className="fixed bottom-0 right-0 w-full md:w-96 bg-gradient-to-br from-indigo-950 to-indigo-900 shadow-xl rounded-t-xl overflow-hidden border-t border-white/10">
      <div className="px-4 py-3 bg-black/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple p-2 rounded-full">
            <Message2 className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-medium">Talk to Whizzy</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className={`h-8 w-8 rounded-full ${isMuted ? 'text-red-500' : 'text-white/70'}`}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="h-[300px] px-4 py-3 overflow-y-auto">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start mb-3 ${message.role === 'model' ? '' : 'justify-end'}`}
            >
              {message.role === 'model' && (
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-wonderwhiz-purple flex items-center justify-center mr-2">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
              )}
              <div className={`rounded-lg p-3 text-white max-w-[80%] ${
                message.role === 'model' 
                  ? 'bg-white/10' 
                  : 'bg-wonderwhiz-bright-pink/30'
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
              <div className="rounded-lg p-3 text-white/80 max-w-[80%] bg-wonderwhiz-bright-pink/20 border border-wonderwhiz-bright-pink/30">
                {transcript}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-3 bg-black/20 flex items-center gap-3">
        <Button
          onClick={onToggleVoice}
          disabled={isProcessing}
          className={`flex-1 h-12 rounded-full ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isListening ? (
              <>
                <VoiceIndicator isActive={true} />
                <span>{childAge < 10 ? "I'm listening..." : "Listening..."}</span>
              </>
            ) : (
              <span>{childAge < 10 ? "Talk to me!" : "Start speaking"}</span>
            )}
          </div>
        </Button>
      </div>

      {isProcessing && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-xs flex items-center space-x-2">
          <div className="h-2 w-2 bg-wonderwhiz-bright-pink rounded-full animate-ping" />
          <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default WhizzyChat;
