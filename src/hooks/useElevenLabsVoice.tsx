
import { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseElevenLabsVoiceProps {
  voiceId?: string;
}

export function useElevenLabsVoice({ voiceId = 'pkDwhVp7Wc7dQq2DBbpK' }: UseElevenLabsVoiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Map specialists to appropriate voice IDs
  const specialistVoiceMap = {
    nova: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - male voice for space topics
    spark: 'XB0fDUnXU5powFXDhCwa', // Charlotte - female creative voice
    prism: 'JBFqnCBsd6RMkjVDRZzb', // George - male science voice
    pixel: 'iP95p4xoKVk53GoZ742B', // Chris - male tech voice 
    atlas: 'bIHbv24MWmeRgasZH58o', // Will - male history voice
    lotus: 'EXAVITQu4vr4xnSDxMaL', // Sarah - female nature voice
    whizzy: 'pkDwhVp7Wc7dQq2DBbpK', // WonderWhiz - primary voice
    default: 'pkDwhVp7Wc7dQq2DBbpK', // WonderWhiz - default voice
  };

  const getSpecialistVoice = (specialistId: string) => {
    return specialistVoiceMap[specialistId as keyof typeof specialistVoiceMap] || specialistVoiceMap.default;
  };

  // Clean up any playing audio
  const stopAudio = useCallback(() => {
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.src = '';
      } catch (e) {
        console.warn('Error stopping audio:', e);
      }
      audioElementRef.current = null;
    }
    
    if (audioSrc) {
      try {
        URL.revokeObjectURL(audioSrc);
        setAudioSrc(null);
      } catch (e) {
        console.warn('Error revoking Object URL:', e);
      }
    }
  }, [audioSrc]);

  const playText = useCallback(async (text: string, specialistId?: string) => {
    if (!text || text.trim() === '') {
      console.warn('No text provided for speech synthesis');
      return;
    }
    
    // Clean up any previous audio
    stopAudio();
    
    try {
      setIsLoading(true);
      
      // Use the provided voiceId or get one based on the specialist
      const selectedVoiceId = specialistId 
        ? getSpecialistVoice(specialistId) 
        : voiceId;
      
      console.log(`Generating speech with voice ID: ${selectedVoiceId}`);
      
      // Create a timeout promise to abort if it takes too long
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Text-to-speech request timed out')), 15000);
      });
      
      // Create the actual API call promise
      const apiCallPromise = supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: selectedVoiceId,
          model: 'eleven_turbo_v2_5',
          optimizeStreamingLatency: true
        }
      });
      
      // Race the timeout against the API call
      const { data, error } = await Promise.race([
        apiCallPromise,
        timeoutPromise.then(() => {
          throw new Error('Text-to-speech request timed out');
        })
      ]) as { data: any, error: any };

      if (error) {
        console.error('Error calling text-to-speech function:', error);
        // We'll continue without audio but still show a toast
        toast({
          title: 'Audio Unavailable',
          description: 'Could not generate speech at this time',
          variant: 'destructive',
        });
        return;
      }

      if (!data) {
        console.warn('No data returned from text-to-speech function');
        return;
      }

      // Handle fallback response
      if (data.fallback) {
        console.log('Using fallback for audio response:', data.message);
        // Don't show error to user, just fail silently
        return;
      }

      if (!data.audioContent) {
        console.warn('No audio content in response');
        return;
      }

      // Create a blob URL from the base64 audio data
      try {
        const blob = base64ToBlob(data.audioContent, 'audio/mpeg');
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);

        // Play the audio
        const audio = new Audio(url);
        audioElementRef.current = audio;
        
        // Set up event handlers
        audio.onerror = (e) => {
          console.error('Audio playback error:', e);
          URL.revokeObjectURL(url);
          setAudioSrc(null);
          audioElementRef.current = null;
        };
        
        audio.onended = () => {
          // Clean up the blob URL when audio is done playing
          URL.revokeObjectURL(url);
          setAudioSrc(null);
          audioElementRef.current = null;
        };
        
        // Start playing
        await audio.play();
      } catch (playError) {
        console.error('Error playing audio:', playError);
        // Don't show toast for common user-interaction errors
        if (playError instanceof Error && playError.name !== 'NotAllowedError') {
          toast({
            title: 'Playback Notice',
            description: 'Audio might require user interaction first',
            variant: 'default',
          });
        }
      }
    } catch (error) {
      console.error('Error playing text:', error);
      // Don't show error toast to users - just fail silently
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, toast, stopAudio]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    try {
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: mimeType });
    } catch (e) {
      console.error('Error converting base64 to blob:', e);
      // Return an empty audio blob as fallback
      return new Blob([], { type: mimeType });
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, [stopAudio]);

  return {
    playText,
    isLoading,
    audioSrc,
    getSpecialistVoice,
    stopAudio
  };
}
