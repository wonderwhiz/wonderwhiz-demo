
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSpecialistName, getSpecialistAvatarUrl } from './utils/specialistUtils';

export interface BlockHeaderProps {
  specialistId: string;
  blockTitle?: string;
  blockType?: string;
  narrativePosition?: 'beginning' | 'middle' | 'end';
  type: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({
  specialistId,
  blockTitle,
  blockType,
  narrativePosition,
  type
}) => {
  const specialistName = getSpecialistName(specialistId);
  const specialistRole = getSpecialistRole(specialistId, type);
  const avatarUrl = getSpecialistAvatarUrl(specialistId);
  
  const getSpecialistEmoji = () => {
    switch (specialistId) {
      case 'nova': return '🚀';
      case 'spark': return '✨';
      case 'prism': return '🔬';
      case 'pixel': return '💻';
      case 'atlas': return '🗺️';
      case 'lotus': return '🌱';
      default: return '🧠';
    }
  };
  
  const getThoughtBubble = () => {
    if (!narrativePosition || narrativePosition !== 'beginning') return null;
    
    let thought = '';
    
    switch (blockType) {
      case 'fact':
        thought = "Let's start our cosmic journey of discovery!";
        break;
      case 'quiz':
        thought = "Think carefully about what we've learned so far!";
        break;
      case 'creative':
        thought = "Let's express our learning through creativity!";
        break;
      case 'mindfulness':
        thought = "Let's take a moment to reflect and connect with what we're learning.";
        break;
      default:
        thought = "I'm excited to explore this with you!";
    }
    
    return (
      <div className="text-xs text-white/60 mb-2">
        {thought}
      </div>
    );
  };
  
  return (
    <div className="p-3 pb-2 border-b border-white/10">
      <div className="flex items-center">
        <div className="mr-3 relative">
          <Avatar className="h-10 w-10 border-2 border-white/20">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{getSpecialistEmoji()}</AvatarFallback>
          </Avatar>
        </div>
        
        <div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white">{specialistName}</span>
            <span className="text-white/50">•</span>
          </div>
          <p className="text-white/60 text-xs">{specialistRole}</p>
        </div>
      </div>
      
      {getThoughtBubble()}
    </div>
  );
};

function getSpecialistRole(specialistId: string, blockType: string): string {
  switch (specialistId) {
    case 'nova':
      return 'Space Expert';
    case 'spark':
      return blockType === 'creative' ? 'Imagination Catalyst' : 'Creative Genius';
    case 'prism':
      return 'Science Whiz';
    case 'pixel':
      return 'Tech Guru';
    case 'atlas':
      return 'History Explorer';
    case 'lotus':
      return 'Nature Guide';
    default:
      return 'Wonder Specialist';
  }
}

export default BlockHeader;
