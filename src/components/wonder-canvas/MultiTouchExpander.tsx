
import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { toast } from 'sonner';

interface MultiTouchExpanderProps {
  onExpand: () => void;
  childAge?: number;
  enabled?: boolean;
  className?: string;
}

const MultiTouchExpander: React.FC<MultiTouchExpanderProps> = ({
  onExpand,
  childAge = 10,
  enabled = true,
  className = ''
}) => {
  const [spreadStartDistance, setSpreadStartDistance] = useState<number | null>(null);
  const [spreadProgress, setSpreadProgress] = useState(0);
  const [touchPoints, setTouchPoints] = useState<{ x: number, y: number }[]>([]);
  const [recentlyExpanded, setRecentlyExpanded] = useState(false);
  
  const expandControls = useAnimation();
  
  // Reset spread progress when component is mounted/unmounted
  useEffect(() => {
    setSpreadProgress(0);
    return () => setSpreadProgress(0);
  }, []);
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enabled || e.touches.length !== 2 || recentlyExpanded) return;
    
    // Calculate initial spread distance
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    setSpreadStartDistance(distance);
    setTouchPoints([
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    ]);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enabled || e.touches.length !== 2 || spreadStartDistance === null || recentlyExpanded) return;
    
    // Calculate current spread distance
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    
    const currentDistance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
    
    // Calculate spread progress (0-1)
    // Spreading out increases distance
    const progress = Math.max(0, Math.min(1, (currentDistance - spreadStartDistance) / (spreadStartDistance * 0.5)));
    
    setSpreadProgress(progress);
    setTouchPoints([
      { x: touch1.clientX, y: touch1.clientY },
      { x: touch2.clientX, y: touch2.clientY }
    ]);
    
    // If spread is complete, expand topic
    if (progress >= 1) {
      // Create visual expansion effect
      expandControls.start({
        opacity: [0, 0.8, 0],
        scale: [1, 1.5, 2],
        transition: { duration: 0.8 }
      });
      
      // Call the expand handler
      onExpand();
      
      // Show toast message appropriate for age
      if (childAge < 8) {
        toast.success("Topic expanded! Let's explore more!", {
          icon: '🔍',
          position: 'top-center'
        });
      } else {
        toast.success("Topic expanded with new details", {
          icon: '🔍',
          position: 'top-center'
        });
      }
      
      // Reset spread
      setSpreadStartDistance(null);
      setSpreadProgress(0);
      
      // Set cooldown to prevent accidental multiple expansions
      setRecentlyExpanded(true);
      setTimeout(() => setRecentlyExpanded(false), 1500);
    }
  };
  
  const handleTouchEnd = () => {
    setSpreadStartDistance(null);
    setSpreadProgress(0);
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
          backgroundColor: `rgba(255, 255, 255, ${0.3 + spreadProgress * 0.7})`,
          transform: `translate(-50%, -50%) rotate(${angle}deg)`,
          boxShadow: `0 0 ${5 + spreadProgress * 15}px rgba(100, 200, 255, ${spreadProgress * 0.5})`,
          opacity: spreadProgress
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
          width: 20 + spreadProgress * 10,
          height: 20 + spreadProgress * 10,
          backgroundColor: `rgba(255, 255, 255, ${0.2 + spreadProgress * 0.3})`,
          border: `2px solid rgba(255, 255, 255, ${0.5 + spreadProgress * 0.5})`,
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${5 + spreadProgress * 15}px rgba(100, 200, 255, ${spreadProgress * 0.5})`
        }}
      />
    ));
  };
  
  // Render expansion effect
  const renderExpansionEffect = () => {
    if (touchPoints.length !== 2) return null;
    
    const [p1, p2] = touchPoints;
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;
    
    return (
      <motion.div
        className="fixed rounded-full pointer-events-none z-40 bg-blue-500/20"
        style={{
          left: midX,
          top: midY,
          width: 100,
          height: 100,
          transform: 'translate(-50%, -50%)'
        }}
        animate={expandControls}
      />
    );
  };
  
  return (
    <div 
      className={`relative ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Visual indication for spread */}
      {spreadProgress > 0 && (
        <>
          {renderTouchConnector()}
          {renderTouchPoints()}
          {renderExpansionEffect()}
        </>
      )}
      
      {/* Helper indicator for young children */}
      {enabled && childAge <= 7 && (
        <motion.div
          className="fixed bottom-32 left-1/2 transform -translate-x-1/2 text-white/70 text-sm text-center z-40 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
            repeatDelay: 7
          }}
        >
          <div className="flex items-center justify-center mb-1">
            <span>Spread fingers to expand topics</span>
          </div>
          <div className="flex justify-center">
            <motion.div 
              className="relative w-12 h-8 opacity-70"
              animate={{
                scale: [1, 1.2, 1]
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
                animate={{ width: ['20%', '80%', '20%'] }}
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

export default MultiTouchExpander;
