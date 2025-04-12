import React, { useState } from 'react';

export interface ActivityBlockProps {
  content: {
    activity: string;
    title: string;
    instructions: string;
    steps: string[];
  };
  specialistId: string;
  onActivityComplete?: () => void;
  updateHeight?: (height: number) => void;
}

const ActivityBlock: React.FC<ActivityBlockProps> = ({
  content,
  specialistId,
  onActivityComplete,
  updateHeight
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (containerRef.current && updateHeight) {
      const height = containerRef.current.offsetHeight;
      setContainerHeight(height);
      updateHeight(height);
    }
  }, [isStarted, currentStep, isCompleted, updateHeight]);
  
  const handleStart = () => {
    setIsStarted(true);
  };
  
  const handleNextStep = () => {
    if (currentStep < content.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
      if (onActivityComplete) {
        onActivityComplete();
      }
    }
  };
  
  return (
    <div ref={containerRef} className="p-3 bg-indigo-500/10 backdrop-blur-md rounded-lg">
      <div className="p-4 border border-indigo-500/20 rounded-lg">
        <h3 className="text-white font-medium mb-2">{content.title || 'Fun Activity'}</h3>
        
        {!isStarted ? (
          <>
            <p className="text-white/90 mb-4">{content.instructions || content.activity}</p>
            <button
              onClick={handleStart}
              className="w-full py-2 bg-indigo-500/60 hover:bg-indigo-500/80 text-white text-sm rounded-md transition-colors"
            >
              Start Activity
            </button>
          </>
        ) : !isCompleted ? (
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-md">
              <p className="text-white/90">{content.steps[currentStep]}</p>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-xs text-white/60">
                Step {currentStep + 1} of {content.steps.length}
              </div>
              <button
                onClick={handleNextStep}
                className="px-4 py-1.5 bg-indigo-500/60 hover:bg-indigo-500/80 text-white text-sm rounded-md transition-colors"
              >
                {currentStep < content.steps.length - 1 ? 'Next Step' : 'Complete Activity'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-2">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-white font-medium mb-1">Activity Completed!</h4>
            <p className="text-white/70 text-sm mb-3">Great job! You've earned sparks for completing this activity.</p>
            <button
              onClick={() => {
                setIsStarted(false);
                setIsCompleted(false);
                setCurrentStep(0);
              }}
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-md transition-colors"
            >
              Do it again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityBlock;
