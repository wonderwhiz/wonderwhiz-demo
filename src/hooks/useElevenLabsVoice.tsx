
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UseElevenLabsVoiceProps {
  voiceId?: string;
}

export function useElevenLabsVoice({ voiceId = 'FGY2WhTYpPnrIDTdsKH5' }: UseElevenLabsVoiceProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const { toast } = useToast();

  // Map specialists to appropriate voice IDs
  const specialistVoiceMap = {
    nova: 'CwhRBWXzGAHq8TQ4Fs17', // Roger - male voice for space topics
    spark: 'XB0fDUnXU5powFXDhCwa', // Charlotte - female creative voice
    prism: 'JBFqnCBsd6RMkjVDRZzb', // George - male science voice
    pixel: 'iP95p4xoKVk53GoZ742B', // Chris - male tech voice 
    atlas: 'bIHbv24MWmeRgasZH58o', // Will - male history voice
    lotus: 'EXAVITQu4vr4xnSDxMaL', // Sarah - female nature voice
    default: 'FGY2WhTYpPnrIDTdsKH5', // Laura - default female voice
  };

  const getSpecialistVoice = (specialistId: string) => {
    return specialistVoiceMap[specialistId] || specialistVoiceMap.default;
  };

  const playText = useCallback(async (text: string, specialistId?: string) => {
    try {
      setIsLoading(true);
      
      // Use the provided voiceId or get one based on the specialist
      const selectedVoiceId = specialistId 
        ? getSpecialistVoice(specialistId) 
        : voiceId;
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text,
          voiceId: selectedVoiceId,
          model: 'eleven_turbo_v2_5',
          optimizeStreamingLatency: true
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data?.audioContent) {
        // Create a blob URL from the base64 audio data
        const blob = base64ToBlob(data.audioContent, 'audio/mpeg');
        const url = URL.createObjectURL(blob);
        setAudioSrc(url);

        // Play the audio
        const audio = new Audio(url);
        audio.onended = () => {
          // Clean up the blob URL when audio is done playing
          URL.revokeObjectURL(url);
          setAudioSrc(null);
        };
        audio.play();
      }
    } catch (error) {
      console.error('Error playing text:', error);
      toast({
        title: 'Speech Error',
        description: 'Unable to play speech at this time.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, toast]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
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
  };

  return {
    playText,
    isLoading,
    audioSrc,
    getSpecialistVoice
  };
}
