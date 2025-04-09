
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Stars, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CurioEmptyState: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative w-24 h-24 mb-6">
        <motion.div 
          className="absolute inset-0 rounded-full bg-wonderwhiz-bright-pink/20 blur-xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="relative flex items-center justify-center h-full">
          <Lightbulb className="h-12 w-12 text-wonderwhiz-gold" />
          <motion.div
            className="absolute -top-3 -right-3"
            animate={{
              y: [-2, 2, -2],
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Sparkles className="h-6 w-6 text-wonderwhiz-vibrant-yellow" />
          </motion.div>
        </div>
      </div>
      
      <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 font-nunito">Let's Begin Your Discovery!</h3>
      <p className="text-white/70 max-w-md text-center mb-6">
        Ask a question about anything you're curious about, and we'll create an amazing learning journey just for you!
      </p>
      
      <Button
        variant="outline"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-wonderwhiz-vibrant-yellow transition-all group"
      >
        <Stars className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        <span>Try a Suggested Topic</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
