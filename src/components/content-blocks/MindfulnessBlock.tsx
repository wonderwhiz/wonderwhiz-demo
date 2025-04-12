import React, { useState, useEffect } from 'react';

export interface MindfulnessBlockProps {
  content: {
    instruction: string;
    duration: number;
    title: string;
    benefit: string;
  };
  specialistId: string;
  onMindfulnessComplete?: () => void;
  updateHeight?: (height: number) => void;
}

const MindfulnessBlock: React.FC<MindfulnessBlockProps> = ({
  content,
  specialistId,
  onMindfulnessComplete,
  updateHeight
}) => {
  const [timer, setTimer] = useState(content.duration);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isActive && timer > 0) {
      intervalId = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false);
      if (onMindfulnessComplete) {
        onMindfulnessComplete();
      }
    }

    return () => clearInterval(intervalId);
  }, [isActive, timer, onMindfulnessComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
      <div className="p-4 border border-white/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">{content.title}</h3>
        <p className="text-white/90 mb-4">{content.instruction}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/70">Time Remaining: {formatTime(timer)}</span>
          <button
            onClick={toggleTimer}
            className="px-4 py-2 bg-indigo-500/60 hover:bg-indigo-500/80 text-white text-sm rounded-md transition-colors"
          >
            {isActive ? 'Pause' : 'Start'}
          </button>
        </div>
        
        <p className="text-white/70 text-sm">
          Benefit: {content.benefit}
        </p>
      </div>
    </div>
  );
};

export default MindfulnessBlock;
