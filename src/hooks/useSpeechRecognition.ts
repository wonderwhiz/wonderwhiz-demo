
import { useRef, useEffect, useCallback } from 'react';

type UseSpeechRecognitionProps = {
  onTranscript: (transcript: string) => void;
  onListeningChange?: (listening: boolean) => void;
};

export function useSpeechRecognition({
  onTranscript,
  onListeningChange,
}: UseSpeechRecognitionProps) {
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onListeningChange?.(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.interimResults = false;
    recognitionRef.current.continuous = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: any) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      onTranscript(transcript.trim());
      onListeningChange?.(false);
    };
    recognitionRef.current.onend = () => {
      onListeningChange?.(false);
    };
    recognitionRef.current.onerror = () => {
      onListeningChange?.(false);
    };

    // Cleanup on unmount
    return () => {
      recognitionRef.current?.stop?.();
    };
  }, [onTranscript, onListeningChange]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onListeningChange?.(false);
      return false;
    }
    try {
      recognitionRef.current?.start();
      onListeningChange?.(true);
      return true;
    } catch (err) {
      onListeningChange?.(false);
      return false;
    }
  }, [onListeningChange]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    onListeningChange?.(false);
  }, [onListeningChange]);

  return { startListening, stopListening };
}
