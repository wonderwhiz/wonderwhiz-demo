
import React from 'react';
import { motion } from 'framer-motion';

interface MagicalBorderProps {
  className?: string;
  children: React.ReactNode;
  active?: boolean;
  type?: 'rainbow' | 'gold' | 'purple' | 'blue';
}

const MagicalBorder: React.FC<MagicalBorderProps> = ({ 
  children, 
  className = '',
  active = true,
  type = 'rainbow'
}) => {
  const getBorderGradient = () => {
    switch (type) {
      case 'gold':
        return 'from-wonderwhiz-gold via-amber-300 to-wonderwhiz-gold';
      case 'purple':
        return 'from-wonderwhiz-purple via-purple-300 to-wonderwhiz-purple';
      case 'blue':
        return 'from-wonderwhiz-blue via-cyan-300 to-wonderwhiz-blue';
      case 'rainbow':
      default:
        return 'from-wonderwhiz-purple via-wonderwhiz-pink via-wonderwhiz-blue to-wonderwhiz-gold';
    }
  };

  return (
    <div className={`relative h-full ${className}`}>
      {active && (
        <motion.div 
          className={`absolute -inset-0.5 rounded-[inherit] bg-gradient-to-r ${getBorderGradient()} z-0 opacity-80`}
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{
            duration: 5,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{
            backgroundSize: '200% 200%',
          }}
        />
      )}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};

export default MagicalBorder;
