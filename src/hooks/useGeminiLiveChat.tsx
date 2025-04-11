
import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface UseGeminiLiveChatProps {
  childAge?: number;
  curioContext?: string;
  specialistId?: string;
}

export function useGeminiLiveChat({
  childAge = 10,
  curioContext = '',
  specialistId = 'whizzy'
}: UseGeminiLiveChatProps = {}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model', content: string }>>([]);
  const { playText, isLoading: isVoiceLoading } = useElevenLabsVoice({ voiceId: 'pkDwhVp7Wc7dQq2DBbpK' });
  
  // Store audio context and audio elements
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  
  // Initialize audio context
  useEffect(() => {
    const AudioContextAPI = window.AudioContext || window.webkitAudioContext;
    if (AudioContextAPI && !audioContextRef.current) {
      audioContextRef.current = new AudioContextAPI();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Send a message and get response
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isProcessing) return null;
    
    setIsProcessing(true);
    
    try {
      // Add user message to chat history
      setChatHistory(prev => [...prev, { role: 'user', content: message }]);
      
      // Call edge function
      const { data, error } = await supabase.functions.invoke('gemini-live-chat', {
        body: {
          message,
          childAge,
          curioContext,
          specialistId,
          sessionId
        }
      });
      
      if (error) throw error;
      
      // Process and return response
      const responseText = data?.text || "I'm having trouble responding right now. Can we try again?";
      const newSessionId = data?.sessionId || null;
      
      setResponse(responseText);
      setSessionId(newSessionId);
      
      // Add model response to chat history
      setChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
      
      // Play audio response using ElevenLabs (temporary until WebSocket implementation)
      playText(responseText, specialistId);
      
      return {
        text: responseText,
        sessionId: newSessionId
      };
    } catch (error) {
      console.error('Error processing message:', error);
      toast.error('Unable to process your message right now.');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [childAge, curioContext, isProcessing, playText, sessionId, specialistId]);
  
  // Reset chat
  const resetChat = useCallback(() => {
    setResponse('');
    setSessionId(null);
    setChatHistory([]);
    
    // Stop any playing audio
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
  }, []);
  
  return {
    sendMessage,
    resetChat,
    response,
    isProcessing,
    isVoiceLoading,
    chatHistory,
    sessionId
  };
}
