
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Mic, Camera, Sparkles, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MagicalSearchInputProps {
  onSearch: (query: string) => void;
  onImageUpload?: (file: File) => void;
  onVoiceInput?: (transcript: string) => void;
  isProcessing?: boolean;
  childAge?: number;
  placeholder?: string;
  initialQuery?: string;
}

const MagicalSearchInput: React.FC<MagicalSearchInputProps> = ({
  onSearch,
  onImageUpload,
  onVoiceInput,
  isProcessing = false,
  childAge = 10,
  placeholder = "What would you like to learn about?",
  initialQuery = ""
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Update component when initialQuery changes
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query.trim());
    }
  };

  const handleVoiceInput = () => {
    if (isProcessing || isRecording) return;
    
    setIsRecording(true);
    setRecordingDuration(0);
    
    // Start a timer to show recording duration
    timerRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
    
    // Display appropriate toast message based on child age
    const message = childAge < 8 
      ? "I'm listening to you! Speak clearly." 
      : childAge < 12 
        ? "I'm listening..." 
        : "Voice input activated";
    
    toast.info(message, {
      duration: 3000,
      position: "top-center"
    });
    
    // Simulate voice recognition (replace with actual implementation)
    setTimeout(() => {
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Mock transcript - would come from actual voice recognition
      const mockQuery = "How do rainbows form?";
      
      if (onVoiceInput) {
        onVoiceInput(mockQuery);
        setQuery(mockQuery);
      }
    }, 3000);
  };

  const handleImageClick = () => {
    if (isProcessing) return;
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onImageUpload) {
      const file = e.target.files[0];
      onImageUpload(file);
      
      // Show preview of uploaded image
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // Show toast
      const message = childAge < 8 
        ? "Got your picture! Let me look at it." 
        : "Image uploaded, analyzing...";
      
      toast.success(message, {
        duration: 3000,
        position: "top-center"
      });
    }
  };

  const handleClearImage = () => {
    setCapturedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          {/* Search icon */}
          <div className={`absolute left-4 text-white/60 transition-all ${isRecording ? 'text-wonderwhiz-bright-pink animate-pulse' : ''}`}>
            {isRecording ? <Mic className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </div>
          
          {/* Input field */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRecording ? "I'm listening..." : placeholder}
            className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50"
            disabled={isProcessing || isRecording}
          />
          
          {/* Recording indicator */}
          {isRecording && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-14 bg-wonderwhiz-bright-pink text-white px-3 py-1 rounded-full text-sm font-medium">
              Recording {formatRecordingTime(recordingDuration)}
            </div>
          )}
          
          {/* Image preview */}
          <AnimatePresence>
            {capturedImage && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-14 bg-white/10 backdrop-blur-md rounded-lg p-1 border border-white/20"
              >
                <div className="relative">
                  <img 
                    src={capturedImage} 
                    alt="Captured" 
                    className="h-16 w-auto rounded object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="absolute -top-2 -right-2 bg-wonderwhiz-purple text-white rounded-full p-1"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Action buttons */}
          <div className="absolute right-2 flex items-center gap-2">
            {/* Image upload button */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              ref={fileInputRef}
              id="image-upload"
            />
            
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
              onClick={handleImageClick}
              disabled={isProcessing || isRecording}
            >
              <Camera className="h-4 w-4" />
            </Button>
            
            {/* Voice input button */}
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "ghost"}
              className={`h-8 w-8 rounded-full transition-all ${
                isRecording 
                  ? "bg-wonderwhiz-bright-pink text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              onClick={handleVoiceInput}
              disabled={isProcessing}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            
            {/* Submit button */}
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isProcessing || isRecording}
              className="rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple text-white px-4 h-8 transition-all hover:shadow-lg"
            >
              {isProcessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default MagicalSearchInput;
