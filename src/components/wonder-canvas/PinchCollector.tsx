
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Star, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface PinchCollectorProps {
  onPinchCollect: (amount: number) => void;
  childAge?: number;
  enabled?: boolean;
  className?: string;
}

const PinchCollector: React.FC<PinchCollectorProps> = ({ 
  onPinchCollect, 
  childAge = 10,
  enabled = true,
  className = ''
}) => {
  const [pinchStartDistance, setPinchStartDistance] = useState<number | null>(null);
  const [pinchProgress, setPinchProgress] = useState(0);
  const [collectAmount, setCollectAmount] = useState(0);
  const [collectedVisible, setCollectedVisible] = useState(false);
  const [touchPoints, setTouchPoints] = useState<{ x: number, y: number }[]>([]);
  
  const collectedControls = useAnimation();
  
  // Reset pinch progress when component is mounted/unmounted
  useEffect(() => {
    setPinchProgress(0);
    return () => setPinchProgress(0);
  }, []);
  
  useEffect(() => {
    if (collectAmount > 0) {
      setCollectedVisible(true);
      
      collectedControls.start({
        y: -50,
        opacity: [0, 1, 0],
        scale: [0.8, 1.2, 0.8],
        transition: { duration: 1.5 }
      });
      
      const timer = setTimeout(() => {
        setCollectedVisible(false);
        setCollectAmount(0);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [collectAmount, collectedControls]);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled || e.touches.length !== 2) return;
    
    // Calculate initial pinch distance
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    setPinchStartDistance(distance);
    setTouchPoints([
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    ]);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enabled || e.touches.length !== 2 || pinchStartDistance === null) return;
    
    // Calculate current pinch distance
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    // Calculate pinch progress (0-1)
    // Pinching in reduces distance
    const progress = Math.max(0, Math.min(1, (pinchStartDistance - currentDistance) / (pinchStartDistance * 0.5)));
    
    setPinchProgress(progress);
    setTouchPoints([
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    ]);
    
    // If pinch is complete, collect sparks
    if (progress >= 1) {
      const amount = Math.floor(Math.random() * 3) + 1; // 1-3 sparks
      setCollectAmount(amount);
      onPinchCollect(amount);
      
      // Show toast message appropriate for age
      if (childAge < 8) {
        toast.success(`You collected ${amount} sparks!`, {
          icon: '✨',
          position: 'top-center'
        });
      } else {
        toast.success(`Collected ${amount} knowledge sparks!`, {
          icon: '⚡',
          position: 'top-center'
        });
      }
      
      // Reset pinch
      setPinchStartDistance(null);
      setPinchProgress(0);
    }
  };
  
  const handleTouchEnd = () => {
    setPinchStartDistance(null);
    setPinchProgress(0);
    setTouchPoints([]);
  };
  
  // Render connecting line between touch points
  const renderTouchConnector = () => {
    if (touchPoints.length !== 2) return null;
    
    const [p1, p2] = touchPoints;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    
    // Calculate angle for line
    const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
    const distance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    
    return (
      <div 
        className="fixed pointer-events-none z-50"
        style={{
          left: midX,
          top: midY,
          width: distance,
          height: 2,
          backgroundColor: `rgba(255, 255, 255, ${0.3 + pinchProgress * 0.7})`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          boxShadow: `0 0 ${5 + pinchProgress * 15}px rgba(255, 215, 0, ${pinchProgress * 0.5})`,
          opacity: pinchProgress
        }}
      />
    );
  };
  
  // Render touch points
  const renderTouchPoints = () => {
    return touchPoints.map((point, index) => (
      <div 
        key={index}
        className="fixed rounded-full pointer-events-none z-50"
        style={{
          left: point.x,
          top: point.y,
          width: 20 + pinchProgress * 10,
          height: 20 + pinchProgress * 10,
          backgroundColor: `rgba(255, 255, 255, ${0.2 + pinchProgress * 0.3})`,
          border: `2px solid rgba(255, 255, 255, ${0.5 + pinchProgress * 0.5})`,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${5 + pinchProgress * 15}px rgba(255, 215, 0, ${pinchProgress * 0.5})`
        }}
      />
    ));
  };
  
  return (
    <div 
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual indication for pinch */}
      {pinchProgress > 0 && (
        <>
          {renderTouchConnector()}
          {renderTouchPoints()}
        </>
      )}
      
      {/* Collected animation */}
      {collectedVisible && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none flex items-center"
          animate={collectedControls}
        >
          <Sparkles className="text-wonderwhiz-vibrant-yellow h-5 w-5 mr-1.5" />
          <span className="text-white font-bold text-xl">+{collectAmount}</span>
        </motion.div>
      )}
      
      {/* Helper indicator for young children */}
      {enabled && childAge <= 7 && (
        <motion.div
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 5
          }}
        >
          <div className="flex items-center justify-center mb-1">
            <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow animate-pulse mr-1" />
            <span>Pinch to collect sparks</span>
            <Star className="h-4 w-4 text-wonderwhiz-vibrant-yellow animate-pulse ml-1" />
          </div>
          <div className="flex justify-center">
            <motion.div 
              className="relative w-12 h-8 opacity-70"
              animate={{
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <div className="absolute top-0 left-0 h-4 w-4 rounded-full border-2 border-white" />
              <div className="absolute top-0 right-0 h-4 w-4 rounded-full border-2 border-white" />
              <motion.div 
                className="absolute left-1/2 top-2 h-0.5 bg-white"
                animate={{ width: ['80%', '20%', '80%'] }}
                style={{ translateX: '-50%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PinchCollector;
