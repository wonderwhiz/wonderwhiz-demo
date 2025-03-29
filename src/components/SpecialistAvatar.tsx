
import React from 'react';
import { cn } from '@/lib/utils';

type SpecialistData = {
  name: string;
  color: string;
  emoji: string;
  description: string;
};

export const SPECIALISTS: Record<string, SpecialistData> = {
  'nova': { 
    name: 'Nova the Explorer', 
    color: 'bg-gradient-to-r from-blue-400 to-indigo-500',
    emoji: '🚀',
    description: 'Expert in exploration and discovery'
  },
  'spark': { 
    name: 'Spark the Scientist', 
    color: 'bg-gradient-to-r from-yellow-300 to-amber-500',
    emoji: '⚡',
    description: 'Expert in science and experiments'
  },
  'prism': { 
    name: 'Prism the Artist', 
    color: 'bg-gradient-to-r from-emerald-400 to-teal-500',
    emoji: '🎨',
    description: 'Expert in arts and creativity'
  },
  'pixel': { 
    name: 'Pixel the Robot', 
    color: 'bg-gradient-to-r from-pink-400 to-rose-500',
    emoji: '🤖',
    description: 'Expert in technology and coding'
  },
  'atlas': { 
    name: 'Atlas the Turtle', 
    color: 'bg-gradient-to-r from-purple-400 to-indigo-500',
    emoji: '🗺️',
    description: 'Expert in geography and history'
  },
  'lotus': { 
    name: 'Lotus the Wellbeing Panda', 
    color: 'bg-gradient-to-r from-orange-400 to-red-500',
    emoji: '🧘',
    description: 'Expert in wellbeing and mindfulness'
  },
};

interface SpecialistAvatarProps {
  specialistId: string;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const SpecialistAvatar: React.FC<SpecialistAvatarProps> = ({ specialistId, size = 'md', showName = false, className }) => {
  const specialist = SPECIALISTS[specialistId] || {
    name: 'Wonder Wizard',
    color: 'bg-gradient-to-r from-purple-500 to-pink-500',
    emoji: '✨',
    description: 'General knowledge expert'
  };
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  return (
    <div className={cn('flex items-center', className)}>
      <div className={cn(
        'rounded-full flex items-center justify-center text-white',
        specialist.color,
        sizeClasses[size]
      )}>
        <span>{specialist.emoji}</span>
      </div>
      
      {showName && (
        <span className="ml-2 font-medium text-white/90">{specialist.name}</span>
      )}
    </div>
  );
};

export default SpecialistAvatar;
