
import React, { useState } from 'react';
import ParticleEffect from './ParticleEffect';

interface ConfettiTriggerProps {
  children: React.ReactNode;
}

const ConfettiTrigger: React.FC<ConfettiTriggerProps> = ({ children }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };
  
  return (
    <div onClick={triggerConfetti}>
      {showConfetti && <ParticleEffect type="confetti" intensity="high" triggerAnimation={true} />}
      {children}
    </div>
  );
};

export default ConfettiTrigger;
