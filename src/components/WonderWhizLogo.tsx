
import React, { useState } from 'react';

interface WonderWhizLogoProps {
  className?: string;
}

const WonderWhizLogo: React.FC<WonderWhizLogoProps> = ({ className = "h-12 w-12" }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative ${className} cursor-pointer`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The wizard hat */}
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="hat-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8A38E8" />
            <stop offset="100%" stopColor="#7E30E1" />
          </linearGradient>
          <filter id="hat-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isHovered ? "4" : "2"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="star-filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Hat base with softer, rounded shape */}
        <path 
          d="M50,5 C65,5 85,15 90,45 C95,80 5,80 10,45 C15,15 35,5 50,5 Z" 
          fill="url(#hat-gradient)" 
          filter="url(#hat-glow)"
          className="transition-all duration-300"
        />
              
        {/* Hat rim with more whimsical curve */}
        <path 
          d="M10,45 C5,80 95,80 90,45 C85,85 15,85 10,45 Z" 
          fill="#6825BC"
          className={isHovered ? "transform translate-y-1 transition-transform duration-300" : "transition-transform duration-300"}
        />
              
        {/* Star with softer points */}
        <path 
          d="M50,20 L55,35 L70,35 L58,45 L63,60 L50,50 L37,60 L42,45 L30,35 L45,35 Z" 
          fill="#FFC72C" 
          className="animate-pulse" 
          style={{ animationDuration: "3s" }}
          filter="url(#star-filter)"
          transform={isHovered ? "scale(1.1)" : "scale(1)"}
        />
              
        {/* Cute face on the hat */}
        <circle 
          cx="40" 
          cy="35" 
          r="3" 
          fill="#FFFFFF" 
          className={isHovered ? "transform scale-110 transition-transform duration-300" : "transition-transform duration-300"}
        /> {/* Left eye */}
        <circle 
          cx="60" 
          cy="35" 
          r="3" 
          fill="#FFFFFF" 
          className={isHovered ? "transform scale-110 transition-transform duration-300" : "transition-transform duration-300"}
        /> {/* Right eye */}
        <path 
          d={isHovered ? "M45,47 Q50,53 55,47" : "M45,45 Q50,50 55,45"} 
          stroke="#FFFFFF" 
          strokeWidth="2" 
          fill="none" 
          className="transition-all duration-300"
        /> {/* Smile */}
      </svg>
      
      {/* Sparkles */}
      <div className="absolute -top-2 -left-2 h-4 w-4">
        <svg viewBox="0 0 24 24" className={`w-full h-full animate-sparkle ${isHovered ? "opacity-100" : "opacity-70"}`}>
          <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FF5EBA" />
        </svg>
      </div>
      
      <div className="absolute -top-1 -right-1 h-3 w-3">
        <svg viewBox="0 0 24 24" className={`w-full h-full animate-sparkle ${isHovered ? "opacity-100" : "opacity-70"}`} style={{ animationDelay: "0.5s" }}>
          <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FF5EBA" />
        </svg>
      </div>
      
      <div className="absolute bottom-0 right-0 h-4 w-4">
        <svg viewBox="0 0 24 24" className={`w-full h-full animate-sparkle ${isHovered ? "opacity-100" : "opacity-70"}`} style={{ animationDelay: "1s" }}>
          <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#00E0FF" />
        </svg>
      </div>
      
      {/* Extra sparkles on hover */}
      {isHovered && (
        <>
          <div className="absolute -bottom-2 -left-1 h-3 w-3">
            <svg viewBox="0 0 24 24" className="w-full h-full animate-sparkle" style={{ animationDelay: "0.2s" }}>
              <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FFC72C" />
            </svg>
          </div>
          <div className="absolute top-1/2 -right-2 h-3 w-3">
            <svg viewBox="0 0 24 24" className="w-full h-full animate-sparkle" style={{ animationDelay: "0.8s" }}>
              <path d="M12,2 L14,9 L21,11 L14,13 L12,20 L10,13 L3,11 L10,9 Z" fill="#FF5EBA" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
};

export default WonderWhizLogo;
