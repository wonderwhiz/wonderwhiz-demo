
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, StopCircle, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface EnhancedVoiceInputProps {
  onTranscript: (text: string) => void;
  isActive: boolean;
  onToggle: (isActive: boolean) => void;
  childAge?: number;
  isProcessing?: boolean;
}

const EnhancedVoiceInput: React.FC<EnhancedVoiceInputProps> = ({
  onTranscript,
  isActive,
  onToggle,
  childAge = 10,
  isProcessing = false
}) => {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognitionSupported, setRecognitionSupported] = useState<boolean>(true);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneStreamRef = useRef<MediaStream | null>(null);
  
  // Setup speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setRecognitionSupported(false);
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    
    recognition.onresult = (event: any) => {
      const result = event.results[event.results.length - 1];
      const text = result[0].transcript;
      setTranscript(text);
      
      // If final result, update transcript
      if (result.isFinal) {
        setTranscript(text);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // Ignore no-speech errors as they're common
        return;
      }
      
      toast.error('Voice recognition error', {
        description: event.error === 'not-allowed' 
          ? 'Microphone access denied. Please allow microphone access to use voice input.'
          : `Error: ${event.error}`,
      });
      
      setIsListening(false);
      onToggle(false);
    };
    
    recognition.onend = () => {
      if (isListening) {
        recognition.start();
      } else {
        setIsListening(false);
      }
    };
    
    recognitionRef.current = recognition;
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          // Ignore errors from stopping recognition that's not started
        }
      }
    };
  }, [onToggle]);
  
  // Setup audio visualization
  useEffect(() => {
    if (!isListening) {
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
        microphoneStreamRef.current = null;
      }
      return;
    }
    
    const setupAudioAnalysis = async () => {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        
        if (!AudioContext) return;
        
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        
        const microphoneStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        microphoneStreamRef.current = microphoneStream;
        
        const source = audioContextRef.current.createMediaStreamSource(microphoneStream);
        source.connect(analyserRef.current);
        
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateAudioLevel = () => {
          if (!analyserRef.current || !isListening) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate average frequency amplitude
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
          }
          const average = sum / bufferLength;
          
          // Scale to 0-100 for easier use
          const scaledLevel = Math.min(100, Math.max(0, average * 2));
          setAudioLevel(scaledLevel);
          
          if (isListening) {
            requestAnimationFrame(updateAudioLevel);
          }
        };
        
        updateAudioLevel();
      } catch (err) {
        console.error('Error accessing microphone for visualization:', err);
      }
    };
    
    setupAudioAnalysis();
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isListening]);
  
  const handleToggle = () => {
    if (!recognitionSupported) {
      toast.error('Speech recognition not supported', { 
        description: 'Your browser does not support voice input. Please try another browser.'
      });
      return;
    }
    
    if (isProcessing) {
      toast.info('Please wait', {
        description: 'Still processing your last question'
      });
      return;
    }
    
    const newState = !isListening;
    setIsListening(newState);
    onToggle(newState);
    
    if (newState) {
      setTranscript('');
      try {
        recognitionRef.current?.start();
        
        // Age-adaptive feedback
        if (childAge < 8) {
          toast.success('I\'m listening!', {
            description: 'Ask me anything you\'re curious about!'
          });
        }
      } catch (err) {
        console.error('Error starting speech recognition:', err);
      }
    } else {
      try {
        recognitionRef.current?.stop();
        
        // If we have a transcript, send it
        if (transcript.trim()) {
          onTranscript(transcript);
        }
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }
  };
  
  const handleSubmit = () => {
    if (transcript.trim()) {
      onTranscript(transcript);
      setIsListening(false);
      onToggle(false);
      
      try {
        recognitionRef.current?.stop();
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    } else {
      toast.info('No question detected', {
        description: 'Please try speaking again'
      });
    }
  };
  
  // Age-adaptive UI
  const getButtonSize = () => {
    if (childAge < 8) return 'h-16 w-16';
    if (childAge < 12) return 'h-14 w-14';
    return 'h-12 w-12';
  };
  
  return (
    <div className="fixed bottom-20 right-6 z-50">
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="bg-wonderwhiz-deep-purple/80 backdrop-blur-md p-4 rounded-lg mb-3 border border-white/10 shadow-xl"
          >
            <div className="mb-2">
              <p className="text-white text-sm font-medium">
                {transcript ? 'I heard:' : childAge < 8 ? 'Ask me anything!' : 'Listening...'}
              </p>
            </div>
            
            {transcript && (
              <div className="bg-white/10 rounded p-2 mb-3 max-w-[250px]">
                <p className="text-white text-sm break-words">{transcript}</p>
              </div>
            )}
            
            {/* Audio visualization */}
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-gold"
                style={{ width: `${audioLevel}%` }}
                animate={{ width: `${audioLevel}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/20 hover:bg-white/10 text-white"
                onClick={() => {
                  setIsListening(false);
                  onToggle(false);
                  setTranscript('');
                  
                  try {
                    recognitionRef.current?.stop();
                  } catch (err) {
                    console.error('Error canceling speech recognition:', err);
                  }
                }}
              >
                <MicOff className="h-4 w-4 mr-1" />
                <span>Cancel</span>
              </Button>
              
              <Button
                size="sm"
                className="flex-1 bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80"
                onClick={handleSubmit}
                disabled={!transcript.trim()}
              >
                <Wand2 className="h-4 w-4 mr-1" />
                <span>Ask</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <motion.button
        className={`${getButtonSize()} rounded-full flex items-center justify-center shadow-lg ${
          isListening 
            ? 'bg-wonderwhiz-bright-pink' 
            : 'bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-bright-pink hover:shadow-wonderwhiz-bright-pink/20'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
      >
        {isListening ? (
          <StopCircle className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
};

export default EnhancedVoiceInput;
