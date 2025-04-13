
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface VoiceInputButtonProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
  onTranscript: (transcript: string) => void;
}

const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({ 
  isActive, 
  onToggle,
  onTranscript 
}) => {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Setup Web Speech API
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
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
        if (event.error === 'not-allowed') {
          toast.error('Microphone access was denied. Please allow microphone access to use this feature.');
        }
        setIsListening(false);
        onToggle(false);
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
        } else {
          onToggle(false);
        }
      };
    } else {
      toast.error('Speech recognition is not supported in this browser.');
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening, onToggle]);

  useEffect(() => {
    if (isActive && !isListening) {
      startListening();
    } else if (!isActive && isListening) {
      stopListening();
    }
  }, [isActive]);

  const startListening = () => {
    setTranscript('');
    setIsListening(true);
    try {
      recognitionRef.current?.start();
      toast.info("I'm listening! What would you like to explore?", {
        position: 'bottom-center',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
    
    if (transcript) {
      onTranscript(transcript);
    }
  };

  const handleButtonClick = () => {
    if (isListening) {
      stopListening();
      onToggle(false);
    } else {
      onToggle(true);
    }
  };

  const handleCancel = () => {
    stopListening();
    setTranscript('');
    onToggle(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-24 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      >
        <Button
          onClick={handleButtonClick}
          className={`rounded-full p-0 w-14 h-14 shadow-lg ${
            isListening
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-purple-600 hover:to-pink-600'
          }`}
          aria-label={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Transcript Dialog */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-br from-indigo-950 to-purple-900 rounded-xl shadow-2xl p-6"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <button
                onClick={handleCancel}
                className="absolute top-3 right-3 text-white/70 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-purple-700/30 mb-4">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Mic className="h-8 w-8 text-purple-400" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-bold text-white">What would you like to explore?</h3>
                <p className="text-white/70 text-sm mt-1">
                  Speak clearly, I'm listening...
                </p>
              </div>
              
              <div className="bg-white/10 rounded-lg p-4 min-h-[100px] mb-4">
                <p className="text-white break-words">
                  {transcript || (
                    <span className="text-white/50 italic">Listening for your question...</span>
                  )}
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/20 text-white"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80"
                  onClick={() => {
                    if (transcript) {
                      stopListening();
                      onTranscript(transcript);
                    }
                  }}
                  disabled={!transcript}
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceInputButton;
