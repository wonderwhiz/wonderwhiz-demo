
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

interface BlockHeaderProps {
  type: string;
  specialistId: string;
  tag?: string;
}

const BlockHeader: React.FC<BlockHeaderProps> = ({ type, specialistId, tag }) => {
  const getIconForType = () => {
    switch(type) {
      case 'Fact': return <Globe className="h-4 w-4" />;
      case 'Fun Fact': return <Star className="h-4 w-4" />;
      case 'Quiz': return <Activity className="h-4 w-4" />;
      case 'Creative': return <Sparkles className="h-4 w-4" />;
      case 'Mindfulness': return <Sun className="h-4 w-4" />;
      case 'News': return <Newspaper className="h-4 w-4" />;
      case 'Flashcard': return <BookOpen className="h-4 w-4" />;
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
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="bg-white/10 border-none text-white/80 hover:bg-white/20">
          <span className="mr-1">{getIconForType()}</span>
          {type}
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
