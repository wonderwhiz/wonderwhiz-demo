
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
      
      // Create the actual API call promise with a retry mechanism
      const makeApiCall = async (retries = 2) => {
        try {
          return await supabase.functions.invoke('text-to-speech', {
            body: { 
              text,
              voiceId: selectedVoiceId,
              model: 'eleven_turbo_v2_5',
              optimizeStreamingLatency: true
            }
          });
        } catch (err) {
          if (retries > 0) {
            console.log(`Retrying text-to-speech call, ${retries} attempts left`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retrying
            return makeApiCall(retries - 1);
          }
          throw err;
        }
      };
      
      // Race the timeout against the API call with retries
      const { data, error } = await Promise.race([
        makeApiCall(),
        timeoutPromise.then(() => {
          throw new Error('Text-to-speech request timed out');
        })
      ]) as { data: any, error: any };

      if (error) {
        console.error('Error calling text-to-speech function:', error);
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
        // Silent fallback - don't show error to user
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
          // Only revoke the URL when audio is done playing, not immediately
          try {
            URL.revokeObjectURL(url);
            setAudioSrc(null);
            audioElementRef.current = null;
          } catch (e) {
            console.warn('Error cleaning up audio URL:', e);
          }
        };
        
        // Start playing after a small delay to ensure browser is ready
        setTimeout(async () => {
          try {
            const playPromise = audio.play();
            
            // Modern browsers return a promise from play()
            if (playPromise !== undefined) {
              playPromise.catch((e) => {
                console.error('Play promise error:', e);
                if (e.name !== 'NotAllowedError') {
                  toast({
                    title: 'Playback Notice',
                    description: 'Audio might require user interaction first',
                    variant: 'default',
                  });
                }
              });
            }
          } catch (playError) {
            console.error('Error playing audio:', playError);
            // Only show toast for serious errors, not user-interaction errors
            if (playError instanceof Error && playError.name !== 'NotAllowedError') {
              toast({
                title: 'Playback Notice',
                description: 'Audio might require user interaction first',
                variant: 'default',
              });
            }
          }
        }, 100);
      } catch (playError) {
        console.error('Error preparing audio:', playError);
        // Silent failure - don't show error to user
      }
    } catch (error) {
      console.error('Error playing text:', error);
      // Silent failure - don't show error to user
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, toast, stopAudio, getSpecialistVoice]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    try {
      const byteCharacters = atob(base64);
      const byteArrays = [];

      // Process in chunks to prevent memory issues with large audio files
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
