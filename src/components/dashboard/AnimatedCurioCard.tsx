
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Star, BookOpen, Rocket, Brain, Globe } from 'lucide-react';

interface AnimatedCurioCardProps {
  title: string;
  onClick: () => void;
  index: number;
  type?: 'science' | 'nature' | 'space' | 'history' | 'animals' | 'general';
}

const AnimatedCurioCard: React.FC<AnimatedCurioCardProps> = ({
  title,
  onClick,
  index,
  type = 'general'
}) => {
  // Different background gradients based on topic type
  const gradients = {
    science: 'from-blue-500/70 to-cyan-400/70',
    nature: 'from-green-500/70 to-emerald-400/70',
    space: 'from-indigo-500/70 to-purple-400/70',
    history: 'from-amber-500/70 to-yellow-400/70',
    animals: 'from-orange-500/70 to-red-400/70',
    general: 'from-wonderwhiz-bright-pink/70 to-wonderwhiz-vibrant-yellow/70'
  };
  
  // Different icons based on topic type
  const icons = {
    science: <Brain className="h-6 w-6 text-white" />,
    nature: <Globe className="h-6 w-6 text-white" />,
    space: <Rocket className="h-6 w-6 text-white" />,
    history: <BookOpen className="h-6 w-6 text-white" />,
    animals: <Lightbulb className="h-6 w-6 text-white" />,
    general: <Star className="h-6 w-6 text-white" />
  };

  return (
    <motion.div
      className={`cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br ${gradients[type]} border border-white/30 shadow-lg group relative`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {/* Floating particles */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full"
            initial={{ x: '50%', y: '50%', opacity: 0 }}
            animate={{ 
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: [0, 0.8, 0]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
      </div>
      
      <div className="p-4 relative">
        <div className="flex gap-3 items-center">
          <motion.div 
            className="bg-white/20 p-2 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: index * 0.2
            }}
          >
            {icons[type]}
          </motion.div>
          
          <h3 className="text-white font-medium text-sm sm:text-base relative overflow-hidden">
            {title}
            <motion.div 
              className="absolute bottom-0 left-0 h-0.5 bg-white"
              initial={{ width: 0 }}
              whileHover={{ width: '100%' }}
              transition={{ duration: 0.3 }}
            />
          </h3>
        </div>
      </div>
      
      {/* Animated gradient border on hover */}
      <motion.div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        transition={{ duration: 0.3 }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/0 via-white/80 to-white/0">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/80 to-white/0"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCurioCard;
