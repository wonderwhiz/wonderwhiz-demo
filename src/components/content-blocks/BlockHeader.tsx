
import React from 'react';
import { ContentBlockType } from '@/types/curio';
import { getSpecialistInfo } from '@/lib/specialists';

export interface BlockHeaderProps {
  type: ContentBlockType;
  specialistId: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ type, specialistId }) => {
  const specialist = getSpecialistInfo(specialistId);
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-full overflow-hidden bg-white/10">
          {specialist?.avatar ? (
            <img 
              src={specialist.avatar} 
              alt={specialist?.name || specialistId} 
              className="h-10 w-10 object-cover"
            />
          ) : (
            <div className="h-10 w-10 bg-gradient-to-br from-indigo-600 to-pink-600"></div>
          )}
        </div>
        
        <div>
          <h3 className="font-semibold text-white text-sm">
            {specialist?.name || specialistId}
          </h3>
          <div className="text-xs text-white/60">
            {specialist?.title || 'Specialist'}
          </div>
        </div>
      </div>
      
      <div className="text-xs font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white">
        {type === 'funFact' ? 'Fun Fact' : type.charAt(0).toUpperCase() + type.slice(1)}
      </div>
    </div>
  );
};

export default BlockHeader;
