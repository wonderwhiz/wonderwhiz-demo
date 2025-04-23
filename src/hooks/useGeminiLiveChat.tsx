
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
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;
  
  // Use the proper property names based on useElevenLabsVoice hook
  const { playText, isLoading: isVoiceLoading } = useElevenLabsVoice(); 
  
  // Store audio context and audio elements
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Initialize audio context
  useEffect(() => {
    const AudioContextAPI = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextAPI && !audioContextRef.current) {
      audioContextRef.current = new AudioContextAPI();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);
  
  // Reset error and retry count when session changes
  useEffect(() => {
    setError(null);
    setRetryCount(0);
  }, [sessionId]);
  
  // Send a message and get response with retry logic
  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || isProcessing) return null;
    
    setIsProcessing(true);
    setError(null); // Clear any previous errors
    
    try {
      // Add user message to chat history
      setChatHistory(prev => [...prev, { role: 'user', content: message }]);
      
      console.log('Sending message to Gemini Live Chat:', {
        message,
        childAge,
        curioContext,
        specialistId,
        sessionId
      });
      
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
      
      console.log('Received response:', data);
      
      // Check for empty or invalid response
      if (!data || (!data.text && !data.error)) {
        throw new Error('Received empty response from API');
      }
      
      // Handle API-reported errors
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Process and return response
      const responseText = data?.text || "I'm having trouble responding right now. Can we try again?";
      const newSessionId = data?.sessionId || null;
      
      setResponse(responseText);
      setSessionId(newSessionId);
      
      // Add model response to chat history
      setChatHistory(prev => [...prev, { role: 'model', content: responseText }]);
      
      // Reset retry count on success
      setRetryCount(0);
      
      // Play audio response using ElevenLabs
      if (responseText) {
        try {
          await playText(responseText, specialistId);
        } catch (audioError) {
          console.error('Error playing text to speech:', audioError);
          // Continue even if audio fails - text response is still available
        }
      }
      
      return {
        text: responseText,
        sessionId: newSessionId
      };
    } catch (error: any) {
      console.error('Error processing message:', error);
      
      // Set error state for UI feedback
      setError(error.message || 'Unable to process your message right now.');
      
      // Attempt retry if under max retries
      if (retryCount < MAX_RETRIES) {
        setRetryCount(prev => prev + 1);
        toast.info(`Having trouble connecting. Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
        
        // Add small delay before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return sendMessage(message);
      }
      
      // After max retries, show error toast and add fallback response
      toast.error('Unable to process your message right now.');
      
      // Add a fallback response to chat history
      const fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment.";
      setChatHistory(prev => [...prev, { role: 'model', content: fallbackResponse }]);
      setResponse(fallbackResponse);
      
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [childAge, curioContext, isProcessing, playText, retryCount, sessionId, specialistId, MAX_RETRIES]);
  
  // Reset chat
  const resetChat = useCallback(() => {
    setResponse('');
    setSessionId(null);
    setChatHistory([]);
    setError(null);
    setRetryCount(0);
  }, []);
  
  // Manually retry the last message
  const retryLastMessage = useCallback(() => {
    if (chatHistory.length > 0) {
      // Find the last user message
      for (let i = chatHistory.length - 1; i >= 0; i--) {
        if (chatHistory[i].role === 'user') {
          const lastUserMessage = chatHistory[i].content;
          
          // Remove the last message pair (user message and response or just user message)
          const newHistory = [...chatHistory];
          if (i < chatHistory.length - 1) {
            // If there's a response, remove both
            newHistory.splice(i, 2);
          } else {
            // If there's just a user message, remove it
            newHistory.splice(i, 1);
          }
          
          setChatHistory(newHistory);
          // Resend the message
          sendMessage(lastUserMessage);
          break;
        }
      }
    }
  }, [chatHistory, sendMessage]);
  
  return {
    sendMessage,
    resetChat,
    retryLastMessage,
    response,
    isProcessing,
    isVoiceLoading,
    chatHistory,
    sessionId,
    error,
    retryCount
  };
}
