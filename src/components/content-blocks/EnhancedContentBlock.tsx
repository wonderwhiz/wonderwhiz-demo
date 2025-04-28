
import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Bookmark } from 'lucide-react';

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
      className="relative overflow-hidden group"
    >
      <div className="rounded-2xl bg-gradient-to-br from-wonderwhiz-deep-purple/90 via-wonderwhiz-deep-purple/70 to-wonderwhiz-deep-purple/50
                    border border-white/10 hover:border-white/20 backdrop-blur-lg
                    shadow-[0_8px_16px_-6px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_20px_-8px_rgba(0,0,0,0.3)]
                    transition-all duration-300">
        <div className="p-6 relative z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-wonderwhiz-purple/20 to-wonderwhiz-deep-purple/20 border border-white/10">
                {type === 'fact' && <span className="text-xl">💡</span>}
                {type === 'quiz' && <span className="text-xl">🎯</span>}
                {type === 'activity' && <span className="text-xl">🌟</span>}
              </div>
              <h3 className="font-bold text-xl bg-gradient-to-br from-white via-white/90 to-white/80 bg-clip-text text-transparent font-nunito">
                {childAge <= 8 ? (
                  type === 'fact' ? "Cool Fact!" :
                  type === 'quiz' ? "Let's Play!" :
                  "Fun Activity!"
                ) : (
                  type.charAt(0).toUpperCase() + type.slice(1)
                )}
              </h3>
            </div>
          </div>

          <div className="relative">
            <div className="text-white/90 text-lg leading-relaxed font-nunito">
              {content}
            </div>
            
            {childAge <= 8 && (
              <div className="absolute -right-2 -top-2 opacity-20">
                <div className="text-3xl transform -rotate-12">
                  {type === 'fact' ? "✨" : type === 'quiz' ? "🎯" : "🌟"}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="border-t border-white/10">
          <div className="px-6 py-3 flex justify-between items-center">
            <div className="flex gap-2">
              <button onClick={onInteract} className="text-white/70 hover:text-white transition-colors">
                <MessageCircle className="h-5 w-5" />
              </button>
              <button onClick={onInteract} className="text-white/70 hover:text-wonderwhiz-gold transition-colors">
                <Bookmark className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-cyan/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default EnhancedContentBlock;
