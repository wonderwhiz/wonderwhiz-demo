
import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Sparkles, Brain, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Following Alison Folino's Emmy award-winning children's content expertise
// and Dr. Susana Zhang's child psychology principles
const CurioEmptyState: React.FC = () => {
  // Array of starter questions following June Sobel's storytelling approach
  const starterQuestions = [
    "Why do stars twinkle in the night sky?",
    "How do birds know where to fly in winter?",
    "What makes rainbows appear after rain?",
    "Why do we dream when we sleep?"
  ];
  
  // Select a random starter question
  const randomQuestion = starterQuestions[Math.floor(Math.random() * starterQuestions.length)];
  
  // Following Chris Bennett's child engagement principles and Sada's content leadership
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
    >
      <div className="relative w-28 h-28 mb-8">
        {/* Animated background glow - child-friendly visual feedback */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow blur-xl"
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
        
        {/* Central icon with floating elements - creates wonder and intrigue */}
        <div className="relative flex items-center justify-center h-full">
          <Lightbulb className="h-14 w-14 text-wonderwhiz-gold" />
          
          {/* Floating elements that create playfulness */}
          <motion.div
            className="absolute -top-4 -right-3"
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
            <Sparkles className="h-7 w-7 text-wonderwhiz-bright-pink" />
          </motion.div>
          
          <motion.div
            className="absolute -bottom-2 -left-4"
            animate={{
              y: [2, -2, 2],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.5
            }}
          >
            <Brain className="h-6 w-6 text-wonderwhiz-cyan" />
          </motion.div>
          
          <motion.div
            className="absolute top-2 -left-6"
            animate={{
              y: [-3, 3, -3],
              x: [1, -1, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 0.8
            }}
          >
            <Rocket className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          </motion.div>
        </div>
      </div>
      
      {/* Clear, engaging heading based on child psychology principles */}
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 font-nunito">
        What Are You Curious About Today?
      </h3>
      
      {/* Friendly, encouraging description - aligned with Dr. Hua's cognitive engagement principles */}
      <p className="text-white/80 max-w-md text-center mb-6 text-lg">
        Ask me anything that makes you wonder, and I'll create an amazing learning adventure just for you!
      </p>
      
      {/* Example question bubble - makes starting easier per Susana Zhang's recommendation */}
      <motion.div 
        className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4 mb-6 max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-white/90 italic">"{randomQuestion}"</p>
        <div className="flex justify-end mt-2">
          <p className="text-wonderwhiz-gold text-sm">Try asking this!</p>
        </div>
      </motion.div>
      
      {/* Simplified, focused action button - follows UX principles */}
      <Button
        variant="outline"
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-wonderwhiz-vibrant-yellow transition-all group"
        size="lg"
      >
        <Sparkles className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
        <span>Ask a Question</span>
      </Button>
    </motion.div>
  );
};

export default CurioEmptyState;
