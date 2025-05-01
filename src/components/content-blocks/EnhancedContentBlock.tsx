
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark, ThumbsUp, Share2 } from 'lucide-react';

interface EnhancedContentBlockProps {
  content: string;
  type: 'fact' | 'quiz' | 'activity';
  onInteract?: () => void;
  childAge?: number;
}

const EnhancedContentBlock: React.FC<EnhancedContentBlockProps> = ({
  content,
  type,
  onInteract,
  childAge = 10
}) => {
  const getTypeIcon = () => {
    switch(type) {
      case 'fact': return "💡";
      case 'quiz': return "🎯";
      case 'activity': return "🌟";
      default: return "✨";
    }
  };
  
  const getTypeTitle = () => {
    if (childAge <= 8) {
      return type === 'fact' ? "Cool Fact!" :
             type === 'quiz' ? "Let's Play!" : "Fun Activity!";
    }
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  const getGradient = () => {
    switch(type) {
      case 'fact': return 'from-wonderwhiz-cyan/20 via-wonderwhiz-deep-purple/90 to-wonderwhiz-deep-purple/70';
      case 'quiz': return 'from-wonderwhiz-bright-pink/20 via-wonderwhiz-deep-purple/90 to-wonderwhiz-deep-purple/70';
      case 'activity': return 'from-wonderwhiz-vibrant-yellow/20 via-wonderwhiz-deep-purple/90 to-wonderwhiz-deep-purple/70';
      default: return 'from-wonderwhiz-purple/20 via-wonderwhiz-deep-purple/90 to-wonderwhiz-deep-purple/70';
    }
  };
  
  const getGlow = () => {
    switch(type) {
      case 'fact': return '0 0 25px rgba(0,226,255,0.2)';
      case 'quiz': return '0 0 25px rgba(255,91,163,0.2)';
      case 'activity': return '0 0 25px rgba(255,213,79,0.2)';
      default: return '0 0 25px rgba(126,48,225,0.2)';
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
                      border border-white/20 hover:border-white/30
                      backdrop-blur-lg shadow-lg hover:shadow-xl transition-all duration-300`}
           style={{ boxShadow: `0 8px 24px -6px rgba(0,0,0,0.25), ${getGlow()}` }}>
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-transparent border border-white/20">
                <span className="text-2xl">{getTypeIcon()}</span>
              </div>
              <h3 className="font-bold text-xl md:text-2xl bg-gradient-to-br from-white via-white/95 to-white/85 bg-clip-text text-transparent font-nunito">
                {getTypeTitle()}
              </h3>
            </div>
          </div>

          <div className="relative">
            <div className={`text-white/90 ${getFontSize()} font-nunito my-4`}>
              {content}
            </div>
            
            {childAge <= 8 && (
              <div className="absolute -right-2 -top-2 opacity-20">
                <div className="text-3xl transform -rotate-12">
                  {getTypeIcon()}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10">
          <div className="px-6 py-3 flex justify-between items-center">
            <div className="flex gap-4">
              <button onClick={onInteract} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
                <ThumbsUp className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Like</span>
              </button>
              <button onClick={onInteract} className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-gold transition-colors">
                <Bookmark className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Save</span>
              </button>
              <button onClick={onInteract} className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-cyan transition-colors">
                <MessageCircle className="h-5 w-5" />
                <span className={childAge <= 10 ? "text-sm" : "sr-only"}>Comment</span>
              </button>
            </div>
            <div>
              <button onClick={onInteract} className="flex items-center gap-2 text-white/70 hover:text-wonderwhiz-green transition-colors">
                <Share2 className="h-5 w-5" />
                <span className="sr-only">Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
    </motion.div>
  );
};

export default EnhancedContentBlock;
