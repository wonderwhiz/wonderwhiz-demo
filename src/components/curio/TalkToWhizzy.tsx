
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, X, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import { useGeminiLiveWebSocket } from '@/hooks/useGeminiLiveWebSocket';
import { toast } from 'sonner';

interface TalkToWhizzyProps {
  childId?: string;
  curioTitle?: string;
  ageGroup?: '5-7' | '8-11' | '12-16';
  onNewQuestionGenerated?: (question: string) => void;
}

const TalkToWhizzy: React.FC<TalkToWhizzyProps> = ({
  childId,
  curioTitle,
  ageGroup = '8-11',
  onNewQuestionGenerated
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Convert age group to numeric age for API
  const childAge = ageGroup === '5-7' ? 6 : ageGroup === '8-11' ? 9 : 14;
  
  // Use our new Gemini Live WebSocket hook
  const {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    resetChat,
    response,
    isProcessing,
    isVoiceLoading,
    chatHistory
  } = useGeminiLiveWebSocket({
    childAge,
    curioContext: curioTitle,
    specialistId: 'whizzy'
  });
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  useEffect(() => {
    // Setup Web Speech API with proper TypeScript check
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
      };
      
      recognitionRef.current.onend = () => {
        if (isListening) {
          recognitionRef.current.start();
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
  }, [isListening]);
  
  useEffect(() => {
    // Create audio context with proper TypeScript handling
    if (!audioContextRef.current) {
      const AudioContextAPI = window.AudioContext || window.webkitAudioContext;
      if (AudioContextAPI) {
        audioContextRef.current = new AudioContextAPI();
      }
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Play the welcome message when first opened
  useEffect(() => {
    if (isOpen && !isMuted && chatHistory.length === 0) {
      const welcomeMessage = `Hi there! I'm Whizzy. What would you like to know about ${curioTitle || 'this topic'}?`;
      sendMessage(welcomeMessage);
    }
  }, [isOpen, isMuted, curioTitle, sendMessage, chatHistory.length]);
  
  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      
      // Process the transcript if it exists
      if (transcript) {
        handleSendMessage();
      }
    } else {
      setTranscript('');
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const handleClose = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }
    setIsOpen(false);
    setTranscript('');
    resetChat();
    disconnect();
  };
  
  const handleSendMessage = async () => {
    if (!transcript.trim() || isProcessing) return;
    
    const userQuestion = transcript;
    setTranscript('');
    
    const result = await sendMessage(userQuestion);
    
    // Potentially generate a new exploration from this question
    if (result && userQuestion.length > 10 && onNewQuestionGenerated && childId) {
      // Only suggest new topics for substantive questions
      setTimeout(() => {
        onNewQuestionGenerated(userQuestion);
      }, 5000); // Suggest after 5 seconds
    }
  };
  
  // Animation variants
  const buttonVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    exit: { scale: 0, opacity: 0 },
    whileTap: { scale: 0.9 }
  };
  
  const dialogVariants = {
    initial: { scale: 0.9, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, y: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } },
    exit: { scale: 0.9, opacity: 0, y: 20, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed bottom-8 right-8 z-50"
            initial="initial"
            animate="animate"
            exit="exit"
            variants={buttonVariants}
            whileTap="whileTap"
          >
            <Button
              onClick={() => {
                setIsOpen(true);
                connect(); // Connect when opening
              }}
              className="h-16 w-16 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple shadow-lg hover:from-wonderwhiz-purple hover:to-wonderwhiz-bright-pink"
              aria-label="Talk to Whizzy"
            >
              <Phone className="h-7 w-7 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dialog */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-br from-indigo-950 to-indigo-900 rounded-xl shadow-2xl overflow-hidden"
              variants={dialogVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 bg-black/30 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Talk to Whizzy</h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Content Area */}
              <div className="h-[300px] px-6 py-4 overflow-y-auto">
                {chatHistory.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className={`animate-pulse text-white/50 ${isConnected ? '' : 'text-red-400'}`}>
                      {isConnected ? 'Connecting to Whizzy...' : 'Trying to connect...'}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((message, index) => (
                      <div key={index} className={`flex items-start ${message.role === 'model' ? '' : 'justify-end'}`}>
                        {message.role === 'model' && (
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wonderwhiz-purple flex items-center justify-center">
                            <span className="text-white font-bold">W</span>
                          </div>
                        )}
                        <div className={`mx-3 rounded-lg p-3 text-white max-w-[85%] ${
                          message.role === 'model' 
                            ? 'bg-white/10' 
                            : 'bg-wonderwhiz-bright-pink/30'
                        }`}>
                          {message.content}
                        </div>
                        {message.role === 'user' && (
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wonderwhiz-bright-pink/40 flex items-center justify-center">
                            <span className="text-white">You</span>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {transcript && (
                      <div className="flex items-start justify-end">
                        <div className="mr-3 bg-wonderwhiz-bright-pink/20 rounded-lg p-3 text-white/80 max-w-[85%] border border-wonderwhiz-bright-pink/30">
                          {transcript}
                        </div>
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-wonderwhiz-bright-pink/30 flex items-center justify-center">
                          <span className="text-white/80">You</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Connection Status */}
              {!isConnected && (
                <div className="px-4 py-2 bg-red-500/20 text-red-200 text-center text-xs">
                  Connection issues - Click mic to try again
                </div>
              )}
              
              {/* Controls */}
              <div className="px-6 py-4 bg-black/20 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleMute}
                  className={`h-10 w-10 rounded-full ${isMuted ? 'bg-red-500/20 text-red-500 border-red-500/50' : 'bg-white/10 text-white/70 border-white/20'}`}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                
                <Button
                  onClick={toggleMic}
                  disabled={isProcessing || isVoiceLoading}
                  className={`h-16 w-16 rounded-full ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:from-wonderwhiz-purple hover:to-wonderwhiz-bright-pink'
                  } shadow-lg transition-all duration-300 ${(isProcessing || isVoiceLoading) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isListening ? (
                    <MicOff className="h-7 w-7 text-white" />
                  ) : (
                    <Mic className="h-7 w-7 text-white" />
                  )}
                </Button>
                
                <div className="w-10 h-10">
                  {/* Placeholder for symmetry */}
                </div>
              </div>
              
              {/* Processing indicator */}
              {(isProcessing || isVoiceLoading) && (
                <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black/50 rounded-full text-white text-xs flex items-center space-x-2">
                  <div className="h-2 w-2 bg-wonderwhiz-bright-pink rounded-full animate-ping" />
                  <span>{isProcessing ? "Processing..." : "Speaking..."}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TalkToWhizzy;
