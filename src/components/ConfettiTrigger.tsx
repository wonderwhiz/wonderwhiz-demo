
import React, { useState } from 'react';
import ParticleEffect from './ParticleEffect';

interface ConfettiTriggerProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
}

const ConfettiTrigger: React.FC<ConfettiTriggerProps> = ({ 
  children, 
  intensity = 'high',
  duration = 3000
}) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), duration);
  };
  
  return (
    <div 
      onClick={triggerConfetti}
      className="inline-block"
    >
      {showConfetti && (
        <ParticleEffect 
          type="confetti" 
          intensity={intensity} 
          triggerAnimation={true} 
        />
      )}
      {children}
    </div>
  );
};

export default ConfettiTrigger;
