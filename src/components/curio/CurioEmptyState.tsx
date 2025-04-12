
import React from 'react';
import { SearchX } from 'lucide-react';

interface CurioEmptyStateProps {
  message?: string;
  onReset?: () => void;
}

const CurioEmptyState: React.FC<CurioEmptyStateProps> = ({ 
  message = "No content found",
  onReset
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
        <SearchX className="text-white/70 h-8 w-8" />
      </div>
      <p className="text-white/70 mb-4 max-w-md">{message}</p>
      
      {onReset && (
        <button
          onClick={onReset}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default CurioEmptyState;
