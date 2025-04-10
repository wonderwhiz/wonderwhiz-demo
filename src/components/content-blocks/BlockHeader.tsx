
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Star, 
  Activity, 
  Sparkles, 
  Sun, 
  Newspaper, 
  BookOpen
} from 'lucide-react';

export interface BlockHeaderProps {
  type: string;
  specialistId: string;
  tag?: string;
  blockTitle?: string;
  blockType?: any;
  narrativePosition?: "end" | "middle" | "beginning";
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ 
  type, 
  specialistId, 
  tag,
  blockTitle,
  blockType,
  narrativePosition 
}) => {
  const getIconForType = () => {
    const typeToCheck = blockType || type;
    
    switch(typeToCheck) {
      case 'Fact':
      case 'fact': return <Globe className="h-4 w-4" />;
      case 'Fun Fact':
      case 'funFact': return <Star className="h-4 w-4" />;
      case 'Quiz':
      case 'quiz': return <Activity className="h-4 w-4" />;
      case 'Creative':
      case 'creative': return <Sparkles className="h-4 w-4" />;
      case 'Mindfulness':
      case 'mindfulness': return <Sun className="h-4 w-4" />;
      case 'News':
      case 'news': return <Newspaper className="h-4 w-4" />;
      case 'Flashcard':
      case 'flashcard': return <BookOpen className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };
  
  const getSpecialistName = (id: string) => {
    switch(id) {
      case 'nova': return 'Nova';
      case 'spark': return 'Spark';
      case 'prism': return 'Prism';
      case 'pixel': return 'Pixel';
      case 'atlas': return 'Atlas';
      case 'lotus': return 'Lotus';
      default: return 'Specialist';
    }
  };
  
  const getSpecialistColor = (id: string) => {
    switch(id) {
      case 'nova': return 'bg-indigo-800/60';
      case 'spark': return 'bg-orange-800/60';
      case 'prism': return 'bg-pink-800/60';
      case 'pixel': return 'bg-blue-800/60';
      case 'atlas': return 'bg-amber-800/60';
      case 'lotus': return 'bg-green-800/60';
      default: return 'bg-gray-800/60';
    }
  };
  
  // Use provided blockTitle or fall back to type
  const displayTitle = blockTitle || type;
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-white/10 border-none text-white/80 hover:bg-white/20">
          <span className="mr-1">{getIconForType()}</span>
          {displayTitle}
        </Badge>
        
        {tag && (
          <Badge variant="outline" className="bg-violet-900/40 border-none text-white/80 hover:bg-violet-900/60">
            {tag}
          </Badge>
        )}
      </div>
      
      <Badge className={`${getSpecialistColor(specialistId)} border-none text-white`}>
        {getSpecialistName(specialistId)}
      </Badge>
    </div>
  );
};

export default BlockHeader;
