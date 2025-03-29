
import React from 'react';

interface WonderWhizLogoProps {
  className?: string;
}

const WonderWhizLogo: React.FC<WonderWhizLogoProps> = ({ className = "h-12 w-12" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* The wizard hat */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="hat-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A38E8" />
            <stop offset="100%" stopColor="#7E30E1" />
          </linearGradient>
        </defs>
        
        {/* Hat base */}
        <path d="M50,10 C60,10 80,15 85,50 C90,85 10,85 15,50 C20,15 40,10 50,10 Z" 
              fill="url(#hat-gradient)" />
              
        {/* Hat rim */}
        <path d="M15,50 C10,85 90,85 85,50 C80,87 20,87 15,50 Z" 
              fill="#6825BC" />
              
        {/* Star */}
        <path d="M50,25 L53,35 L63,35 L55,42 L58,52 L50,46 L42,52 L45,42 L37,35 L47,35 Z" 
              fill="#FFC72C" />
      </svg>
      
      {/* Sparkles */}
      <div className="absolute -top-2 -left-2 h-4 w-4">
        <svg viewBox="0 0 24 24" className="w-full h-full animate-sparkle">
          <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FF5EBA" />
        </svg>
      </div>
      
      <div className="absolute -top-1 -right-1 h-3 w-3">
        <svg viewBox="0 0 24 24" className="w-full h-full animate-sparkle" style={{ animationDelay: "0.5s" }}>
          <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FF5EBA" />
        </svg>
      </div>
    </div>
  );
};

export default WonderWhizLogo;
