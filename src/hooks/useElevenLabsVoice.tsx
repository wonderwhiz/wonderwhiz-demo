
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseElevenLabsVoiceProps {
  voiceId?: string;
  onError?: (error: string) => void;
}

export function useElevenLabsVoice({ voiceId = 'pkDwhVp7Wc7dQq2DBbpK', onError }: UseElevenLabsVoiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const playText = useCallback(async (text: string, specialistId?: string) => {
    if (!text) {
      console.warn('No text provided for speech synthesis');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the provided voiceId or get one based on the specialist
      const selectedVoiceId = specialistId 
        ? getSpecialistVoice(specialistId) 
        : voiceId;
      
      console.log(`Generating speech with voice ID: ${selectedVoiceId}`);
      
      const { data, error: funcError } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: selectedVoiceId,
          model: 'eleven_turbo_v2_5',
          optimizeStreamingLatency: true
        }
      });

      if (funcError) {
        console.error('Error calling text-to-speech function:', funcError);
        setError(funcError.message);
        if (onError) onError(funcError.message);
        toast.error("Speech generation failed", {
          description: "Check that ElevenLabs API key is configured",
        });
        return;
      }

      if (!data) {
        const errMsg = 'No data returned from text-to-speech function';
        console.warn(errMsg);
        setError(errMsg);
        if (onError) onError(errMsg);
        return;
      }

      if (!data.success) {
        const errMsg = data.error || 'Speech generation failed';
        console.error(errMsg);
        setError(errMsg);
        if (onError) onError(errMsg);
        toast.error("Speech generation failed", {
          description: data.message || "Please check ElevenLabs configuration",
        });
        return;
      }

      if (!data.audioContent) {
        const errMsg = 'No audio content in response';
        console.warn(errMsg);
        setError(errMsg);
        if (onError) onError(errMsg);
        return;
      }

      // Create a blob URL from the base64 audio data
      const blob = base64ToBlob(data.audioContent, 'audio/mpeg');
      const url = URL.createObjectURL(blob);
      setAudioSrc(url);

      // Play the audio
      const audio = new Audio(url);
      
      // Set up event handlers
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        URL.revokeObjectURL(url);
        setAudioSrc(null);
      };
      
      audio.onended = () => {
        // Clean up the blob URL when audio is done playing
        URL.revokeObjectURL(url);
        setAudioSrc(null);
      };
      
      // Start playing
      const playPromise = audio.play();
      
      // Handle play promise (required for mobile browsers)
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.error('Error playing audio:', error);
          // Don't show toast for common user-interaction errors
          if (error.name !== 'NotAllowedError') {
            toast("Playback Notice", {
              description: 'Audio might require user interaction first',
            });
          }
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error playing text';
      console.error('Error playing text:', errorMessage);
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, onError]);

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

  return {
    playText,
    isLoading,
    audioSrc,
    error,
    getSpecialistVoice
  };
}
