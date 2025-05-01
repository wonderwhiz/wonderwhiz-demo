
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark, ThumbsUp, Share2, Star, Lightbulb, PenTool, BookOpen } from 'lucide-react';
import BlockAccent from './BlockAccent';

interface EnhancedContentBlockProps {
  content: string;
  type: 'fact' | 'quiz' | 'activity';
  onInteract?: () => void;
  childAge?: number;
  title?: string;
}

const EnhancedContentBlock: React.FC<EnhancedContentBlockProps> = ({
  content,
  type,
  onInteract,
  childAge = 10,
  title
}) => {
  const getTypeIcon = () => {
    switch(type) {
      case 'fact': return <Lightbulb className="h-6 w-6 text-wonderwhiz-cyan" />;
      case 'quiz': return <Star className="h-6 w-6 text-wonderwhiz-bright-pink" />;
      case 'activity': return <PenTool className="h-6 w-6 text-wonderwhiz-vibrant-yellow" />;
      default: return <BookOpen className="h-6 w-6 text-wonderwhiz-purple" />;
    }
  };
  
  const getTypeEmoji = () => {
    switch(type) {
      case 'fact': return "💡";
      case 'quiz': return "🎯";
      case 'activity': return "🌟";
      default: return "✨";
    }
  };
  
  const getTypeTitle = () => {
    if (title) return title;
    
    if (childAge <= 8) {
      return type === 'fact' ? "Cool Fact!" :
             type === 'quiz' ? "Let's Play!" : "Fun Activity!";
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getGradient = () => {
    switch(type) {
      case 'fact': return 'from-wonderwhiz-cyan/30 via-wonderwhiz-deep-purple/95 to-wonderwhiz-deep-purple/80';
      case 'quiz': return 'from-wonderwhiz-bright-pink/30 via-wonderwhiz-deep-purple/95 to-wonderwhiz-deep-purple/80';
      case 'activity': return 'from-wonderwhiz-vibrant-yellow/30 via-wonderwhiz-deep-purple/95 to-wonderwhiz-deep-purple/80';
      default: return 'from-wonderwhiz-purple/30 via-wonderwhiz-deep-purple/95 to-wonderwhiz-deep-purple/80';
    }
  };
  
  const getGlow = () => {
    switch(type) {
      case 'fact': return '0 0 30px rgba(0,226,255,0.25)';
      case 'quiz': return '0 0 30px rgba(255,91,163,0.25)';
      case 'activity': return '0 0 30px rgba(255,213,79,0.25)';
      default: return '0 0 30px rgba(126,48,225,0.25)';
    }
  };
  
  const getBorderColor = () => {
    switch(type) {
      case 'fact': return 'border-wonderwhiz-cyan/40';
      case 'quiz': return 'border-wonderwhiz-bright-pink/40';
      case 'activity': return 'border-wonderwhiz-vibrant-yellow/40';
      default: return 'border-wonderwhiz-purple/40';
    }
  };
  
  const getFontSize = () => {
    if (childAge <= 7) return "text-xl leading-relaxed";
    if (childAge <= 11) return "text-lg leading-relaxed";
    return "text-base leading-relaxed";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden group"
    >
      <div className={`rounded-2xl bg-gradient-to-br ${getGradient()}
                      border ${getBorderColor()} hover:border-white/30
                      backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-300`}
           style={{ boxShadow: `0 10px 30px -6px rgba(0,0,0,0.3), ${getGlow()}` }}>
        {/* Add Block Accent */}
        <div className="absolute top-0 right-0">
          <BlockAccent type={type} childAge={childAge} />
        </div>
        
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-white/20 to-transparent border border-white/30 shadow-lg ${childAge <= 8 ? 'animate-pulse' : ''}`}>
                {childAge <= 8 ? (
                  <span className="text-2xl">{getTypeEmoji()}</span>
                ) : (
                  getTypeIcon()
                )}
              </div>
              <motion.h3 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="font-bold text-xl md:text-2xl bg-gradient-to-br from-white via-white/95 to-white/85 bg-clip-text text-transparent font-nunito"
              >
                {getTypeTitle()}
              </motion.h3>
            </div>
            
            {/* Age-appropriate UI enhancement for older children */}
            {childAge > 10 && (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-white/40"></div>
                <div className="w-2 h-2 rounded-full bg-white/30"></div>
                <div className="w-2 h-2 rounded-full bg-white/20"></div>
              </div>
            )}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className={`text-white/95 ${getFontSize()} font-nunito my-4`}>
              {content}
            </div>
            
            {childAge <= 8 && (
              <div className="absolute -right-2 -top-2 opacity-20">
                <div className="text-3xl transform -rotate-12">
                  {getTypeEmoji()}
                </div>
              </div>
            )}
            
            {/* Add subtle pattern for younger children */}
            {childAge <= 8 && (
              <div className="absolute bottom-0 right-0 opacity-10 pointer-events-none">
                <div 
                  className="w-24 h-24"
                  style={{
                    backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                    backgroundSize: '10px 10px'
                  }}
                />
              </div>
            )}
          </motion.div>
        </div>
        
        <div className="border-t border-white/15">
          <div className="px-6 py-3 flex justify-between items-center">
            <div className="flex gap-4">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onInteract} 
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <ThumbsUp className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Like</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onInteract} 
                className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-gold transition-colors"
              >
                <Bookmark className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Save</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onInteract} 
                className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-cyan transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Comment</span>
              </motion.button>
            </div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <button onClick={onInteract} className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-green transition-colors">
                <Share2 className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Share</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Add interactive hover effect */}
      <div className={`absolute inset-0 bg-gradient-to-r from-${type === 'fact' ? 'wonderwhiz-cyan' : type === 'quiz' ? 'wonderwhiz-bright-pink' : 'wonderwhiz-vibrant-yellow'}/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
      
      {/* Add a subtle pulsing animation for focus (more prominent for younger children) */}
      <motion.div
        animate={{ 
          boxShadow: [
            `0 0 0 0px rgba(255,255,255,0)`,
            `0 0 0 4px rgba(255,255,255,${childAge <= 8 ? 0.2 : 0.1})`,
            `0 0 0 0px rgba(255,255,255,0)`
          ]
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          repeatType: "loop" 
        }}
        className="absolute inset-0 rounded-2xl pointer-events-none"
      />
    </motion.div>
  );
};

export default EnhancedContentBlock;
