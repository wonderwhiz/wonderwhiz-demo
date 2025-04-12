
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppleButton } from '@/components/ui/apple-button';
import { useUser } from '@/hooks/use-user';

interface CurioAudioPlayerProps {
  text: string;
  title?: string;
}

const CurioAudioPlayer: React.FC<CurioAudioPlayerProps> = ({ text, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { user } = useUser();

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleExpandToggle = () => {
    setIsExpanded(!isExpanded);
  };

  // For now we'll use the browser's built-in Text-to-Speech
  // In a production app, this would be replaced with a proper TTS service
  const generateSpeech = async () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      speechSynthesis.cancel(); // Stop any current speech
      speechSynthesis.speak(utterance);
      
      setIsPlaying(true);
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
    }
  };

  return (
    <div className="mt-4 mb-6">
      <Button
        variant="outline"
        size="sm"
        onClick={handleExpandToggle}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border-white/20"
      >
        <Headphones className="h-4 w-4" />
        <span>{isExpanded ? "Hide Audio Player" : "Listen to this"}</span>
      </Button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mt-3 p-4 bg-black/20 backdrop-blur-md rounded-lg border border-white/10"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium">
              {title || "Listen to this explanation"}
            </h4>
            <button
              onClick={handleExpandToggle}
              className="text-white/60 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          
          <AppleButton
            onClick={generateSpeech}
            variant="primary"
            size="md"
            className="w-full flex items-center justify-center gap-2"
          >
            {isPlaying ? (
              <>
                <Pause size={18} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={18} />
                <span>Play</span>
              </>
            )}
          </AppleButton>
        </motion.div>
      )}
    </div>
  );
};

export default CurioAudioPlayer;
