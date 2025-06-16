
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReadAloudButtonProps {
  text: string;
  childAge?: number;
  className?: string;
  variant?: 'default' | 'ghost' | 'outline';
}

const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  text,
  childAge = 10,
  className = '',
  variant = 'ghost'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const handleReadAloud = async () => {
    if (isPlaying && currentAudio) {
      // Stop current playback
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
      return;
    }

    if (!text || text.trim().length === 0) {
      toast.error(childAge <= 8 ? "Oops! Nothing to read!" : "No text to read");
      return;
    }

    setIsLoading(true);

    try {
      // Use browser's built-in speech synthesis for now
      // This is more reliable and doesn't require API keys
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        
        // Configure speech settings for kids
        utterance.rate = childAge <= 8 ? 0.8 : 0.9; // Slower for younger kids
        utterance.pitch = childAge <= 8 ? 1.2 : 1.0; // Higher pitch for younger kids
        utterance.volume = 0.8;

        // Try to use a more child-friendly voice if available
        const voices = speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.name.includes('Google') || 
          voice.name.includes('Alex') || 
          voice.name.includes('Samantha')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onstart = () => {
          setIsPlaying(true);
          setIsLoading(false);
        };

        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          toast.error(childAge <= 8 ? "Oops! Can't read right now!" : "Speech not available");
        };

        speechSynthesis.speak(utterance);
        
        // Store reference to stop if needed (though we can't directly control SpeechSynthesis audio)
        setCurrentAudio(null);
        
      } else {
        throw new Error('Speech synthesis not supported');
      }
    } catch (error) {
      console.error('Text-to-speech error:', error);
      toast.error(childAge <= 8 ? "Sorry! Can't read this right now!" : "Text-to-speech unavailable");
      setIsLoading(false);
    }
  };

  const getButtonLabel = () => {
    if (isLoading) return childAge <= 8 ? "Getting ready..." : "Loading...";
    if (isPlaying) return childAge <= 8 ? "Stop reading" : "Stop";
    return childAge <= 8 ? "Read to me!" : "Read aloud";
  };

  const getButtonIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />;
    if (isPlaying) return <VolumeX className="h-4 w-4" />;
    return <Volume2 className="h-4 w-4" />;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        size="sm"
        onClick={handleReadAloud}
        disabled={isLoading}
        className={`
          ${className}
          ${childAge <= 8 ? 'bg-wonderwhiz-vibrant-yellow/20 text-wonderwhiz-vibrant-yellow hover:bg-wonderwhiz-vibrant-yellow/30 border-wonderwhiz-vibrant-yellow/40' : ''}
          ${isPlaying ? 'bg-wonderwhiz-bright-pink/20 text-wonderwhiz-bright-pink' : ''}
          transition-all duration-200
        `}
      >
        {getButtonIcon()}
        <span className="ml-2 font-medium">
          {getButtonLabel()}
        </span>
        {childAge <= 8 && !isLoading && (
          <span className="ml-1">🔊</span>
        )}
      </Button>
    </motion.div>
  );
};

export default ReadAloudButton;
