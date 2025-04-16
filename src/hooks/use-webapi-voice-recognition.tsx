
import { useState, useEffect, useCallback } from 'react';

interface VoiceRecognitionHook {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
  error: string | null;
  isSupported: boolean;
}

export function useWebApiVoiceRecognition(): VoiceRecognitionHook {
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  // Initialize speech recognition
  useEffect(() => {
    // Check if browser supports Speech Recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      
      setRecognition(recognitionInstance);
      setIsSupported(true);
      
      return () => {
        // Cleanup
        if (recognitionInstance) {
          recognitionInstance.onresult = null;
          recognitionInstance.onend = null;
          recognitionInstance.onerror = null;
          if (isListening) {
            try {
              recognitionInstance.stop();
            } catch (e) {
              console.log('Error stopping recognition on cleanup:', e);
            }
          }
        }
      };
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser.');
    }
  }, []);

  // Set up event handlers
  useEffect(() => {
    if (!recognition) return;
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let currentTranscript = '';
      
      // Get the latest result
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      
      setTranscript(currentTranscript);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setError(event.error);
      setIsListening(false);
    };
  }, [recognition]);

  const startListening = useCallback(() => {
    if (!recognition) return;
    setError(null);
    
    try {
      recognition.start();
      setIsListening(true);
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setError('Could not start listening. Please try again.');
    }
  }, [recognition]);

  const stopListening = useCallback(() => {
    if (!recognition) return;
    
    try {
      recognition.stop();
      setIsListening(false);
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  }, [recognition]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error,
    isSupported
  };
}
