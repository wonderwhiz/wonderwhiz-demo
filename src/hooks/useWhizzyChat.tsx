
import { useState, useCallback } from 'react';
import { useWebApiVoiceRecognition } from './use-webapi-voice-recognition';
import { useElevenLabsVoice } from './useElevenLabsVoice';
import { useGeminiLiveChat } from './useGeminiLiveChat';
import { toast } from 'sonner';

interface UseWhizzyChatOptions {
  childAge?: number;
  curioContext?: string;
  onNewQuestionGenerated?: (question: string) => void;
}

export function useWhizzyChat({
  childAge = 10,
  curioContext,
  onNewQuestionGenerated
}: UseWhizzyChatOptions = {}) {
  const [isMuted, setIsMuted] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    error: voiceError,
    isSupported: voiceSupported
  } = useWebApiVoiceRecognition();

  const {
    sendMessage,
    resetChat,
    response,
    isProcessing,
    isVoiceLoading,
    chatHistory
  } = useGeminiLiveChat({
    childAge,
    curioContext,
    specialistId: 'whizzy'
  });

  const { playText, stopPlaying } = useElevenLabsVoice({
    voiceId: 'whizzy'
  });

  const toggleMute = useCallback(() => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopPlaying();
    }
  }, [isMuted, stopPlaying]);

  const toggleVoice = useCallback(async () => {
    if (isListening) {
      stopListening();
      if (transcript) {
        const result = await sendMessage(transcript);
        resetTranscript();
        
        if (result && transcript.length > 10 && onNewQuestionGenerated) {
          setTimeout(() => {
            onNewQuestionGenerated(transcript);
          }, 5000);
        }
      }
    } else {
      if (!voiceSupported) {
        toast.error('Voice input is not supported in your browser');
        return;
      }
      resetTranscript();
      startListening();
    }
  }, [isListening, transcript, sendMessage, stopListening, startListening, resetTranscript, voiceSupported, onNewQuestionGenerated]);

  return {
    isMuted,
    toggleMute,
    isListening,
    transcript,
    toggleVoice,
    isProcessing: isProcessing || isVoiceLoading,
    chatHistory,
    voiceError,
    voiceSupported
  };
}
