
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Stars, ChevronRight } from 'lucide-react';

interface DynamicWonderSuggestionsProps {
  suggestions?: string[];
  onSuggestionClick: (suggestion: string) => void;
  isLoading?: boolean;
  childAge?: number;
  childId?: string;
  childInterests?: string[];
}

const DynamicWonderSuggestions: React.FC<DynamicWonderSuggestionsProps> = ({
  suggestions = [],
  onSuggestionClick,
  isLoading,
  childAge = 10,
  childId,
  childInterests
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      } 
    }
  };
  
  const getFontSize = () => {
    if (childAge <= 7) return "text-xl";
    if (childAge <= 11) return "text-lg";
    return "text-base";
  };
  
  const getCardStyle = (index: number) => {
    // Create a more varied look based on the index
    const baseStyles = "relative group p-6 md:p-7 rounded-2xl text-left transition-all duration-300 border border-white/20 backdrop-blur-lg shadow-lg hover:shadow-xl";
    
    const gradients = [
      "bg-gradient-to-br from-wonderwhiz-deep-purple/80 via-wonderwhiz-deep-purple/60 to-wonderwhiz-purple/40 hover:from-wonderwhiz-purple/80 hover:via-wonderwhiz-purple/60 hover:to-wonderwhiz-purple/40",
      "bg-gradient-to-br from-wonderwhiz-cyan/40 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50 hover:from-wonderwhiz-cyan/50 hover:via-wonderwhiz-deep-purple/60 hover:to-wonderwhiz-purple/40",
      "bg-gradient-to-br from-wonderwhiz-bright-pink/40 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50 hover:from-wonderwhiz-bright-pink/50 hover:via-wonderwhiz-deep-purple/60 hover:to-wonderwhiz-purple/40",
      "bg-gradient-to-br from-wonderwhiz-vibrant-yellow/40 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50 hover:from-wonderwhiz-vibrant-yellow/50 hover:via-wonderwhiz-deep-purple/60 hover:to-wonderwhiz-purple/40",
      "bg-gradient-to-br from-wonderwhiz-green/40 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50 hover:from-wonderwhiz-green/50 hover:via-wonderwhiz-deep-purple/60 hover:to-wonderwhiz-purple/40",
      "bg-gradient-to-br from-wonderwhiz-teal/40 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50 hover:from-wonderwhiz-teal/50 hover:via-wonderwhiz-deep-purple/60 hover:to-wonderwhiz-purple/40"
    ];
    
    return `${baseStyles} ${gradients[index % gradients.length]}`;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <div className="relative p-2 bg-gradient-to-br from-wonderwhiz-gold/30 to-wonderwhiz-gold/10 rounded-full">
          <Stars className="h-6 w-6 text-wonderwhiz-gold" />
          <div className="absolute inset-0 bg-wonderwhiz-gold/20 blur-lg -z-10 rounded-full" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent font-nunito">
          {childAge <= 8 
            ? "What should we explore today?" 
            : childAge <= 12 
              ? "Discover Something Amazing" 
              : "Explore New Horizons"}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {suggestions.map((suggestion, index) => (
          <motion.button
            key={`${suggestion}-${index}`}
            variants={itemVariants}
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSuggestionClick(suggestion)}
            className={getCardStyle(index)}
            style={{ 
              boxShadow: "0 8px 32px -4px rgba(0,0,0,0.15), inset 0 0 20px rgba(255,255,255,0.05)"
            }}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wonderwhiz-cyan/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <p className={`${getFontSize()} font-medium text-white/95 relative z-10 font-nunito leading-relaxed pr-6`}>
              {suggestion}
            </p>
            
            <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
              <div className="p-2 rounded-full bg-white/20 backdrop-blur-sm">
                <ChevronRight className="h-5 w-5 text-white" />
              </div>
            </div>
            
            {/* Decorative elements for younger children */}
            {childAge <= 8 && (
              <>
                <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-100 transition-opacity">
                  <div className="text-2xl">✨</div>
                </div>
                
                <div className="absolute bottom-4 left-4 opacity-30 group-hover:opacity-70 transition-opacity">
                  <Sparkles className="h-4 w-4 text-wonderwhiz-gold" />
                </div>
              </>
            )}
            
            {/* Animated gradient border for a more interactive feel */}
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 2s infinite',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            />
          </motion.button>
        ))}
      </div>
      
      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </motion.div>
  );
};

export default DynamicWonderSuggestions;
