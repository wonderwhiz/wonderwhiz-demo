
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WonderOrb from './WonderOrb';
import GestureHandler from './GestureHandler';
import { toast } from 'sonner';
import { useChildProfile } from '@/hooks/use-child-profile';

interface WonderCanvasProps {
  childId: string;
  onSearch: (query: string) => void;
  onVoiceInput: (transcript: string) => void;
  children: React.ReactNode;
}

const WonderCanvas: React.FC<WonderCanvasProps> = ({
  childId,
  onSearch,
  onVoiceInput,
  children
}) => {
  const [isListening, setIsListening] = useState(false);
  const { childProfile } = useChildProfile(childId);
  const childAge = childProfile?.age ? Number(childProfile.age) : 10;

  const handleVoiceInput = async (transcript: string) => {
    setIsListening(true);
    try {
      await onVoiceInput(transcript);
    } finally {
      setIsListening(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    // Add swipe animations and navigation logic here
    toast.info(`Swiped ${direction}`);
  };

  const handlePinch = (scale: number) => {
    // Add pinch animation and logic here
    console.log('Pinch scale:', scale);
  };

  const handleSpread = (scale: number) => {
    // Add spread animation and logic here
    console.log('Spread scale:', scale);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-light-purple">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'url("/patterns/wonder-pattern.svg")',
          backgroundSize: '100% 100%',
        }}
      />
      
      {/* Gesture handler */}
      <GestureHandler
        onSwipe={handleSwipe}
        onPinch={handlePinch}
        onSpread={handleSpread}
      >
        {/* Main content */}
        <motion.div className="relative z-10 w-full h-full">
          {children}
        </motion.div>

        {/* Wonder Orb */}
        <WonderOrb
          onSearch={onSearch}
          onVoiceInput={handleVoiceInput}
          childAge={childAge}
          isListening={isListening}
        />
      </GestureHandler>
    </div>
  );
};

export default WonderCanvas;
