
import React from 'react';
import { SearchX } from 'lucide-react';

const CurioEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <SearchX className="h-12 w-12 text-white/30" />
      <h3 className="text-white/80 text-lg font-medium">No results found</h3>
      <p className="text-white/50 text-sm">Try modifying your search or explore new topics.</p>
    </div>
  );
};

export default CurioEmptyState;
