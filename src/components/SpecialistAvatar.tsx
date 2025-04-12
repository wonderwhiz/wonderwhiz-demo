
import React from 'react';

interface SpecialistAvatarProps {
  specialistId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SpecialistAvatar: React.FC<SpecialistAvatarProps> = ({ specialistId, size = 'md', className = '' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };
  
  const getSpecialistGradient = () => {
    switch (specialistId) {
      case 'nova':
        return 'from-blue-600 to-indigo-600';
      case 'spark':
        return 'from-amber-500 to-orange-500';
      case 'prism':
        return 'from-indigo-600 to-purple-600';
      case 'pixel':
        return 'from-cyan-500 to-blue-500';
      case 'atlas':
        return 'from-amber-700 to-yellow-600';
      case 'lotus':
        return 'from-emerald-500 to-green-500';
      default:
        return 'from-wonderwhiz-deep-purple to-wonderwhiz-light-purple';
    }
  };
  
  const getSpecialistEmoji = () => {
    switch (specialistId) {
      case 'nova': return '🚀';
      case 'spark': return '💡';
      case 'prism': return '🔬';
      case 'pixel': return '💻';
      case 'atlas': return '🗺️';
      case 'lotus': return '🌿';
      default: return '✨';
    }
  };
  
  return (
    <div 
      className={`${getSizeClasses()} rounded-full bg-gradient-to-br ${getSpecialistGradient()} flex items-center justify-center shadow-glow-sm ${className}`}
    >
      <span role="img" aria-label="specialist icon">
        {getSpecialistEmoji()}
      </span>
    </div>
  );
};

export default SpecialistAvatar;
