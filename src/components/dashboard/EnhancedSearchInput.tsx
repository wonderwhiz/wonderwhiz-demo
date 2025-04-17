
import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Mic, Image, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface EnhancedSearchInputProps {
  onSearch: (query: string) => void;
  onVoiceCapture?: (transcript: string) => void;
  onImageCapture?: (file: File) => void;
  placeholder?: string;
  isProcessing?: boolean;
  showSearchIcon?: boolean;
  showVoiceIcon?: boolean;
  showImageIcon?: boolean;
  childAge?: number;
  initialQuery?: string;
}

const EnhancedSearchInput: React.FC<EnhancedSearchInputProps> = ({
  onSearch,
  onVoiceCapture,
  onImageCapture,
  placeholder = "What are you curious about?",
  isProcessing = false,
  showSearchIcon = true,
  showVoiceIcon = true,
  showImageIcon = true,
  childAge = 10,
  initialQuery = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const [isRecording, setIsRecording] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Update query if initialQuery changes
    setQuery(initialQuery);
  }, [initialQuery]);

  // Handle click outside to collapse the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error("Please enter a question first");
      return;
    }
    
    if (!isProcessing) {
      onSearch(query);
    }
  };

  const handleFocus = () => {
    setIsExpanded(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  };

  const handleVoiceClick = () => {
    // In a real implementation, this would use the Web Speech API
    // For this demo, we'll just simulate a voice input after a delay
    setIsRecording(true);
    
    // Show a toast that we're listening
    toast.info(childAge < 8 ? "I'm listening!" : "Listening...");
    
    // Simulate receiving voice input after 2 seconds
    setTimeout(() => {
      setIsRecording(false);
      
      // Simulate a transcript
      const transcript = "How do stars form in space?";
      setQuery(transcript);
      
      if (onVoiceCapture) {
        onVoiceCapture(transcript);
      }
    }, 2000);
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // In a real implementation, you would upload and process the image
      // For this demo, we'll just trigger the callback
      if (onImageCapture) {
        onImageCapture(file);
      }
      
      // Reset the input so the same file can be selected again
      e.target.value = '';
    }
  };

  const clearQuery = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className={`relative ${isExpanded ? 'scale-105' : ''} transition-transform duration-300`}
      ref={containerRef}
    >
      <motion.div 
        initial={{ y: 0, opacity: 1 }}
        animate={{ 
          y: isExpanded ? -10 : 0,
          opacity: isExpanded ? 0 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={`absolute -top-6 left-0 w-full text-center text-white/80 text-sm font-medium ${isExpanded ? 'pointer-events-none' : ''}`}
      >
        <span role="img" aria-label="sparkles" className="mr-1">✨</span>
        {childAge < 8 ? "Let's explore something fun!" : "What are you curious about today?"}
      </motion.div>

      <form onSubmit={handleSubmit} className="relative">
        <div 
          className={`relative flex items-center transition-all duration-300 ${
            isExpanded 
              ? 'bg-white/10 border-white/30 shadow-xl' 
              : 'bg-white/5 border-white/20'
          } border rounded-full overflow-hidden group hover:bg-white/10 hover:border-white/30`}
          onClick={handleFocus}
        >
          {showSearchIcon && (
            <div className={`absolute left-4 text-white/60 transition-all duration-300 ${isExpanded ? 'scale-110' : ''}`}>
              <Search className="w-5 h-5" />
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isRecording ? "Listening..." : placeholder}
            className={`w-full bg-transparent text-white placeholder-white/60 outline-none transition-all duration-300 ${
              isExpanded 
                ? 'py-4 pl-12 pr-32 text-lg' 
                : 'py-3 pl-12 pr-24 text-base'
            }`}
            disabled={isProcessing || isRecording}
          />

          <div className="absolute right-3 flex items-center space-x-2">
            {query && (
              <motion.button
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                type="button"
                className="text-white/60 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
                onClick={clearQuery}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}

            {showImageIcon && (
              <motion.button
                type="button"
                className="text-white/60 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                onClick={handleImageClick}
                disabled={isProcessing || isRecording}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Image className="h-5 w-5" />
              </motion.button>
            )}

            {showVoiceIcon && (
              <motion.button
                type="button"
                className={`transition-colors p-2 rounded-full ${
                  isRecording 
                    ? 'text-wonderwhiz-bright-pink bg-white/10' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                onClick={handleVoiceClick}
                disabled={isProcessing}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mic className={`h-5 w-5 ${isRecording ? 'animate-pulse' : ''}`} />
              </motion.button>
            )}

            <Button
              type="submit"
              size="sm"
              disabled={isProcessing || isRecording || !query.trim()}
              className={`rounded-full px-4 ${
                isExpanded 
                  ? 'bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple hover:opacity-90' 
                  : 'bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-purple'
              } text-white font-medium transition-all`}
            >
              {isProcessing ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white/80 border-t-transparent rounded-full"></div>
                  <span>{childAge < 8 ? "Thinking..." : "Processing..."}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Sparkles className="mr-1.5 h-4 w-4" />
                  <span>{childAge < 8 ? "Explore" : "Explore"}</span>
                </div>
              )}
            </Button>
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
    </div>
  );
};

export default EnhancedSearchInput;
