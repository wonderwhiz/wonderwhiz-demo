
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Send, X, Mic, Volume2, MessageSquare } from 'lucide-react';
import SpecialistAvatar from '@/components/SpecialistAvatar';
import { useGeminiLiveChat } from '@/hooks/useGeminiLiveChat';
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
  const [userMessage, setUserMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const { 
    sendMessage,
    resetChat,
    chatHistory,
    isProcessing,
    isVoiceLoading
  } = useGeminiLiveChat({
    childAge: ageGroup === '5-7' ? 6 : ageGroup === '8-11' ? 9 : 14,
    curioContext: curioTitle,
    specialistId: 'whizzy'
  });
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.continuous = false;
          recognitionRef.current.interimResults = false;
          
          recognitionRef.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setUserMessage(transcript);
            setIsListening(false);
          };
          
          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            if (event.error === 'not-allowed') {
              toast.error('Please allow microphone access to use voice input');
            }
          };
          
          recognitionRef.current.onend = () => {
            setIsListening(false);
          };
        } catch (error) {
          console.error('Error initializing speech recognition:', error);
          setSpeechSupported(false);
        }
      } else {
        setSpeechSupported(false);
      }
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);
  
  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && chatHistory.length > 0) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const toggleListening = () => {
    if (!speechSupported) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }
    
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      setIsListening(false);
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.start();
          setIsListening(true);
        }
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };
  
  const handleSendMessage = async () => {
    if (userMessage.trim()) {
      // Store the message for later analysis
      const messageToSend = userMessage;
      
      // Clear the input
      setUserMessage('');
      
      // Send the message
      await sendMessage(messageToSend);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      resetChat();
    }
  };
  
  return (
    <>
      <Button
        onClick={toggleChat}
        size="icon"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/90 text-white rounded-full h-14 w-14 shadow-lg z-40"
        aria-label={isOpen ? "Close chat" : "Open chat with Whizzy"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="fixed bottom-24 right-4 sm:right-8 w-[calc(100%-2rem)] sm:w-[400px] h-[500px] bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-purple rounded-xl shadow-xl z-30 flex flex-col"
          >
            {/* Chat header */}
            <div className="flex items-center p-4 border-b border-white/10">
              <SpecialistAvatar specialistId="whizzy" size="md" className="mr-3" />
              <div>
                <h3 className="font-semibold text-white">Whizzy the Guide</h3>
                <p className="text-xs text-white/60">Your friendly wonder wizard</p>
              </div>
            </div>
            
            {/* Chat messages */}
            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto"
              aria-live="polite" 
              aria-atomic="false"
            >
              {chatHistory.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <SpecialistAvatar specialistId="whizzy" size="lg" className="mb-4" />
                  <h4 className="text-white font-semibold mb-2">Hi there! I'm Whizzy!</h4>
                  <p className="text-white/70 text-sm mb-4">
                    Ask me anything about the world of wonders! I can help you explore new topics and answer your questions.
                  </p>
                  <div className="grid grid-cols-1 gap-2 w-full max-w-xs">
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs justify-start"
                      onClick={() => sendMessage("What's the most interesting thing to learn about?")}
                    >
                      What's the most interesting thing to learn about?
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs justify-start"
                      onClick={() => sendMessage("Can you suggest a fun topic to explore?")}
                    >
                      Can you suggest a fun topic to explore?
                    </Button>
                    {curioTitle && (
                      <Button 
                        variant="outline" 
                        className="bg-white/5 border-white/10 text-white hover:bg-white/10 text-xs justify-start"
                        onClick={() => sendMessage(`Tell me more about ${curioTitle}`)}
                      >
                        Tell me more about {curioTitle}
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {chatHistory.map((message, index) => (
                    <div 
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {message.role !== 'user' && (
                        <SpecialistAvatar specialistId="whizzy" size="sm" className="mt-1 mr-2 flex-shrink-0" />
                      )}
                      <div 
                        className={`max-w-[75%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-indigo-600/30 text-white' 
                            : 'bg-white/10 text-white'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs ml-2 mt-1 flex-shrink-0">
                          You
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex justify-start">
                      <SpecialistAvatar specialistId="whizzy" size="sm" className="mt-1 mr-2" />
                      <div className="bg-white/10 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                          <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Chat input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center bg-white/5 rounded-lg border border-white/10 focus-within:ring-1 focus-within:ring-white/20">
                <input
                  type="text"
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="flex-1 bg-transparent border-0 focus:outline-none focus:ring-0 text-white placeholder:text-white/40 text-sm px-3 py-2"
                  placeholder="Ask Whizzy anything..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isProcessing) {
                      handleSendMessage();
                    }
                  }}
                  disabled={isProcessing}
                  aria-label="Your message to Whizzy"
                />
                <div className="flex items-center space-x-1 pr-2">
                  {speechSupported && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className={`h-8 w-8 rounded-full ${isListening ? 'text-red-400 bg-white/10' : 'text-white/70'} hover:text-white hover:bg-white/10`}
                      onClick={toggleListening}
                      disabled={isProcessing}
                      aria-label={isListening ? "Stop listening" : "Start voice input"}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/10"
                    onClick={handleSendMessage}
                    disabled={!userMessage.trim() || isProcessing}
                    aria-label="Send message"
                  >
                    {isProcessing ? (
                      <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white/80 animate-spin"></div>
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center mt-2 text-xs text-white/40">
                <div>
                  {isVoiceLoading && <span className="flex items-center"><Volume2 className="h-3 w-3 mr-1 animate-pulse" /> Speaking...</span>}
                </div>
                <div>
                  Powered by Gemini
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TalkToWhizzy;
