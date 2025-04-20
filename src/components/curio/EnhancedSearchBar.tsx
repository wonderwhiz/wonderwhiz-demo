
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Image, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EnhancedSearchBarProps {
  onSearch: (query: string) => void;
  onImageCapture?: (file: File) => void;
  onVoiceCapture?: (transcript: string) => void;
  placeholder?: string;
  initialQuery?: string;
  onClear?: () => void;
  showExploreButton?: boolean;
  onExplore?: () => void;
  isProcessing?: boolean;
  childAge?: number;
}

const EnhancedSearchBar: React.FC<EnhancedSearchBarProps> = ({
  onSearch,
  onImageCapture,
  onVoiceCapture,
  placeholder = "Ask another question or explore something new...",
  initialQuery = '',
  onClear,
  showExploreButton = true,
  onExplore,
  isProcessing = false,
  childAge = 10
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    if (onClear) onClear();
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
    }
  };

  const handleVoiceCapture = () => {
    // Simulate voice recording in this example
    if (!isListening) {
      setIsListening(true);
      setIsRecording(true);
      
      toast.info(childAge < 10 
        ? "I'm listening! Tell me what you want to know!" 
        : "Listening... Speak clearly.");
      
      // Simulate recording complete after 3 seconds
      setTimeout(() => {
        setIsListening(false);
        setIsRecording(false);
        
        // Simulate a transcript
        const mockTranscript = "How do fireflies use their light to communicate?";
        if (onVoiceCapture) {
          onVoiceCapture(mockTranscript);
        } else {
          setQuery(mockTranscript);
          toast.success("I heard: " + mockTranscript);
        }
      }, 3000);
    } else {
      setIsListening(false);
      setIsRecording(false);
      toast.info("Voice capture canceled");
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-3 text-white/60">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              isRecording 
                ? (childAge < 10 ? "I'm listening..." : "Listening...")
                : placeholder
            }
            className="w-full pl-10 pr-[120px] py-3 rounded-full bg-white/5 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50"
            disabled={isProcessing || isRecording}
          />
          
          <div className="absolute right-2 flex items-center space-x-1">
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
            
            {showExploreButton && onExplore && (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={onExplore}
                className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white ml-1 flex items-center"
              >
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">Explore</span>
              </Button>
            )}
          </div>
        </div>
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
          className="absolute -bottom-6 left-0 right-0 text-center text-xs text-wonderwhiz-bright-pink"
        >
          {childAge < 10 
            ? "I'm listening to your question!" 
            : "Recording... Speak clearly"}
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
