
import React from 'react';
import { motion } from 'framer-motion';

const DashboardParticles: React.FC = () => {
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
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles}
    </div>
  );
};

export default DashboardParticles;
