
import React from 'react';

interface ConfettiTriggerProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  duration?: number;
}

// Simplified - no automatic confetti triggers
const ConfettiTrigger: React.FC<ConfettiTriggerProps> = ({ 
  children,
}) => {
  return (
    <div className="inline-block">
      {children}
    </div>
  );
};

export default ConfettiTrigger;
