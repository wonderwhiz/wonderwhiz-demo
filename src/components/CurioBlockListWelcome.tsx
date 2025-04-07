
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface CurioBlockListWelcomeProps {
  childProfile: any;
}

const CurioBlockListWelcome: React.FC<CurioBlockListWelcomeProps> = ({ childProfile }) => {
  return (
    <div className="mb-8 sm:mb-10">
      <motion.div 
        className="bg-gradient-to-br from-wonderwhiz-purple/30 to-wonderwhiz-deep-purple/40 rounded-xl p-6 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-4">
          <div className="mr-3 bg-gradient-to-br from-wonderwhiz-vibrant-yellow to-wonderwhiz-bright-pink p-2 rounded-full">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold font-nunito text-white">
            Welcome to your discovery journey!
          </h3>
        </div>
        
        <p className="text-white/80 mb-4 font-inter">
          {childProfile?.name ? `Hi ${childProfile.name}! ` : ''}
          We're preparing an amazing collection of wonders just for you. 
          Scroll down to begin exploring and feed your curious mind!
        </p>
        
        <div className="text-sm text-white/60 font-inter">
          <p>Discover interesting facts, take quizzes, and go on learning adventures.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CurioBlockListWelcome;
