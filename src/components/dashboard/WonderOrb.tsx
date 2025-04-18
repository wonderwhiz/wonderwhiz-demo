
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface WonderOrbProps {
  isExpanding: boolean;
  query: string;
  onComplete: () => void;
}

const WonderOrb: React.FC<WonderOrbProps> = ({ isExpanding, query, onComplete }) => {
  const [expandPhase, setExpandPhase] = useState<'initial' | 'expanding' | 'pulse' | 'complete'>('initial');
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, size: number, color: string}>>([]);
  
  useEffect(() => {
    if (isExpanding) {
      setExpandPhase('expanding');
      
      // Create random particles
      const newParticles = Array(20).fill(0).map((_, i) => ({
        id: i,
        x: Math.random() * 360 - 180,
        y: Math.random() * 360 - 180,
        size: Math.random() * 8 + 4,
        color: `hsl(${Math.random() * 60 + 280}, 80%, 70%)`
      }));
      
      setParticles(newParticles);
      
      const timer1 = setTimeout(() => {
        setExpandPhase('pulse');
      }, 2000);
      
      const timer2 = setTimeout(() => {
        setExpandPhase('complete');
      }, 4000);
      
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setExpandPhase('initial');
    }
  }, [isExpanding]);
  
  useEffect(() => {
    if (expandPhase === 'complete') {
      const timer = setTimeout(() => {
        onComplete();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [expandPhase, onComplete]);

  return (
    <div className="relative flex items-center justify-center flex-col">
      <motion.div
        className="relative"
        initial={{ scale: 1 }}
        animate={{ 
          scale: expandPhase === 'initial' ? 1 : 
                 expandPhase === 'expanding' ? 1.5 :
                 expandPhase === 'pulse' ? 1.8 :
                 2
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-1000 ${
          expandPhase === 'initial' ? 'bg-wonderwhiz-bright-pink/30 scale-110' : 
          expandPhase === 'expanding' ? 'bg-wonderwhiz-bright-pink/50 scale-150' :
          expandPhase === 'pulse' ? 'bg-wonderwhiz-bright-pink/70 scale-[1.8]' :
          'bg-wonderwhiz-vibrant-yellow/70 scale-[2.2]'
        }`} />
        
        {/* Main orb */}
        <motion.div
          className={`relative w-40 h-40 rounded-full flex items-center justify-center overflow-hidden ${
            expandPhase === 'initial' ? 'bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow' :
            expandPhase === 'expanding' ? 'bg-gradient-to-br from-wonderwhiz-bright-pink to-indigo-600' :
            expandPhase === 'pulse' ? 'bg-gradient-to-br from-indigo-600 to-purple-700' :
            'bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-cyan'
          }`}
          animate={{
            rotate: expandPhase !== 'initial' ? [0, 360] : 0
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 20, ease: "linear" },
          }}
        >
          {/* Inner patterns */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-white/40" />
            <div className="absolute bottom-1/3 right-1/4 w-1/3 h-1/3 rounded-full bg-white/30" />
            <div className="absolute top-1/3 right-1/4 w-1/4 h-1/4 rounded-full bg-white/30" />
          </div>
          
          {/* Center content */}
          <div className="relative z-10 text-white text-center p-4">
            {expandPhase === 'initial' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <Sparkles className="h-8 w-8 mb-1" />
                <span className="text-sm font-bold">Tap to explore</span>
              </motion.div>
            )}
            
            {expandPhase === 'expanding' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className="text-sm font-bold">Creating...</span>
              </motion.div>
            )}
            
            {expandPhase === 'pulse' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-xs mb-1">Exploring</span>
                <span className="text-base font-bold line-clamp-2">{query}</span>
              </motion.div>
            )}
            
            {expandPhase === 'complete' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center"
              >
                <span className="text-sm font-bold">Ready!</span>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color
            }}
            animate={{ 
              x: expandPhase === 'expanding' ? particle.x * 0.5 :
                 expandPhase === 'pulse' ? particle.x :
                 expandPhase === 'complete' ? 0 : 0,
              y: expandPhase === 'expanding' ? particle.y * 0.5 :
                 expandPhase === 'pulse' ? particle.y :
                 expandPhase === 'complete' ? 0 : 0,
              opacity: expandPhase === 'initial' ? 0 :
                       expandPhase === 'expanding' ? 0.8 :
                       expandPhase === 'pulse' ? 0.6 :
                       0
            }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
      
      <motion.div
        className="mt-8 text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: expandPhase === 'initial' ? 0 : 1,
          y: expandPhase === 'initial' ? 20 : 0
        }}
        transition={{ duration: 0.5 }}
      >
        {expandPhase === 'expanding' && (
          <p className="animate-pulse">Gathering wonder...</p>
        )}
        
        {expandPhase === 'pulse' && (
          <p>Creating your adventure</p>
        )}
        
        {expandPhase === 'complete' && (
          <p>Adventure ready!</p>
        )}
      </motion.div>
    </div>
  );
};

export default WonderOrb;
