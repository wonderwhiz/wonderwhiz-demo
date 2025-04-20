
import React, { useState, useEffect, useRef } from 'react';
import { Mic, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface VoiceInputButtonProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onTranscript: (transcript: string) => void;
  childAge?: number;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  isActive,
  onToggle,
  onTranscript,
  childAge = 10
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Age-appropriate messages
  const getPromptMessage = () => {
    if (childAge < 8) {
      return "What are you curious about?";
    } else if (childAge < 13) {
      return "Ask me anything you're wondering about!";
    } else {
      return "Ask your question and I'll find the answer.";
    }
  };

  useEffect(() => {
    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        if (event.error === 'no-speech') {
          toast.info(childAge < 8 
            ? "I didn't hear anything. Try again!" 
            : "No speech detected. Please try again.");
        }
        stopListening();
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
        if (transcript) {
          onTranscript(transcript);
          setTranscript('');
        }
      };
    } else {
      toast.error("Your browser doesn't support voice input.");
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [transcript, onTranscript, childAge]);

  useEffect(() => {
    if (isActive && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive, isListening]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.info(childAge < 8 
          ? "I'm listening! Tell me what you want to learn!" 
          : "Listening... Speak your question clearly.");
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
    setIsListening(false);
    onToggle(false);
  };

  const toggleListening = () => {
    onToggle(!isActive);
  };

  return (
    <div className="fixed right-6 bottom-6 z-30">
      <AnimatePresence>
        {isListening && transcript && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            className="absolute bottom-16 right-0 mb-4 bg-wonderwhiz-deep-purple border border-white/20 rounded-lg p-3 shadow-lg w-64"
          >
            <div className="text-xs text-white/60 mb-1">I heard:</div>
            <div className="text-sm text-white break-words">{transcript}</div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -left-16 -translate-x-full bottom-2"
          >
            <div className="bg-wonderwhiz-deep-purple text-white text-sm py-2 px-4 rounded-full border border-white/20">
              {getPromptMessage()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`rounded-full ${
          isListening 
            ? 'bg-wonderwhiz-bright-pink text-white' 
            : 'bg-wonderwhiz-deep-purple border-2 border-wonderwhiz-bright-pink text-white'
        } w-14 h-14 flex items-center justify-center shadow-lg`}
        onClick={toggleListening}
      >
        {isListening ? (
          <div className="relative">
            <X className="h-6 w-6" />
            <motion.div
              className="absolute -inset-4 rounded-full border-2 border-white/40"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          </div>
        ) : (
          <Mic className="h-6 w-6" />
        )}
      </motion.button>
    </div>
  );
};

export default VoiceInputButton;
