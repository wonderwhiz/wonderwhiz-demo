
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface CurioErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const CurioErrorState: React.FC<CurioErrorStateProps> = ({ 
  message = "Something went wrong",
  onRetry
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="text-red-400 h-8 w-8" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Oops!</h3>
      <p className="text-white/70 mb-4 max-w-md">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default CurioErrorState;
