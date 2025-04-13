
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExplorationPathProps {
  path: string[];
  onNavigate: (index: number) => void;
}

const ExplorationPath: React.FC<ExplorationPathProps> = ({ path, onNavigate }) => {
  return (
    <div className="mb-6 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <div className="flex items-center space-x-1">
        {path.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-white/50 flex-shrink-0" />
            )}
            <Button
              variant="ghost"
              className={`px-2 py-1 rounded text-sm ${
                index === path.length - 1
                  ? 'bg-purple-700/30 text-purple-200 font-medium'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
              onClick={() => onNavigate(index)}
            >
              {item.length > 25 ? `${item.substring(0, 25)}...` : item}
            </Button>
          </React.Fragment>
        ))}
      </div>
      
      {/* Rabbit Hole Context - Shows the journey's depth */}
      {path.length > 1 && (
        <div className="mt-2 text-xs text-white/60">
          <span>Exploration Depth: {path.length} • {getExplorationLabel(path.length)}</span>
        </div>
      )}
    </div>
  );
};

// Helper to generate encouraging labels based on exploration depth
const getExplorationLabel = (depth: number): string => {
  if (depth <= 1) return "Just getting started!";
  if (depth <= 2) return "Building knowledge!";
  if (depth <= 3) return "Curious explorer!";
  if (depth <= 5) return "Deep thinker!";
  return "Curiosity champion!";
};

export default ExplorationPath;
