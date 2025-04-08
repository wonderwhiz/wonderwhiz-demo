
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, BookOpen, ArrowDown, Compass, Map } from 'lucide-react';
import { Link } from 'react-router-dom';

const CurioBlockListNoMore: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className="flex flex-col items-center py-6 sm:py-8 relative mt-8"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-10 top-10 w-20 h-20 rounded-full bg-purple-500/10 blur-xl" />
        <div className="absolute -right-10 top-5 w-16 h-16 rounded-full bg-cyan-500/10 blur-xl" />
        <div className="absolute right-20 bottom-10 w-24 h-24 rounded-full bg-amber-500/10 blur-xl" />
      </div>
      
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow flex items-center justify-center mb-3 shadow-glow-brand-gold">
        <Sparkles className="h-7 w-7 text-white" />
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 font-nunito bg-clip-text text-transparent bg-gradient-to-r from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink">
        Learning adventure complete!
      </h3>
      
      <p className="text-white/70 text-sm sm:text-base max-w-md text-center mb-5">
        You've reached the end of this exploration. Now it's time to dive deeper into related topics that might spark your curiosity!
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mb-6">
        <motion.div 
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="group bg-gradient-to-br from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 p-3 rounded-lg border border-white/10 hover:border-white/20 text-center cursor-pointer"
        >
          <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Map className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
          </div>
          <p className="text-white text-sm">Explore related topics</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="group bg-gradient-to-br from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20 p-3 rounded-lg border border-white/10 hover:border-white/20 text-center cursor-pointer"
        >
          <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <BookOpen className="h-5 w-5 text-pink-300 group-hover:text-pink-200" />
          </div>
          <p className="text-white text-sm">Try a hands-on activity</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="group bg-gradient-to-br from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 p-3 rounded-lg border border-white/10 hover:border-white/20 text-center cursor-pointer"
        >
          <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <Compass className="h-5 w-5 text-cyan-300 group-hover:text-cyan-200" />
          </div>
          <p className="text-white text-sm">Ask a follow-up question</p>
        </motion.div>
      </div>
      
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
        <span className="text-wonderwhiz-gold text-sm font-medium">Keep scrolling for more wonders</span>
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
