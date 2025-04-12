
import React from 'react';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ 
  message = "Loading amazing content..."
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 relative mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
        <div className="absolute inset-3 rounded-full border-4 border-pink-500/30 border-r-pink-500 animate-spin-slow"></div>
      </div>
      <p className="text-white/70 max-w-md">{message}</p>
    </div>
  );
};

export default CurioLoadingState;
