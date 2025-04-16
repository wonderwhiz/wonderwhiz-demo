
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseElevenLabsVoiceOptions {
  voiceId?: string;
  model?: string;
}

export const useElevenLabsVoice = (options: UseElevenLabsVoiceOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSpecialistRef = useRef<string | null>(null);

  const playText = useCallback(async (text: string, specialistId = 'default') => {
    if (!text || isLoading || isPlaying) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      
      console.log(`Generating speech with voice ID: ${specialistId}`);
      
      // Call the Supabase Edge Function for text-to-speech
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          specialistId: specialistId,
          model: options.model || 'eleven_turbo_v2_5'
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (!data || !data.audioContent) {
        throw new Error('No audio content returned');
      }
      
      // Create audio from base64
      const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
      audioRef.current = audio;
      activeSpecialistRef.current = specialistId;
      
      // Setup event listeners
      audio.onplay = () => setIsPlaying(true);
      audio.onended = () => {
        setIsPlaying(false);
        activeSpecialistRef.current = null;
      };
      audio.onpause = () => setIsPlaying(false);
      audio.onerror = (e) => {
        console.error('Error playing audio:', e);
        setError('Failed to play audio');
        setIsPlaying(false);
        activeSpecialistRef.current = null;
      };
      
      // Play the audio
      try {
        await audio.play();
      } catch (playError) {
        console.error('Error playing audio:', playError);
        throw new Error('Failed to play audio');
      }
      
    } catch (error) {
      console.error('Error playing audio:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast.error('Could not play audio', {
        description: 'There was an issue generating or playing the speech.'
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isPlaying, options.model]);

  const stopPlaying = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      activeSpecialistRef.current = null;
    }
  }, []);

  return {
    playText,
    stopPlaying,
    isLoading,
    isPlaying,
    error,
    activeSpecialistId: activeSpecialistRef.current
  };
};
