
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Image, X, Sparkles, SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface EnhancedSearchInputProps {
  onSearch: (query: string) => void;
  onImageCapture?: (file: File) => void;
  onVoiceCapture?: (transcript: string) => void;
  placeholder?: string;
  initialQuery?: string;
  isProcessing?: boolean;
  childAge?: number;
}

const EnhancedSearchInput: React.FC<EnhancedSearchInputProps> = ({
  onSearch,
  onImageCapture,
  onVoiceCapture,
  placeholder = "What are you curious about today?",
  initialQuery = '',
  isProcessing = false,
  childAge = 10
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const [isImageMode, setIsImageMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query.trim());
      setQuery('');
    }
  };
  
  const handleClear = () => {
    setQuery('');
    setIsImageMode(false);
  };
  
  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onImageCapture) {
      onImageCapture(e.target.files[0]);
      toast.success(childAge < 10 ? "I got your picture!" : "Image uploaded successfully");
      setIsImageMode(true);
    }
  };
  
  const handleVoiceCapture = () => {
    if (!isRecording) {
      setIsRecording(true);
      
      // Age-appropriate message
      toast.info(childAge < 10 
        ? "I'm listening! Tell me what you want to learn about!" 
        : "Listening... Speak clearly.");
      
      // Simulate recording complete after 3 seconds
      setTimeout(() => {
        setIsRecording(false);
        
        // Simulate a transcript
        const mockTranscript = "How do volcanoes work?";
        if (onVoiceCapture) {
          onVoiceCapture(mockTranscript);
        } else {
          setQuery(mockTranscript);
          toast.success("I heard: " + mockTranscript);
        }
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("Voice capture canceled");
    }
  };
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <motion.div 
          className={cn(
            "flex items-center overflow-hidden transition-all duration-300 bg-white/10 backdrop-blur-md border border-white/20 rounded-full shadow-lg",
            isRecording && "ring-2 ring-wonderwhiz-bright-pink/50"
          )}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="absolute left-4 text-white/60">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRecording 
                ? (childAge < 10 ? "I'm listening..." : "Listening...")
                : isImageMode 
                ? "Ask about this image..." 
                : placeholder
            }
            className="w-full pl-12 pr-[130px] py-4 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-base"
            disabled={isProcessing || isRecording}
          />
          
          <div className="absolute right-3 flex items-center space-x-2">
            {query && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleClear}
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {!isImageMode && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={handleImageClick}
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                disabled={isProcessing || isRecording}
              >
                <Image className="h-4 w-4" />
              </Button>
            )}
            
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "ghost"}
              onClick={handleVoiceCapture}
              className={`h-8 w-8 rounded-full ${
                isRecording 
                  ? "bg-wonderwhiz-bright-pink text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              disabled={isProcessing}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isProcessing}
              className="rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple text-white h-9 px-4"
            >
              {isProcessing ? (
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
              ) : (
                <>
                  <SendHorizonal className="h-4 w-4 mr-1" />
                  <span className="text-xs font-medium">Explore</span>
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </form>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-6 left-0 right-0 text-center text-xs text-wonderwhiz-bright-pink font-medium"
        >
          {childAge < 10 
            ? "I'm listening to your question!" 
            : "Recording... Speak clearly"}
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedSearchInput;
