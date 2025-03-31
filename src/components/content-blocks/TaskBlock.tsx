
import React from 'react';

interface TaskBlockProps {
  content: {
    task: string;
    reward: string | number;
  };
}

const TaskBlock: React.FC<TaskBlockProps> = ({ content }) => {
  return (
    <div>
      <p className="text-white mb-1 text-sm sm:text-base">{content.task}</p>
      <p className="text-wonderwhiz-gold flex items-center text-xs sm:text-sm">
        <span className="inline-block mr-1">✨</span> 
        Earn {content.reward} sparks by completing this task!
      </p>
    </div>
  );
};

export default TaskBlock;
