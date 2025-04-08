
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Rocket, 
  Microscope, 
  Leaf, 
  BookOpen, 
  Cat, 
  Sparkles
} from 'lucide-react';

type CardType = 'science' | 'nature' | 'space' | 'history' | 'animals' | 'general';

interface AnimatedCurioCardProps {
  title: string;
  onClick: () => void;
  index: number;
  type: CardType;
}

const AnimatedCurioCard: React.FC<AnimatedCurioCardProps> = ({
  title,
  onClick,
  index,
  type
}) => {
  // Get the right icon based on card type
  const getIcon = () => {
    switch (type) {
      case 'science':
        return <Microscope className="h-5 w-5 text-white" />;
      case 'nature':
        return <Leaf className="h-5 w-5 text-white" />;
      case 'space':
        return <Rocket className="h-5 w-5 text-white" />;
      case 'history':
        return <BookOpen className="h-5 w-5 text-white" />;
      case 'animals':
        return <Cat className="h-5 w-5 text-white" />;
      default:
        return <Sparkles className="h-5 w-5 text-white" />;
    }
  };

  // Get background gradient based on card type
  const getGradient = () => {
    switch (type) {
      case 'science':
        return 'from-blue-600 to-indigo-700';
      case 'nature':
        return 'from-green-500 to-teal-600';
      case 'space':
        return 'from-purple-600 to-indigo-800';
      case 'history':
        return 'from-amber-600 to-red-700';
      case 'animals':
        return 'from-orange-500 to-pink-600';
      default:
        return 'from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: 1, 
        y: 0,
        transition: { 
          delay: index * 0.1,
          duration: 0.5,
          ease: [0.23, 1, 0.32, 1]
        }
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-br ${getGradient()} rounded-xl overflow-hidden cursor-pointer relative`}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-white/5 background-grid" />
      
      <div className="p-4 flex items-start">
        <div className="bg-white/20 rounded-full p-2 mr-3 flex-shrink-0">
          {getIcon()}
        </div>
        
        <div className="flex-1">
          <h3 className="text-white font-medium leading-tight">{title}</h3>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20" />
      
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-white"
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.div
        className="absolute top-1 right-1 bg-white/20 rounded-full p-1"
        whileHover={{ scale: 1.2, backgroundColor: 'rgba(255,255,255,0.3)' }}
      >
        <Sparkles className="h-3 w-3 text-white" />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedCurioCard;
