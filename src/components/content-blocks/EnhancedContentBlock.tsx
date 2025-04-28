
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MessageCircle, Bookmark } from 'lucide-react';

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative group p-6 rounded-2xl bg-wonder-card hover:bg-wonder-hover 
                 border border-white/10 hover:border-white/20 transition-all duration-300
                 backdrop-blur-sm shadow-lg hover:shadow-xl"
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-wonderwhiz-purple/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-wonderwhiz-gold animate-pulse-soft" />
            <h3 className="font-bold text-white">
              {childAge <= 8 ? "Fun Fact!" : type.charAt(0).toUpperCase() + type.slice(1)}
            </h3>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onInteract}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-white/70" />
            </button>
            <button 
              onClick={onInteract}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <Bookmark className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>

        <p className="text-white/90 leading-relaxed">
          {content}
        </p>

        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onInteract}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                     bg-button-gradient hover:opacity-90 transition-opacity
                     text-white text-sm font-medium"
          >
            {childAge <= 8 ? "Tell me more!" : "Explore Further"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedContentBlock;
