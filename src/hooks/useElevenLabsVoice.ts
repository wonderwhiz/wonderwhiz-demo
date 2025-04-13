
import { useState } from 'react';
import { toast } from 'sonner';

interface UseElevenLabsVoiceProps {
  defaultVoiceId?: string;
}

export const useElevenLabsVoice = (props?: UseElevenLabsVoiceProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  
  // Voice IDs for different specialist personas
  const specialistVoices: Record<string, string> = {
    // These are example voice IDs - would be replaced with actual ElevenLabs voice IDs
    nova: 'XrExE9yKIg1WjnnlVkGX', // Matilda - female voice good for space topics
    spark: 'pFZP5JQG7iQjIQuC4Bku', // Lily - creative female voice 
    prism: 'N2lVS1w4EtoT3dr4eOWO', // Callum - warm male voice for science
    pixel: 'iP95p4xoKVk53GoZ742B', // Chris - technical male voice
    atlas: 'onwK4e9ZLuTAKqWW03F9', // Daniel - authoritative male voice for history
    lotus: 'XB0fDUnXU5powFXDhCwa', // Charlotte - gentle female voice for nature
    whizzy: 'EXAVITQu4vr4xnSDxMaL', // Sarah - friendly female voice for general topics
    default: 'EXAVITQu4vr4xnSDxMaL'  // Default to Sarah
  };
  
  // Function to play text using ElevenLabs
  const playText = async (text: string, specialistId: string = 'default', options?: { voiceId?: string }) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.remove();
    }
    
    if (!text.trim()) return;
    
    try {
      setIsPlaying(true);
      
      // Determine which voice to use
      const voiceId = options?.voiceId || specialistVoices[specialistId] || specialistVoices.default;
      
      // In a real implementation, this would call the ElevenLabs API
      // For demo purposes, we're using the browser's built-in TTS
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast.error("Unable to play audio");
      };
      
      window.speechSynthesis.speak(utterance);
      
      // In a real implementation with ElevenLabs, it would look more like this:
      /*
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVEN_LABS_API_KEY || '',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }
      
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsPlaying(false);
        toast.error("Failed to play audio");
        URL.revokeObjectURL(audioUrl);
      };
      
      setCurrentAudio(audio);
      audio.play();
      */
    } catch (error) {
      console.error('Error playing text:', error);
      toast.error("Failed to generate speech");
      setIsPlaying(false);
    }
  };
  
  const stopPlaying = () => {
    if (currentAudio) {
      currentAudio.pause();
      setIsPlaying(false);
    }
    
    // For browser's speech synthesis
    window.speechSynthesis.cancel();
  };
  
  return {
    playText,
    stopPlaying,
    isPlaying,
  };
};
