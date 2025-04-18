
import { useState, useEffect, useCallback, useRef } from 'react';

type SoundType = 'ambient' | 'interaction';
type AmbientTrack = 'morning' | 'afternoon' | 'evening' | 'focus' | 'relax';
type InteractionSound = 'tap' | 'swipe' | 'collect' | 'expand' | 'interaction' | 'success' | 'error';

interface UseAmbientSoundOptions {
  defaultAmbientTrack?: AmbientTrack;
  initiallyMuted?: boolean;
  volume?: number;
  fadeInDuration?: number;
  fadeOutDuration?: number;
}

export function useAmbientSound({
  defaultAmbientTrack = 'afternoon',
  initiallyMuted = false,
  volume = 0.5,
  fadeInDuration = 2000, // ms
  fadeOutDuration = 1000, // ms
}: UseAmbientSoundOptions = {}) {
  const [isMuted, setIsMuted] = useState(initiallyMuted);
  const [currentVolume, setCurrentVolume] = useState(volume);
  const [currentTrack, setCurrentTrack] = useState<AmbientTrack>(defaultAmbientTrack);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const ambientSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const audioBuffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  
  // Initialize the audio context
  useEffect(() => {
    // Use window.AudioContext with a fallback to window.webkitAudioContext
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    
    if (AudioCtx) {
      audioContextRef.current = new AudioCtx();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      
      // Start with volume at 0 and gradually increase when playing
      gainNodeRef.current.gain.value = 0;
    } else {
      console.warn('Web Audio API is not supported in this browser.');
    }
    
    return () => {
      if (audioContextRef.current?.state !== 'closed') {
        stopAllSounds();
        audioContextRef.current?.close();
      }
    };
  }, []);
  
  // Preload sound effects
  useEffect(() => {
    const preloadSounds = async () => {
      if (!audioContextRef.current) return;
      
      // List of sounds to preload
      const soundsToLoad = [
        { key: 'ambient-morning', url: '/sounds/ambient-morning.mp3' },
        { key: 'ambient-afternoon', url: '/sounds/ambient-afternoon.mp3' },
        { key: 'ambient-evening', url: '/sounds/ambient-evening.mp3' },
        { key: 'interaction-tap', url: '/sounds/tap.mp3' },
        { key: 'interaction-swipe', url: '/sounds/swipe.mp3' },
        { key: 'interaction-collect', url: '/sounds/collect.mp3' },
        { key: 'interaction-success', url: '/sounds/success.mp3' },
      ];
      
      // Use fake URLs for demo - in a real app these would be actual audio files
      for (const sound of soundsToLoad) {
        try {
          // In a real app, we would fetch the actual audio file
          // For this demo, we'll create a simple sine wave oscillator sound
          const buffer = audioContextRef.current.createBuffer(
            2, // Stereo (2 channels)
            audioContextRef.current.sampleRate * 2, // 2 seconds
            audioContextRef.current.sampleRate
          );
          
          // Fill the buffer with a simple sine wave
          for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
            const data = buffer.getChannelData(channel);
            const frequency = sound.key.includes('morning') ? 300 : 
                             sound.key.includes('afternoon') ? 220 : 
                             sound.key.includes('evening') ? 180 : 
                             sound.key.includes('tap') ? 600 : 
                             sound.key.includes('swipe') ? 400 : 
                             sound.key.includes('collect') ? 800 : 
                             sound.key.includes('success') ? 700 : 440;
            
            for (let i = 0; i < data.length; i++) {
              // Simple sine wave with decay
              const t = i / audioContextRef.current.sampleRate;
              const decay = Math.exp(-t * (sound.key.includes('interaction') ? 5 : 0.5));
              data[i] = Math.sin(frequency * t * Math.PI * 2) * decay * 0.5;
            }
          }
          
          audioBuffersRef.current.set(sound.key, buffer);
        } catch (error) {
          console.error(`Failed to load sound: ${sound.key}`, error);
        }
      }
    };
    
    preloadSounds();
  }, []);
  
  const playAmbientSound = useCallback((track?: AmbientTrack) => {
    if (isMuted || !audioContextRef.current || !gainNodeRef.current) return;
    
    // If audio context is suspended (e.g., from browser's autoplay policy), resume it
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    // Stop current ambient sound if playing
    if (ambientSourceRef.current) {
      fadeOutAndStop(ambientSourceRef.current, fadeOutDuration);
    }
    
    const trackToPlay = track || currentTrack;
    setCurrentTrack(trackToPlay);
    
    const buffer = audioBuffersRef.current.get(`ambient-${trackToPlay}`);
    if (!buffer) {
      console.warn(`Sound not found: ambient-${trackToPlay}`);
      return;
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    
    // Create a new gain node for this specific sound
    const soundGainNode = audioContextRef.current.createGain();
    soundGainNode.gain.value = 0; // Start silent
    
    // Connect the source to the sound-specific gain node, then to the main gain node
    source.connect(soundGainNode);
    soundGainNode.connect(gainNodeRef.current);
    
    // Fade in
    const now = audioContextRef.current.currentTime;
    soundGainNode.gain.setValueAtTime(0, now);
    soundGainNode.gain.linearRampToValueAtTime(
      currentVolume, 
      now + fadeInDuration / 1000
    );
    
    source.start();
    ambientSourceRef.current = source;
    
    return () => {
      fadeOutAndStop(source, fadeOutDuration);
    };
  }, [isMuted, currentTrack, currentVolume, fadeInDuration, fadeOutDuration]);
  
  const fadeOutAndStop = (source: AudioBufferSourceNode, duration: number) => {
    if (!audioContextRef.current) return;
    
    try {
      const now = audioContextRef.current.currentTime;
      // Find the gain node connected to this source
      const soundGainNode = source.connect.arguments[0];
      if (soundGainNode && 'gain' in soundGainNode) {
        soundGainNode.gain.setValueAtTime(soundGainNode.gain.value, now);
        soundGainNode.gain.linearRampToValueAtTime(0, now + duration / 1000);
        
        // Stop the source after fade out
        setTimeout(() => {
          try {
            source.stop();
          } catch (e) {
            // Source might already be stopped
          }
        }, duration);
      } else {
        source.stop();
      }
    } catch (error) {
      // Source might already be stopped
    }
  };
  
  const playInteractionSound = useCallback((type: InteractionSound) => {
    if (isMuted || !audioContextRef.current || !gainNodeRef.current) return;
    
    // If audio context is suspended (e.g., from browser's autoplay policy), resume it
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    const buffer = audioBuffersRef.current.get(`interaction-${type}`);
    if (!buffer) {
      // Fall back to a generic interaction sound
      const fallbackBuffer = audioBuffersRef.current.get('interaction-tap');
      if (!fallbackBuffer) {
        console.warn(`Sound not found: interaction-${type}`);
        return;
      }
    }
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer || audioBuffersRef.current.get('interaction-tap')!;
    
    const soundGainNode = audioContextRef.current.createGain();
    soundGainNode.gain.value = currentVolume * 0.8; // Slightly quieter than ambient sounds
    
    source.connect(soundGainNode);
    soundGainNode.connect(audioContextRef.current.destination);
    
    source.start();
    
    // Automatically disconnect after playing
    source.onended = () => {
      source.disconnect();
      soundGainNode.disconnect();
    };
  }, [isMuted, currentVolume]);
  
  const stopAllSounds = useCallback(() => {
    if (ambientSourceRef.current) {
      try {
        ambientSourceRef.current.stop();
      } catch (e) {
        // Source might already be stopped
      }
      ambientSourceRef.current = null;
    }
    
    // Reset gain to 0
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = 0;
    }
  }, []);
  
  const setVolume = useCallback((newVolume: number) => {
    setCurrentVolume(newVolume);
    
    if (gainNodeRef.current && !isMuted) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, [isMuted]);
  
  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      
      if (gainNodeRef.current) {
        if (newMuted) {
          // Fade out
          if (audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, now);
            gainNodeRef.current.gain.linearRampToValueAtTime(0, now + fadeOutDuration / 1000);
          } else {
            gainNodeRef.current.gain.value = 0;
          }
        } else {
          // Fade in
          if (audioContextRef.current) {
            const now = audioContextRef.current.currentTime;
            gainNodeRef.current.gain.setValueAtTime(0, now);
            gainNodeRef.current.gain.linearRampToValueAtTime(
              currentVolume, 
              now + fadeInDuration / 1000
            );
          } else {
            gainNodeRef.current.gain.value = currentVolume;
          }
          
          // If ambient sound was stopped, restart it
          if (!ambientSourceRef.current) {
            playAmbientSound();
          }
        }
      }
      
      return newMuted;
    });
  }, [currentVolume, fadeInDuration, fadeOutDuration, playAmbientSound]);
  
  // Since we're just creating a demo without actual audio files,
  // provide methods for simulating audio
  const simulateAudioLoad = useCallback((type: SoundType, name: string) => {
    const key = `${type}-${name}`;
    if (!audioBuffersRef.current.has(key) && audioContextRef.current) {
      // Create a fake audio buffer
      const buffer = audioContextRef.current.createBuffer(
        2,
        audioContextRef.current.sampleRate * 2,
        audioContextRef.current.sampleRate
      );
      
      // Fill with a simple tone
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const data = buffer.getChannelData(channel);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin(440 * i / audioContextRef.current.sampleRate * Math.PI * 2) * 0.5;
        }
      }
      
      audioBuffersRef.current.set(key, buffer);
      return true;
    }
    return false;
  }, []);
  
  return {
    playAmbientSound,
    playInteractionSound,
    stopAllSounds,
    setVolume,
    toggleMute,
    isMuted,
    currentTrack,
    currentVolume,
    simulateAudioLoad, // For demo purposes
  };
}
