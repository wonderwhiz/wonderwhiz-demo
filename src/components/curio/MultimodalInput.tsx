
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, Camera, X, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface MultimodalInputProps {
  onSubmit: (query: string) => void;
  onImageCapture?: (image: File) => void;
  isProcessing?: boolean;
  childAge?: number;
  initialQuery?: string;
  placeholder?: string;
  showExploreButton?: boolean;
  onExplore?: () => void;
}

const MultimodalInput: React.FC<MultimodalInputProps> = ({
  onSubmit,
  onImageCapture,
  isProcessing = false,
  childAge = 10,
  initialQuery = '',
  placeholder = 'Ask me anything...',
  showExploreButton = false,
  onExplore
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Voice recording placeholder (would integrate with real Web Speech API or other service)
  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.info(childAge < 8 
        ? "I'm listening! Tell me what you're curious about!"
        : "Voice recording started. Speak your question clearly.");
      
      // Simulate recording for demo purposes
      setTimeout(() => {
        setIsRecording(false);
        // In a real implementation, this would be the transcribed text
        const simulatedTranscript = "How do rainbows form?";
        setQuery(simulatedTranscript);
        toast.success("I heard: " + simulatedTranscript);
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info("Voice recording stopped");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSubmit(query.trim());
    }
  };
  
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageCapture) {
      onImageCapture(file);
      toast.success(childAge < 8 
        ? "Got your picture! What would you like to know about it?" 
        : "Image received. What would you like to learn about this?");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex rounded-full border bg-white/5 border-white/20 focus-within:border-wonderwhiz-bright-pink/50 overflow-hidden">
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isRecording 
            ? (childAge < 8 ? "I'm listening..." : "Listening to your question...") 
            : placeholder
          }
          className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/50 pl-10"
          disabled={isProcessing || isRecording}
        />
        
        <div className="flex items-center pr-1">
          {query && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white/60 hover:text-white mr-1"
              onClick={() => setQuery('')}
              disabled={isProcessing}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          
          {onImageCapture && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-white/60 hover:text-white mr-1"
              onClick={handleImageClick}
              disabled={isProcessing || isRecording}
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            type="button"
            size="icon"
            variant={isRecording ? "default" : "ghost"}
            className={`h-8 w-8 ${isRecording ? 'bg-wonderwhiz-bright-pink text-white' : 'text-white/60 hover:text-white'} mr-1`}
            onClick={handleVoiceInput}
            disabled={isProcessing}
          >
            <Mic className={`h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
          </Button>
          
          {showExploreButton && onExplore && (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={onExplore}
              disabled={isProcessing}
              className="h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white mr-1 flex items-center"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Explore</span>
            </Button>
          )}
          
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white"
            disabled={!query.trim() || isProcessing || isRecording}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {onImageCapture && (
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageUpload}
        />
      )}
      
      {isRecording && (
        <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-wonderwhiz-bright-pink">
          {childAge < 8 
            ? "I'm listening to your question!" 
            : "Speak clearly - I'm recording your question"}
        </div>
      )}
    </form>
  );
};

export default MultimodalInput;
