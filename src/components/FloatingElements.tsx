
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Cloud, Sun } from 'lucide-react';

interface FloatingElementsProps {
  type: 'stars' | 'clouds' | 'sparkles' | 'mixed';
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

const FloatingElements: React.FC<FloatingElementsProps> = ({ 
  type = 'stars', 
  density = 'medium',
  className = ''
}) => {
  const [elements, setElements] = useState<Array<{
    id: number;
    x: string;
    y: string;
    size: number;
    delay: number;
    duration: number;
    rotate: number;
    icon: string;
    color: string;
  }>>([]);

  useEffect(() => {
    // Determine number of elements based on density
    const count = density === 'low' ? 5 : density === 'medium' ? 10 : 15;
    
    // Generate random elements
    const newElements = Array.from({ length: count }, (_, i) => {
      const getRandomIcon = () => {
        if (type === 'mixed') {
          const icons = ['star', 'sparkle', 'cloud', 'sun'];
          return icons[Math.floor(Math.random() * icons.length)];
        }
        if (type === 'stars') return 'star';
        if (type === 'clouds') return 'cloud';
        return 'sparkle';
      };
      
      const getRandomColor = (icon: string) => {
        switch(icon) {
          case 'star':
            return ['text-wonderwhiz-gold', 'text-amber-300', 'text-yellow-300'][Math.floor(Math.random() * 3)];
          case 'sparkle':
            return ['text-wonderwhiz-purple', 'text-wonderwhiz-blue', 'text-wonderwhiz-pink'][Math.floor(Math.random() * 3)];
          case 'cloud':
            return ['text-white/60', 'text-gray-200/70', 'text-blue-100/70'][Math.floor(Math.random() * 3)];
          case 'sun':
            return ['text-wonderwhiz-gold', 'text-amber-400', 'text-orange-300'][Math.floor(Math.random() * 3)];
          default:
            return 'text-white';
        }
      };
      
      const icon = getRandomIcon();
      
      return {
        id: i,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        size: Math.random() * 1.5 + 0.5, // 0.5 to 2
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 15, // 15-25 seconds
        rotate: Math.random() * 360,
        icon,
        color: getRandomColor(icon)
      };
    });
    
    setElements(newElements);
  }, [type, density]);

  const renderIcon = (el: typeof elements[0]) => {
    switch(el.icon) {
      case 'star':
        return <Star className={`${el.color}`} />;
      case 'cloud':
        return <Cloud className={`${el.color}`} />;
      case 'sun':
        return <Sun className={`${el.color}`} />;
      default:
        return <Sparkles className={`${el.color}`} />;
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {elements.map(el => (
        <motion.div
          key={el.id}
          className="absolute"
          style={{
            left: el.x,
            top: el.y,
            width: `${el.size}rem`,
            height: `${el.size}rem`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 1, 0.8, 1, 0],
            scale: [0, 1, 0.9, 1, 0],
            rotate: [0, el.rotate, el.rotate * 2],
            y: [`${parseInt(el.y)}%`, `${parseInt(el.y) - 20}%`, `${parseInt(el.y) - 40}%`],
          }}
          transition={{ 
            repeat: Infinity,
            repeatType: 'loop',
            duration: el.duration,
            delay: el.delay,
            ease: 'easeInOut'
          }}
        >
          {renderIcon(el)}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;
