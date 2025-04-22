
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ActivityBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

const ActivityBlock: React.FC<ActivityBlockProps> = ({
  content,
  specialistId,
  onActivityComplete,
  updateHeight,
  childAge = 10
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  
  const handleComplete = () => {
    setIsCompleted(true);
    if (onActivityComplete) {
      onActivityComplete();
    }
  };
  
  const getTitle = () => {
    return content.title || (messageStyle === 'playful' ? 
      "Fun Activity Time!" : 
      messageStyle === 'casual' ? 
        "Let's Try This Activity" : 
        "Activity"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-500/20 rounded-full">
          <Activity className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className={`text-white font-medium ${textSize}`}>{getTitle()}</h3>
      </div>
      
      <div className={`mb-6 ${textSize}`}>
        <p className="text-white/90 mb-4">{content.activity || content.instructions}</p>
        
        {content.steps && Array.isArray(content.steps) && content.steps.length > 0 && (
          <div className="mt-4 bg-white/5 p-3 rounded-lg">
            <h4 className={`text-white/90 font-medium mb-2 ${
              childAge <= 7 ? 'text-base' : 'text-sm'
            }`}>
              {childAge <= 7 ? "Here's what to do:" : "Steps:"}
            </h4>
            <ol className={`list-decimal pl-5 ${
              childAge <= 7 ? 'space-y-3 text-base' : 'space-y-2 text-sm'
            }`}>
              {content.steps.map((step, index) => (
                <li key={index} className="text-white/80">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
      
      {!isCompleted ? (
        <Button
          onClick={handleComplete}
          className={`w-full bg-blue-500/80 hover:bg-blue-500 ${interactionStyle}`}
        >
          {childAge <= 7 ? "I Did It!" : "Mark as Completed"}
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 rounded-lg text-white">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <span className={textSize}>
            {messageStyle === 'playful' ? 
              "Awesome job! You completed the activity!" : 
              messageStyle === 'casual' ? 
                "Great work! Activity completed." : 
                "Activity completed successfully."
            }
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ActivityBlock;
