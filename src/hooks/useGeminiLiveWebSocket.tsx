
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface UseGeminiLiveWebSocketProps {
  childAge?: number;
  curioContext?: string;
  specialistId?: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function useGeminiLiveWebSocket({
  childAge = 10,
  curioContext = '',
  specialistId = 'whizzy'
}: UseGeminiLiveWebSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const { playText, isLoading: isVoiceLoading } = useElevenLabsVoice({ voiceId: 'pkDwhVp7Wc7dQq2DBbpK' });
  
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // Connect to WebSocket
  const connect = useCallback(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }
    
    try {
      // Clear any existing reconnect timeouts
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Using hardcoded URL because we get an error with import.meta.env.VITE_SUPABASE_URL
      // The actual production URL will be:
      // wss://turexhnvsvmllwitllmg.functions.supabase.co/gemini-live
      const url = `wss://turexhnvsvmllwitllmg.functions.supabase.co/functions/v1/gemini-live?childAge=${childAge}&curioContext=${encodeURIComponent(curioContext)}&specialistId=${specialistId}`;
      
      console.log('Connecting to WebSocket:', url);
      
      const socket = new WebSocket(url);
      socketRef.current = socket;
      
      socket.onopen = () => {
        console.log('WebSocket connection established');
        setIsConnected(true);
        
        // Send setup message
        socket.send(JSON.stringify({
          type: 'setup'
        }));
      };
      
      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received WebSocket message:', data);
          
          if (data.error) {
            console.error('WebSocket error:', data.error);
            toast.error('Connection error: ' + data.error);
            return;
          }
          
          if (data.type === 'connection' && data.status === 'connected') {
            toast.success('Connected to AI assistant');
          } else if (data.type === 'text') {
            setResponse(data.text);
            setChatHistory(prev => [...prev, { role: 'model', content: data.text }]);
            
            // Play audio response using ElevenLabs
            try {
              await playText(data.text, specialistId);
            } catch (audioError) {
              console.error('Error playing text to speech:', audioError);
            }
            
            setIsProcessing(false);
          } else if (data.type === 'complete') {
            setIsProcessing(false);
          } else if (data.type === 'disconnected') {
            setIsConnected(false);
            toast.error('Disconnected from AI assistant');
            
            // Attempt to reconnect after a delay
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 3000) as unknown as number;
          }
        } catch (error) {
          console.error('Error processing WebSocket message:', error);
          setIsProcessing(false);
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Connection error');
        setIsConnected(false);
      };
      
      socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect after a delay if not closed cleanly
        if (event.code !== 1000) {
          toast.error('Connection closed. Reconnecting...');
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, 3000) as unknown as number;
        }
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      toast.error('Failed to connect to AI assistant');
      setIsConnected(false);
    }
  }, [childAge, curioContext, specialistId, playText]);
  
  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    setIsConnected(false);
  }, []);
  
  // Send message to WebSocket
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || isProcessing) {
        return null;
      }
      
      if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
        toast.error('Not connected to AI assistant');
        connect();
        return null;
      }
      
      setIsProcessing(true);
      
      try {
        // Add user message to chat history
        setChatHistory(prev => [...prev, { role: 'user', content: message }]);
        
        console.log('Sending message to WebSocket:', message);
        
        // Send message to WebSocket
        socketRef.current.send(
          JSON.stringify({
            type: 'message',
            text: message
          })
        );
        
        return {
          text: message
        };
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error('Failed to send message');
        setIsProcessing(false);
        return null;
      }
    },
    [isProcessing, connect]
  );
  
  // Reset chat history
  const resetChat = useCallback(() => {
    setChatHistory([]);
    setResponse('');
  }, []);
  
  // Connect and disconnect on mount/unmount
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    resetChat,
    response,
    isProcessing,
    isVoiceLoading,
    chatHistory
  };
}
