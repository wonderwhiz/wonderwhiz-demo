
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImmersiveCardProps {
  title: string;
  content: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  onExpand?: () => void;
  onDismiss?: () => void;
  ageGroup?: '5-7' | '8-11' | '12-16';
  relevanceScore?: number;
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  title,
  content,
  backgroundImage,
  backgroundColor = 'from-wonderwhiz-deep-purple to-wonderwhiz-purple',
  onExpand,
  onDismiss,
  ageGroup = '8-11',
  relevanceScore = 1
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  const handleExpand = () => {
    setExpanded(true);
    if (onExpand) onExpand();
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  // Adjust font size based on age group
  const getTitleSize = () => {
    switch (ageGroup) {
      case '5-7': return 'text-2xl md:text-3xl';
      case '8-11': return 'text-xl md:text-2xl';
      case '12-16': return 'text-lg md:text-xl';
      default: return 'text-xl md:text-2xl';
    }
  };
  
  // Adjust content size based on age group
  const getContentSize = () => {
    switch (ageGroup) {
      case '5-7': return 'text-lg leading-relaxed';
      case '8-11': return 'text-base leading-relaxed';
      case '12-16': return 'text-sm leading-relaxed';
      default: return 'text-base leading-relaxed';
    }
  };
  
  // Adjust interaction style based on age group
  const getInteractionStyle = () => {
    switch (ageGroup) {
      case '5-7': return 'p-3 text-lg rounded-2xl';
      case '8-11': return 'p-2 text-base rounded-xl';
      case '12-16': return 'p-2 text-sm rounded-lg';
      default: return 'p-2 text-base rounded-xl';
    }
  };
  
  return (
    <motion.div
      className={`w-full rounded-3xl overflow-hidden shadow-lg ${
        dismissed ? 'pointer-events-none' : ''
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ 
        opacity: dismissed ? 0 : 1, 
        y: dismissed ? -100 : 0,
        scale: expanded ? 1 : 0.97,
        height: expanded ? 'auto' : undefined
      }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      whileHover={{ scale: expanded ? 1 : 1.02 }}
    >
      <div 
        className={`w-full h-full bg-gradient-to-br ${backgroundColor} ${
          backgroundImage ? 'bg-opacity-70 backdrop-blur-sm' : ''
        }`}
      >
        <div className="p-5 md:p-7">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className={`font-bold mb-3 text-white ${getTitleSize()}`}>
              {title}
            </h2>
            
            <div className={`text-white/90 ${getContentSize()}`}>
              {expanded ? (
                content
              ) : (
                <div className="relative max-h-24 overflow-hidden">
                  {content}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-wonderwhiz-purple/90 to-transparent" />
                </div>
              )}
            </div>
            
            {!expanded && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={handleExpand}
                  className={`bg-white/20 hover:bg-white/30 text-white ${getInteractionStyle()}`}
                >
                  <span className="mr-2">Discover More</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      {/* Relevance indicator */}
      <div 
        className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white/80"
        style={{ opacity: relevanceScore * 0.7 + 0.3 }}
      >
        {Math.floor(relevanceScore * 100)}% Relevant
      </div>
    </motion.div>
  );
};

export default ImmersiveCard;
