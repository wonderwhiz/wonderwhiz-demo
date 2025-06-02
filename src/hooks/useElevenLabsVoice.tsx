
import { useState, useCallback } from 'react';

export const useElevenLabsVoice = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const playText = useCallback(async (text: string) => {
    setIsPlaying(true);
    
    try {
      // Simulate text-to-speech
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Error playing text:', error);
    } finally {
      setIsPlaying(false);
    }
  }, []);

  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    playText,
    isPlaying,
    stopPlaying
  };
};
