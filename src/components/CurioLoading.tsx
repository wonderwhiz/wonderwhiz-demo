
import React from 'react';
import { Loader2 } from 'lucide-react';

const CurioLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-wonderwhiz-purple" />
        <p className="text-white text-sm">Loading your curio...</p>
      </div>
    </div>
  );
};

export default CurioLoading;
