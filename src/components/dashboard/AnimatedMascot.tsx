
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Star, BookOpen, Rocket } from 'lucide-react';

interface AnimatedMascotProps {
  childName?: string;
  streakDays?: number;
  onInteract?: () => void;
}

const AnimatedMascot: React.FC<AnimatedMascotProps> = ({ 
  childName = "Explorer", 
  streakDays = 0,
  onInteract 
}) => {
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'excited' | 'thinking'>('neutral');
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  
  const encouragements = [
    `Great job, ${childName}! What will you discover today?`,
    `You're on a ${streakDays}-day learning streak! Amazing!`,
    `I wonder what exciting questions you have today?`,
    `Did you know? Curious minds learn the most!`,
    `Let's explore something awesome together!`
  ];
  
  useEffect(() => {
    // Show a random speech bubble when component mounts
    const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
    setTimeout(() => {
      setSpeechBubble(randomMessage);
      setExpression('happy');
    }, 1000);
    
    // Hide the speech bubble after some time
    const timer = setTimeout(() => {
      setSpeechBubble(null);
      setExpression('neutral');
    }, 8000);
    
    return () => clearTimeout(timer);
  }, [childName, streakDays]);
  
  const handleMascotClick = () => {
    if (!speechBubble) {
      const randomMessage = encouragements[Math.floor(Math.random() * encouragements.length)];
      setSpeechBubble(randomMessage);
      setExpression('excited');
      
      setTimeout(() => {
        setSpeechBubble(null);
        setExpression('neutral');
      }, 5000);
    }
    
    if (onInteract) onInteract();
  };

  // Get animation variants for each expression
  const getExpressionAnimation = () => {
    switch (expression) {
      case 'neutral':
        return { scale: [1, 1.02], rotate: [0, 1] };
      case 'happy':
        return { scale: [1, 1.1], rotate: [0, 5] };
      case 'excited':
        return { scale: [1, 1.2], rotate: [0, 10] };
      case 'thinking':
        return { scale: [1, 0.95] };
      default:
        return { scale: [1, 1.02], rotate: [0, 1] };
    }
  };

  return (
    <div className="relative">
      {/* Speech bubble */}
      {speechBubble && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.8 }}
          className="absolute -top-20 sm:-top-24 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-xl max-w-[200px] sm:max-w-[250px] shadow-lg text-center z-10"
        >
          <div className="text-sm font-medium text-wonderwhiz-purple">
            {speechBubble}
          </div>
          <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white rotate-45"></div>
        </motion.div>
      )}
      
      {/* Mascot character */}
      <motion.div 
        className="relative cursor-pointer"
        onClick={handleMascotClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div 
          className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full flex items-center justify-center relative overflow-hidden"
          animate={getExpressionAnimation()}
          transition={{ 
            repeat: Infinity, 
            repeatType: "reverse", 
            duration: expression === 'excited' ? 0.7 : 2 
          }}
        >
          {expression === 'neutral' && <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          {expression === 'happy' && <Star className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          {expression === 'excited' && <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
          {expression === 'thinking' && <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-white" />}
        </motion.div>
        
        {/* Animated particles around mascot */}
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-wonderwhiz-gold rounded-full"
              initial={{ 
                x: 0, 
                y: 0,
                opacity: 0 
              }}
              animate={{ 
                x: Math.random() * 60 - 30, 
                y: Math.random() * 60 - 30,
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedMascot;
