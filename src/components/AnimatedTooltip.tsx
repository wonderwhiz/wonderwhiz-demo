
import React, { useState } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { motion } from 'framer-motion';

interface AnimatedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delay?: number;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const AnimatedTooltip: React.FC<AnimatedTooltipProps> = ({
  children,
  content,
  delay = 200,
  side = 'top',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <HoverCard 
      openDelay={delay}
      onOpenChange={setIsOpen}
    >
      <HoverCardTrigger asChild>
        <div className="inline-block">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent 
        side={side}
        className={`bg-wonderwhiz-gradient border border-wonderwhiz-purple/40 text-white p-3 rounded-xl shadow-lg backdrop-blur-lg ${className}`}
        sideOffset={8}
      >
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {content}
          
          {/* Decorative elements */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-wonderwhiz-pink rounded-full opacity-60 animate-pulse" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-wonderwhiz-blue rounded-full opacity-60 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AnimatedTooltip;
