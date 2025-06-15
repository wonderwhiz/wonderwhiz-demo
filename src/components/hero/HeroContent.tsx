
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Sparkles, Rocket } from 'lucide-react';

const HeroContent = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8 }} 
      className="text-center md:text-left"
    >
      <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight mb-6 text-white group">
        The discovery engine that <span className="text-wonderwhiz-pink relative">
          feeds kids' curiosity
          <span className="absolute -top-6 -right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="h-8 w-8 text-wonderwhiz-pink filter drop-shadow-lg" />
          </span>
        </span>—one scroll at a time.
      </h1>
      <p className="text-lg md:text-xl mb-8 text-gray-200">
        Turn screen time into growth time. WonderWhiz transforms your child's natural curiosity into daily habits, smart thinking, and joyful learning.
      </p>
      <p className="text-sm md:text-base mb-10 text-gray-300">Trusted by parents building smarter habits at home.</p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center md:justify-start">
        <Link to="/login">
          <Button className="jelly-button w-full sm:w-auto text-lg group relative overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Try WonderWhiz
              <Rocket className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <span className="absolute inset-0 bg-white bg-opacity-20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
          </Button>
        </Link>
      </div>
    </motion.div>
  );
};

export default HeroContent;
