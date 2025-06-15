
import React from 'react';
import { motion } from 'framer-motion';
import MagicWand from '@/components/MagicWand';
import HeroFeed from './HeroFeed';

const HeroPhoneMockup = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.8, delay: 0.2 }} 
      className="relative"
    >
      <div className="relative mx-auto max-w-[350px]">
        <div className="absolute -top-10 -right-10 animate-float">
          <MagicWand />
        </div>
        
        {/* Phone mockup */}
        <div className="relative bg-black rounded-[40px] p-3 border-[10px] border-gray-800 shadow-2xl transform hover:rotate-1 transition-transform duration-500">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-6 bg-black rounded-b-lg"></div>
          <div className="rounded-[30px] overflow-hidden bg-wonderwhiz-gradient pt-6 pb-10 px-4">
            <HeroFeed />
          </div>
        </div>
        
        {/* Sparkles */}
        <div className="absolute -top-5 left-0 h-5 w-5 star-sparkle" style={{
        animationDelay: "0.2s"
      }}></div>
        <div className="absolute top-1/4 -right-4 h-4 w-4 star-sparkle" style={{
        animationDelay: "0.5s"
      }}></div>
        <div className="absolute bottom-10 -left-6 h-6 w-6 star-sparkle" style={{
        animationDelay: "0.8s"
      }}></div>
      </div>
    </motion.div>
  );
};

export default HeroPhoneMockup;
