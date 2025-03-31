
import React from 'react';

interface ActivityBlockProps {
  content: {
    activity: string;
  };
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({ content }) => {
  return (
    <div>
      <p className="text-white text-sm sm:text-base">{content.activity}</p>
    </div>
  );
};

export default ActivityBlock;
