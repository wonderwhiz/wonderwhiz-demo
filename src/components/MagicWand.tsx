
import React, { useState, useEffect } from 'react';

interface MagicWandProps {
  className?: string;
}

const MagicWand: React.FC<MagicWandProps> = ({ className = "h-16 w-16" }) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sparklePositions, setSparklePositions] = useState<Array<{x: number, y: number, size: number, delay: number}>>([]);
  
  // Generate random sparkle positions when wand is clicked
  useEffect(() => {
    if (isAnimating) {
      const newSparkles = Array.from({ length: 10 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 0.5
      }));
      setSparklePositions(newSparkles);
      
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);
  
  const handleClick = () => {
    setIsAnimating(true);
    // Play magic sound effect
    const audio = new Audio('/lovable-uploads/magic-sound.mp3');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed', e));
  };
  
  return (
    <div 
      className={`relative ${className} cursor-pointer`}
      onMouseEnter={() => setIsGlowing(true)}
      onMouseLeave={() => setIsGlowing(false)}
      onClick={handleClick}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id="wand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC72C" />
            <stop offset="100%" stopColor="#FFB100" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={isGlowing ? "5" : "3"} result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="star-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Wand handle with decoration */}
        <rect x="40" y="55" width="15" height="35" rx="7.5" ry="7.5" fill="#8A4B0A" />
        <rect x="42.5" y="60" width="10" height="25" rx="5" ry="5" fill="#A05C10" />
        
        {/* Wand top */}
        <circle 
          cx="48" 
          cy="45" 
          r={isGlowing || isAnimating ? "14" : "12"} 
          fill="url(#wand-gradient)" 
          filter="url(#glow)"
          className={`transition-all duration-300 ${isAnimating ? 'animate-pulse' : ''}`}
        />
        
        {/* Stars/magic coming out */}
        <path 
          d="M48,25 L50,30 L55,30 L51,33 L53,38 L48,35 L43,38 L45,33 L41,30 L46,30 Z" 
          fill="#FFFFFF" 
          className="animate-pulse" 
          style={{ 
            animationDuration: "1.5s",
            transform: (isGlowing || isAnimating) ? "scale(1.2)" : "scale(1)",
            transformOrigin: "center",
            transition: "transform 0.3s ease-out"
          }} 
          filter="url(#star-glow)"
        />
        <path 
          d="M35,35 L36,38 L39,38 L37,40 L38,43 L35,41 L32,43 L33,40 L31,38 L34,38 Z" 
          fill="#FFFFFF" 
          className="animate-pulse" 
          style={{ 
            animationDuration: "2s", 
            animationDelay: "0.3s",
            transform: (isGlowing || isAnimating) ? "scale(1.2)" : "scale(1)",
            transformOrigin: "center",
            transition: "transform 0.3s ease-out"
          }}
          filter="url(#star-glow)"
        />
        <path 
          d="M60,33 L61,36 L64,36 L62,38 L63,41 L60,39 L57,41 L58,38 L56,36 L59,36 Z" 
          fill="#FFFFFF" 
          className="animate-pulse" 
          style={{ 
            animationDuration: "1.8s", 
            animationDelay: "0.6s",
            transform: (isGlowing || isAnimating) ? "scale(1.2)" : "scale(1)",
            transformOrigin: "center",
            transition: "transform 0.3s ease-out"
          }}
          filter="url(#star-glow)"
        />
        
        {/* Extra small sparkles that appear on hover */}
        {isGlowing && (
          <>
            <circle cx="52" cy="30" r="1.5" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "1s" }} />
            <circle cx="40" cy="33" r="1" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "1.2s" }} />
            <circle cx="63" cy="45" r="1.5" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "0.8s" }} />
            <circle cx="45" cy="55" r="1" fill="#FFFFFF" className="animate-pulse" style={{ animationDuration: "1.5s" }} />
          </>
        )}
        
        {/* Magic burst effect when clicked */}
        {isAnimating && sparklePositions.map((sparkle, i) => (
          <circle 
            key={i} 
            cx={sparkle.x} 
            cy={sparkle.y} 
            r={sparkle.size} 
            fill="#FFFFFF" 
            className="animate-ping" 
            style={{ 
              animationDuration: "0.8s",
              animationDelay: `${sparkle.delay}s`,
              opacity: Math.random() * 0.5 + 0.5
            }} 
          />
        ))}
      </svg>
      
      {/* Tooltip */}
      <div className={`absolute -top-10 left-1/2 transform -translate-x-1/2 bg-wonderwhiz-purple/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap transition-opacity duration-300 ${isGlowing ? 'opacity-100' : 'opacity-0'}`}>
        Click me for magic!
      </div>
    </div>
  );
};

export default MagicWand;
