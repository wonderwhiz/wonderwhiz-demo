
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
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Wand handle */}
        <rect x="40" y="55" width="15" height="35" rx="7.5" ry="7.5" fill="#8A4B0A" />
        
        {/* Wand top */}
        <circle cx="48" cy="45" r="12" fill="url(#wand-gradient)" filter="url(#glow)" />
        
        {/* Stars/magic coming out */}
        <path d="M48,25 L50,30 L55,30 L51,33 L53,38 L48,35 L43,38 L45,33 L41,30 L46,30 Z" 
              fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "1.5s" }} />
        <path d="M35,35 L36,38 L39,38 L37,40 L38,43 L35,41 L32,43 L33,40 L31,38 L34,38 Z" 
              fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "2s", animationDelay: "0.3s" }} />
        <path d="M60,33 L61,36 L64,36 L62,38 L63,41 L60,39 L57,41 L58,38 L56,36 L59,36 Z" 
              fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "1.8s", animationDelay: "0.6s" }} />
      </svg>
    </div>
  );
};

export default MagicWand;
