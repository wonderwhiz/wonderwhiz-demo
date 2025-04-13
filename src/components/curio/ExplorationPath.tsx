
import React from 'react';
import { ChevronRight, Compass, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface ExplorationPathProps {
  path: string[];
  onNavigate: (index: number) => void;
  childAge?: number;
}

const ExplorationPath: React.FC<ExplorationPathProps> = ({ 
  path, 
  onNavigate, 
  childAge = 10 
}) => {
  // Helper to generate encouraging labels based on exploration depth
  const getExplorationLabel = (depth: number): string => {
    if (depth <= 1) return "Just getting started!";
    if (depth <= 2) return "Building knowledge!";
    if (depth <= 3) return "Curious explorer!";
    if (depth <= 5) return "Deep thinker!";
    return "Curiosity champion!";
  };

  // Determine if we should use simple or detailed path for young children
  const useSimplePath = childAge < 8 && path.length > 3;
  
  // For young children with long paths, simplify to start → ... → current
  const displayPath = useSimplePath 
    ? [path[0], path[path.length - 1]] 
    : path;

  return (
    <div className="mb-6 bg-wonderwhiz-deep-purple/30 p-3 rounded-lg border border-white/10">
      <p className="text-xs text-white/60 mb-2 flex items-center">
        <Compass className="h-3.5 w-3.5 mr-1.5 text-wonderwhiz-cyan" />
        Your Wonder Journey
      </p>
      
      <div className="overflow-x-auto whitespace-nowrap scrollbar-hide">
        <div className="flex items-center space-x-1">
          {displayPath.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <>
                  {useSimplePath && index === 1 && (
                    <div className="flex items-center px-2">
                      <div className="h-1 w-1 rounded-full bg-white/30"></div>
                      <div className="h-1 w-1 rounded-full bg-white/30 mx-1"></div>
                      <div className="h-1 w-1 rounded-full bg-white/30"></div>
                    </div>
                  )}
                  
                  {(!useSimplePath || index === 1) && (
                    <ChevronRight className="h-4 w-4 text-white/50 flex-shrink-0" />
                  )}
                </>
              )}
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  className={`px-2 py-1 rounded text-sm ${
                    (!useSimplePath && index === path.length - 1) || (useSimplePath && index === 1)
                      ? 'bg-wonderwhiz-purple/50 text-wonderwhiz-vibrant-yellow font-medium border border-white/20'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => onNavigate(useSimplePath && index === 1 ? path.length - 1 : index)}
                >
                  {item.length > 25 ? `${item.substring(0, 25)}...` : item}
                </Button>
              </motion.div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Rabbit Hole Context - Shows the journey's depth */}
      {path.length > 1 && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-white/60">
            Exploration Depth: {path.length} • {getExplorationLabel(path.length)}
          </span>
          
          {path.length >= 3 && (
            <div className="flex">
              {[...Array(Math.min(path.length, 5))].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < path.length ? 'text-wonderwhiz-gold' : 'text-white/20'
                  }`}
                  fill={i < path.length ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExplorationPath;
