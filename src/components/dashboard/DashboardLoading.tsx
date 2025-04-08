
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import WonderWhizLogo from '@/components/WonderWhizLogo';

interface DashboardLoadingProps {
  onFinish?: () => void;
}

const DashboardLoading: React.FC<DashboardLoadingProps> = ({ onFinish }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const loadingTexts = [
    "Gathering stars...",
    "Finding dinosaurs...", 
    "Mixing potions...",
    "Waking up robots...",
    "Chasing comets..."
  ];
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);
  
  // Simulate a loading sequence
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15;
        if (next >= 100) {
          clearInterval(interval);
          if (onFinish) setTimeout(onFinish, 200);
          return 100;
        }
        return next;
      });
      
      setLoadingText(loadingTexts[Math.floor(Math.random() * loadingTexts.length)]);
    }, 700);
    
    return () => clearInterval(interval);
  }, [onFinish]);

  // Magical particles floating animation
  const particles = Array.from({ length: 15 }).map((_, i) => (
    <motion.div
      key={i}
      className="absolute w-2 h-2 rounded-full bg-wonderwhiz-gold/40"
      initial={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        opacity: 0
      }}
      animate={{ 
        x: Math.random() * window.innerWidth, 
        y: Math.random() * window.innerHeight,
        opacity: [0, 0.5, 0],
        scale: [0.5, 1, 0.5]
      }}
      transition={{ 
        repeat: Infinity, 
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 5
      }}
    />
  ));

  return (
    <div className="min-h-screen bg-wonderwhiz-gradient flex flex-col items-center justify-center relative overflow-hidden">
      {/* Magical particles */}
      {particles}
      
      <motion.div
        className="mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <WonderWhizLogo className="h-16 w-16" />
      </motion.div>
      
      <motion.div 
        className="w-64 h-4 bg-white/10 rounded-full overflow-hidden mb-4"
        initial={{ width: 0 }}
        animate={{ width: "16rem" }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <motion.div 
          className="h-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow"
          style={{ width: `${loadingProgress}%` }}
        />
      </motion.div>
      
      <motion.p 
        className="text-white text-lg font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {loadingText}
      </motion.p>
      
      <div className="mt-16 flex flex-wrap justify-center gap-4">
        {['🚀', '🌈', '✨', '🔮', '🌟'].map((emoji, i) => (
          <motion.div
            key={i}
            className="text-3xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              delay: 1 + (i * 0.2),
              duration: 0.8,
              rotate: {
                repeat: Infinity,
                duration: 2,
                delay: 2 + (i * 0.5),
                repeatType: "reverse"
              }
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardLoading;
