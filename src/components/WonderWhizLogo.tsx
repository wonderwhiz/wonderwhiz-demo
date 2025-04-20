
import React from 'react';

interface WonderWhizLogoProps {
  className?: string;
}

const WonderWhizLogo: React.FC<WonderWhizLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg width="100%" height="100%" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="30" fill="url(#wonderwhiz_gradient)" />
        <path d="M43.5 22C41.5 20 37.5 19 34.5 22C31.5 25 31.5 29 34.5 32C37.5 35 41.5 34 43.5 32" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M25.5 40C23.5 42 19.5 43 16.5 40C13.5 37 13.5 33 16.5 30C19.5 27 23.5 28 25.5 30" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 20L40 40" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15 16L25 26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M35 34L45 44" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <defs>
          <linearGradient id="wonderwhiz_gradient" x1="0" y1="0" x2="60" y2="60" gradientUnits="userSpaceOnUse">
            <stop stopColor="#8B5CF6" />
            <stop offset="0.5" stopColor="#D946EF" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Add sparkle effects */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-white rounded-full opacity-70 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-0 w-1.5 h-1.5 bg-white rounded-full opacity-60 animate-pulse-slow delay-300"></div>
      <div className="absolute bottom-0 left-1/3 w-1 h-1 bg-white rounded-full opacity-80 animate-pulse-slow delay-700"></div>
    </div>
  );
};

export default WonderWhizLogo;
