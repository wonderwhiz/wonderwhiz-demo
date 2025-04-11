
import React from 'react';
import { Loader2 } from 'lucide-react';

interface CurioLoadingStateProps {
  message?: string;
}

const CurioLoadingState: React.FC<CurioLoadingStateProps> = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="h-8 w-8 text-white/50 animate-spin" />
      <p className="text-white/70 text-sm">{message}</p>
    </div>
  );
};

export default CurioLoadingState;
