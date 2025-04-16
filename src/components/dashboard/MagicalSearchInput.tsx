
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Mic, Camera, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface MagicalSearchInputProps {
  onSearch: (query: string) => void;
  onImageUpload?: (file: File) => void;
  onVoiceInput?: (transcript: string) => void;
  isProcessing?: boolean;
  childAge?: number;
}

const MagicalSearchInput: React.FC<MagicalSearchInputProps> = ({
  onSearch,
  onImageUpload,
  onVoiceInput,
  isProcessing = false,
  childAge = 10
}) => {
  const [query, setQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isProcessing) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  const handleVoiceInput = () => {
    if (isProcessing) return;
    
    setIsRecording(true);
    toast.info(childAge < 10 ? "I'm listening!" : "Listening...");
    
    // Simulate voice recognition (replace with actual implementation)
    setTimeout(() => {
      setIsRecording(false);
      const mockQuery = "How do rainbows form?";
      if (onVoiceInput) {
        onVoiceInput(mockQuery);
      }
    }, 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0] && onImageUpload) {
      onImageUpload(e.target.files[0]);
      toast.success(childAge < 10 ? "Got your picture!" : "Image uploaded");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 text-white/60">
            <Search className="w-5 h-5" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRecording ? "I'm listening..." : "What would you like to learn about?"}
            className="w-full pl-12 pr-32 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-wonderwhiz-bright-pink/50"
            disabled={isProcessing || isRecording}
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              id="image-upload"
            />
            
            <label htmlFor="image-upload">
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full text-white/60 hover:text-white hover:bg-white/10"
                disabled={isProcessing || isRecording}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </label>
            
            <Button
              type="button"
              size="icon"
              variant={isRecording ? "default" : "ghost"}
              className={`h-8 w-8 rounded-full ${
                isRecording 
                  ? "bg-wonderwhiz-bright-pink text-white" 
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
              onClick={handleVoiceInput}
              disabled={isProcessing}
            >
              <Mic className={`h-4 w-4 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              disabled={!query.trim() || isProcessing}
              className="rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple text-white px-4 h-8"
            >
              {isProcessing ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
