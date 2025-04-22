
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Award, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskBlockProps } from './interfaces';
import { useAgeAdaptation } from '@/hooks/useAgeAdaptation';

const TaskBlock: React.FC<TaskBlockProps> = ({
  content,
  specialistId,
  onTaskComplete,
  updateHeight,
  childAge = 10
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const { textSize, interactionStyle, messageStyle } = useAgeAdaptation(childAge);
  
  const handleComplete = () => {
    setIsCompleted(true);
    if (onTaskComplete) {
      onTaskComplete();
    }
  };
  
  const getTitle = () => {
    return content.title || (messageStyle === 'playful' ? 
      "Fun Challenge!" : 
      messageStyle === 'casual' ? 
        "Your Task" : 
        "Learning Task"
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-amber-600/20 to-orange-600/20 p-4 rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-amber-500/20 rounded-full">
          <CheckSquare className="h-5 w-5 text-amber-400" />
        </div>
        <h3 className={`text-white font-medium ${textSize}`}>{getTitle()}</h3>
      </div>
      
      <div className={`mb-4 ${textSize}`}>
        <p className="text-white/90 mb-3">{content.task}</p>
        
        {content.description && (
          <p className="text-white/80 mb-3">{content.description}</p>
        )}
      </div>
      
      {content.steps && Array.isArray(content.steps) && content.steps.length > 0 && (
        <div className="mb-4 bg-white/5 p-3 rounded-lg">
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
      
      {content.reward && (
        <div className="mb-4 p-3 bg-amber-500/10 rounded-lg flex items-center gap-2">
          <Award className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className={`text-white/90 ${childAge <= 7 ? 'text-base' : 'text-sm'}`}>
            {childAge <= 7 ? `You'll earn: ${content.reward}` : `Reward: ${content.reward}`}
          </p>
        </div>
      )}
      
      {!isCompleted ? (
        <Button
          onClick={handleComplete}
          className={`w-full bg-amber-500/80 hover:bg-amber-500 ${interactionStyle}`}
        >
          {childAge <= 7 ? "I Completed This!" : "Mark as Completed"}
        </Button>
      ) : (
        <div className="flex items-center justify-center gap-2 p-3 bg-green-500/20 rounded-lg text-white">
          <Check className="h-5 w-5 text-green-400" />
          <span className={textSize}>
            {messageStyle === 'playful' ? 
              "Woohoo! Task completed - you're amazing!" : 
              messageStyle === 'casual' ? 
                "Great job! Task completed successfully." : 
                "Task marked as complete."
            }
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default TaskBlock;
