
import React from 'react';

interface MagicWandProps {
  className?: string;
}

const MagicWand: React.FC<MagicWandProps> = ({ className = "h-16 w-16" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="wand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC72C" />
            <stop offset="100%" stopColor="#FFB100" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Wand handle */}
        <rect x="40" y="50" width="15" height="40" rx="3" ry="3" fill="#8A4B0A" />
        
        {/* Wand top */}
        <circle cx="48" cy="45" r="10" fill="url(#wand-gradient)" filter="url(#glow)" />
        
        {/* Stars/magic coming out */}
        <circle cx="48" cy="30" r="3" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "1.5s" }} />
        <circle cx="40" cy="35" r="2" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
        <circle cx="55" cy="33" r="2.5" fill="#FFFFFF" className="animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.6s" }} />
      </svg>
    </div>
  );
};

export default MagicWand;
