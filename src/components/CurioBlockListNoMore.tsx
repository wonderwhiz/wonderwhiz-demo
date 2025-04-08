
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowDown } from 'lucide-react';

const CurioBlockListNoMore: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center py-6 sm:py-8 relative"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-10 top-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl" />
        <div className="absolute -right-10 top-5 w-16 h-16 rounded-full bg-cyan-500/10 blur-xl" />
      </div>
      
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center mb-3 shadow-glow-brand-gold">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-nunito bg-clip-text text-transparent bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink">
        Learning adventure complete!
      </h3>
      
      <p className="text-white/70 text-sm sm:text-base max-w-md text-center mb-4">
        You've reached the end of this exploration. Scroll down to discover more
        related topics to continue your learning journey!
      </p>
      
      <div className="flex items-center justify-center gap-2 mb-2">
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }}
        >
          <ArrowDown className="h-5 w-5 text-wonderwhiz-gold" />
        </motion.div>
        <span className="text-wonderwhiz-gold text-sm font-medium">Keep scrolling for more</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }}
        >
          <ArrowDown className="h-5 w-5 text-wonderwhiz-gold" />
        </motion.div>
      </div>
      
      <div className="mt-2 flex items-center justify-center">
        <BookOpen className="h-4 w-4 text-white/40 mr-2" />
        <span className="text-white/40 text-xs">Explore the rabbit hole suggestions below</span>
      </div>
    </motion.div>
  );
};

export default CurioBlockListNoMore;
