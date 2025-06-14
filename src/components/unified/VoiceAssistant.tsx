
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface VoiceAssistantProps {
  onVoiceQuery: (query: string) => void;
  isEnabled?: boolean;
  childAge: number;
}

const VoiceAssistant: React.FC<VoiceAssistantProps> = ({
  onVoiceQuery,
  isEnabled = true,
  childAge
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          onVoiceQuery(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onVoiceQuery]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Adjust voice settings based on child's age
      if (childAge <= 7) {
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
      } else if (childAge <= 11) {
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
      } else {
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isSupported || !isEnabled) {
    return null;
  }

  const getEncouragingMessage = () => {
    if (childAge <= 7) {
      return "Try saying 'Hey WonderWhiz, tell me about dinosaurs!' 🦕";
    } else if (childAge <= 11) {
      return "Say 'Hey WonderWhiz' and ask me anything! 🚀";
    } else {
      return "Voice commands ready - just say 'Hey WonderWhiz'! 🎤";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-20 right-0 mb-2"
          >
            <Card className="bg-white/95 backdrop-blur-sm p-4 max-w-xs">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-4 h-4 bg-red-500 rounded-full"
                  />
                </div>
                <p className="text-sm text-wonderwhiz-purple font-medium">
                  {transcript || "I'm listening..."}
                </p>
                <p className="text-xs text-wonderwhiz-purple/60 mt-1">
                  {getEncouragingMessage()}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-2">
        {/* Voice Input Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={isListening ? stopListening : startListening}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80'
            }`}
          >
            {isListening ? (
              <MicOff className="h-6 w-6 text-white" />
            ) : (
              <Mic className="h-6 w-6 text-white" />
            )}
          </Button>
        </motion.div>

        {/* Text-to-Speech Button */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            onClick={isSpeaking ? stopSpeaking : () => speak("Hello! I'm WonderWhiz, your learning companion. What would you like to explore today?")}
            className={`w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
              isSpeaking
                ? 'bg-blue-500 hover:bg-blue-600 animate-pulse'
                : 'bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80'
            }`}
          >
            {isSpeaking ? (
              <VolumeX className="h-6 w-6 text-white" />
            ) : (
              <Volume2 className="h-6 w-6 text-white" />
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default VoiceAssistant;
