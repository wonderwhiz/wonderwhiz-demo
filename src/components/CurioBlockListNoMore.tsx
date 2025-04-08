
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowDown, Compass, Map, Rocket, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';

const CurioBlockListNoMore: React.FC = () => {
  // Trigger confetti when component mounts
  React.useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center py-8 sm:py-10 relative mt-8"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute -left-10 top-10 w-24 h-24 rounded-full bg-purple-500/20 blur-xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4] 
          }}
          transition={{ repeat: Infinity, duration: 5, delay: 0.5 }}
          className="absolute -right-10 top-5 w-20 h-20 rounded-full bg-cyan-500/20 blur-xl" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4] 
          }}
          transition={{ repeat: Infinity, duration: 4.5, delay: 1 }}
          className="absolute right-20 bottom-10 w-28 h-28 rounded-full bg-amber-500/20 blur-xl" 
        />
      </div>
      
      <motion.div 
        className="w-16 h-16 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center mb-4 shadow-glow-brand-gold"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="h-8 w-8 text-white" />
      </motion.div>
      
      <motion.h3 
        className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 font-nunito bg-clip-text text-transparent bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink"
        animate={{ 
          scale: [1, 1.03, 1],
          y: [0, -2, 0] 
        }}
        transition={{ repeat: Infinity, duration: 3, delay: 0.2 }}
      >
        Awesome exploring!
      </motion.h3>
      
      <p className="text-white/80 text-base sm:text-lg max-w-md text-center mb-6">
        You've reached the end of this adventure! What would you like to explore next?
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mb-8">
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative bg-gradient-to-br from-purple-500/15 to-indigo-500/15 hover:from-purple-500/30 hover:to-indigo-500/30 p-4 rounded-xl border border-white/10 hover:border-white/20 text-center cursor-pointer overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "mirror" }}
          />
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Map className="h-6 w-6 text-purple-300 group-hover:text-purple-200" />
          </div>
          <p className="text-white text-md font-medium">Discover New Topics</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative bg-gradient-to-br from-pink-500/15 to-rose-500/15 hover:from-pink-500/30 hover:to-rose-500/30 p-4 rounded-xl border border-white/10 hover:border-white/20 text-center cursor-pointer overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "mirror" }}
          />
          <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <BookOpen className="h-6 w-6 text-pink-300 group-hover:text-pink-200" />
          </div>
          <p className="text-white text-md font-medium">Try a Fun Activity</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.98 }}
          className="group relative bg-gradient-to-br from-cyan-500/15 to-blue-500/15 hover:from-cyan-500/30 hover:to-blue-500/30 p-4 rounded-xl border border-white/10 hover:border-white/20 text-center cursor-pointer overflow-hidden"
        >
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
            animate={{ 
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{ repeat: Infinity, duration: 3, repeatType: "mirror" }}
          />
          <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <Rocket className="h-6 w-6 text-cyan-300 group-hover:text-cyan-200" />
          </div>
          <p className="text-white text-md font-medium">Ask a New Question</p>
        </motion.div>
      </div>
      
      <div className="flex items-center justify-center mb-4">
        <motion.div
          animate={{ 
            y: [0, 5, 0],
            rotate: [-5, 5, -5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut" 
          }}
          className="flex items-center gap-2 bg-wonderwhiz-gold/20 px-4 py-2 rounded-full"
        >
          <Star className="h-5 w-5 text-wonderwhiz-gold" />
          <span className="text-wonderwhiz-gold text-sm font-medium">Keep scrolling for more wonders</span>
          <Star className="h-5 w-5 text-wonderwhiz-gold" />
        </motion.div>
      </div>
      
      <div className="mt-3 flex items-center justify-center bg-white/5 px-3 py-1.5 rounded-full">
        <BookOpen className="h-4 w-4 text-white/60 mr-2" />
        <span className="text-white/60 text-xs">Explore the rabbit hole suggestions below</span>
      </div>
    </motion.div>
  );
};

export default CurioBlockListNoMore;
