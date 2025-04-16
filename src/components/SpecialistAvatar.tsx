
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SpecialistAvatarProps {
  specialistId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface SpecialistInfo {
  name: string;
  avatar: string;
  fallbackColor: string;
  fallbackInitial: string;
}

const getSpecialistInfo = (specialistId: string): SpecialistInfo => {
  const specialists: Record<string, SpecialistInfo> = {
    nova: {
      name: 'Nova',
      avatar: '/specialists/nova-avatar.png',
      fallbackColor: 'bg-blue-600',
      fallbackInitial: 'N',
    },
    spark: {
      name: 'Spark',
      avatar: '/specialists/spark-avatar.png',
      fallbackColor: 'bg-yellow-500',
      fallbackInitial: 'S',
    },
    prism: {
      name: 'Prism',
      avatar: '/specialists/prism-avatar.png',
      fallbackColor: 'bg-green-600',
      fallbackInitial: 'P',
    },
    whizzy: {
      name: 'Whizzy',
      avatar: '/specialists/whizzy-avatar.png',
      fallbackColor: 'bg-purple-600',
      fallbackInitial: 'W',
    },
    atlas: {
      name: 'Atlas',
      avatar: '/specialists/atlas-avatar.png',
      fallbackColor: 'bg-amber-700',
      fallbackInitial: 'A',
    },
    pixel: {
      name: 'Pixel',
      avatar: '/specialists/pixel-avatar.png',
      fallbackColor: 'bg-cyan-600',
      fallbackInitial: 'P',
    },
    lotus: {
      name: 'Lotus',
      avatar: '/specialists/lotus-avatar.png',
      fallbackColor: 'bg-pink-600',
      fallbackInitial: 'L',
    },
  };

  return specialists[specialistId] || {
    name: 'Helper',
    avatar: '/specialists/whizzy-avatar.png',
    fallbackColor: 'bg-purple-600',
    fallbackInitial: 'H',
  };
};

const SpecialistAvatar: React.FC<SpecialistAvatarProps> = ({ 
  specialistId, 
  size = 'md',
  className = ''
}) => {
  const specialist = getSpecialistInfo(specialistId);
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
  };
  
  return (
    <Avatar className={`${sizeClasses[size]} border-2 border-white/10 ${className}`}>
      <AvatarImage src={specialist.avatar} alt={specialist.name} />
      <AvatarFallback className={specialist.fallbackColor}>
        {specialist.fallbackInitial}
      </AvatarFallback>
    </Avatar>
  );
};

export default SpecialistAvatar;
