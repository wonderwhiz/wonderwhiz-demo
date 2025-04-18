
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceVisualizerProps {
  isActive: boolean;
  transcript: string;
  colorScheme?: 'morning' | 'afternoon' | 'evening';
  maxBars?: number;
  sensitivity?: number;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  isActive,
  transcript,
  colorScheme = 'afternoon',
  maxBars = 32,
  sensitivity = 1.2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  
  // Get color based on time of day
  const getColor = () => {
    switch (colorScheme) {
      case 'morning':
        return { primary: '#f59e0b', secondary: '#f97316' };
      case 'evening':
        return { primary: '#8b5cf6', secondary: '#7c3aed' };
      case 'afternoon':
      default:
        return { primary: '#06b6d4', secondary: '#0ea5e9' };
    }
  };
  
  const { primary, secondary } = getColor();
  
  // Set up audio visualization
  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }
    
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let microphone: MediaStreamAudioSourceNode;
    
    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);
        
        microphone.connect(analyser);
        analyserRef.current = analyser;
        
        visualize();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };
    
    const visualize = () => {
      if (!canvasRef.current || !analyserRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Calculate the width of each bar with spacing
      const barSpacing = 2;
      const usableWidth = width - (maxBars - 1) * barSpacing;
      const barWidth = usableWidth / maxBars;
      
      // Create a gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, primary);
      gradient.addColorStop(1, secondary);
      
      // Draw bars
      for (let i = 0; i < maxBars; i++) {
        // Get frequency data - we'll sample across the spectrum
        const index = Math.floor(i * (dataArray.length / maxBars));
        let value = dataArray[index];
        
        // Apply sensitivity multiplier
        value = value * sensitivity;
        
        // Calculate bar height (clamp to canvas height)
        const barHeight = Math.min((value / 255) * height, height);
        
        // Center the bars in the canvas
        const x = i * (barWidth + barSpacing);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        // Add a bit of 3D effect with a highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x, height - barHeight, barWidth, 2);
      }
      
      animationRef.current = requestAnimationFrame(visualize);
    };
    
    initAudio();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (microphone) {
        microphone.disconnect();
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isActive, maxBars, primary, secondary, sensitivity]);
  
  // Simulate audio input for demo purposes
  useEffect(() => {
    if (!isActive || analyserRef.current) return;
    
    // If we don't have real microphone access, simulate audio data
    const simulateAudio = () => {
      if (!canvasRef.current) return;
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      // Calculate the width of each bar with spacing
      const barSpacing = 2;
      const usableWidth = width - (maxBars - 1) * barSpacing;
      const barWidth = usableWidth / maxBars;
      
      // Create a gradient
      const gradient = ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, primary);
      gradient.addColorStop(1, secondary);
      
      // Simulate mic levels
      for (let i = 0; i < maxBars; i++) {
        // Create sine wave pattern with some randomness
        const now = Date.now() / 1000;
        const wave1 = Math.sin(now * 4 + i * 0.2) * 0.5 + 0.5;
        const wave2 = Math.sin(now * 2.5 + i * 0.3) * 0.5 + 0.5;
        const value = (wave1 + wave2) / 2 * 180 + Math.random() * 20;
        
        // Apply sensitivity multiplier
        const adjustedValue = value * sensitivity;
        
        // Calculate bar height (clamp to canvas height)
        const barHeight = Math.min((adjustedValue / 255) * height, height);
        
        // Center the bars in the canvas
        const x = i * (barWidth + barSpacing);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        
        // Add a bit of 3D effect with a highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(x, height - barHeight, barWidth, 2);
      }
      
      animationRef.current = requestAnimationFrame(simulateAudio);
    };
    
    simulateAudio();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, maxBars, primary, secondary, sensitivity]);
  
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-40 pointer-events-none"
        >
          <div className="bg-black/60 backdrop-blur-lg p-8 rounded-3xl max-w-md w-full">
            <div className="flex flex-col items-center">
              <div className="w-full h-32 mb-4">
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={100} 
                  className="w-full h-full"
                />
              </div>
              
              <div className="bg-black/40 rounded-2xl p-4 w-full mb-4">
                <p className="text-white text-center">
                  {transcript || "Listening..."}
                </p>
              </div>
              
              <div className="flex gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-white/80"
                    animate={{
                      opacity: [0.4, 1, 0.4],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.2
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceVisualizer;
