
import React from 'react';
import { motion } from 'framer-motion';
import { getSpecialistInfo } from '@/utils/specialists';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpecialistAvatarProps {
  specialistId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withTooltip?: boolean;
  withAnimation?: boolean;
  onClick?: () => void;
}

const SpecialistAvatar: React.FC<SpecialistAvatarProps> = ({
  specialistId,
  size = 'md',
  withTooltip = true,
  withAnimation = false,
  onClick
}) => {
  const specialist = getSpecialistInfo?.(specialistId) || {
    name: specialistId,
    fallbackColor: 'bg-purple-600',
    fallbackInitial: specialistId.charAt(0).toUpperCase(),
    avatar: '',
    title: 'Knowledge Specialist'
  };
  
  // Generate size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      case 'xl': return 'h-16 w-16';
      case 'md':
      default: return 'h-10 w-10';
    }
  };
  
  // Generate background color based on specialist
  const getBackgroundColor = () => {
    switch (specialistId.toLowerCase()) {
      case 'nova': return 'bg-blue-600';
      case 'spark': return 'bg-amber-600';
      case 'prism': return 'bg-purple-600';
      case 'pixel': return 'bg-cyan-600';
      case 'atlas': return 'bg-amber-700';
      case 'lotus': return 'bg-emerald-600';
      case 'whizzy': return 'bg-pink-600';
      default: return specialist.fallbackColor || 'bg-purple-600';
    }
  };
  
  const avatarContent = (
    <Avatar 
      className={`${getSizeClasses()} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {specialist.avatar && (
        <AvatarImage 
          src={specialist.avatar} 
          alt={specialist.name} 
          className="object-cover"
        />
      )}
      <AvatarFallback className={`${getBackgroundColor()} text-white`}>
        {specialist.fallbackInitial || specialistId.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
  
  const animatedAvatar = withAnimation ? (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {avatarContent}
    </motion.div>
  ) : avatarContent;
  
  if (withTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {animatedAvatar}
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="text-center">
              <p className="font-medium">{specialist.name}</p>
              <p className="text-xs text-muted-foreground">{specialist.title}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return animatedAvatar;
};

export default SpecialistAvatar;
