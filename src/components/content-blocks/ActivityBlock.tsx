
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ActivityBlockProps {
  content: {
    activity: string;
  };
  onActivityComplete?: () => void;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ content, onActivityComplete }) => {
  const [completed, setCompleted] = useState(false);
  
  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      if (onActivityComplete) {
        onActivityComplete();
      }
    }
  };
  
  return (
    <div>
      <motion.p 
        className="text-white text-sm sm:text-base mb-2 sm:mb-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {content.activity}
      </motion.p>
      
      {!completed ? (
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleComplete}
            className="bg-wonderwhiz-purple hover:bg-wonderwhiz-purple/80 text-white text-xs sm:text-sm"
          >
            I Did This Activity
          </Button>
        </motion.div>
      ) : (
        <motion.div 
          className="flex items-center text-green-400 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Check className="mr-1 h-4 w-4" />
          Great job! You earned 3 sparks for completing this activity!
        </motion.div>
      )}
    </div>
  );
};

export default ActivityBlock;
