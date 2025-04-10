
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Compass, Map, Rocket, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CosmicFlowProps {
  blocks: any[];
  currentBlockIndex: number;
  onNavigate: (index: number) => void;
  ageGroup: '5-7' | '8-11' | '12-16';
  activeSection?: string;
}

// Define colors for the cosmic flow
const cosmicColors = {
  introduction: 'from-purple-500 to-indigo-500',
  exploration: 'from-indigo-500 to-blue-500',
  understanding: 'from-blue-500 to-cyan-500',
  challenge: 'from-cyan-500 to-teal-500',
  creation: 'from-teal-500 to-green-500',
  reflection: 'from-green-500 to-yellow-500',
  nextSteps: 'from-yellow-500 to-orange-500',
};

const CosmicFlow: React.FC<CosmicFlowProps> = ({
  blocks,
  currentBlockIndex,
  onNavigate,
  ageGroup,
  activeSection
}) => {
  const [showMap, setShowMap] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [flowPoints, setFlowPoints] = useState<{id: string, label: string, type: string, section: string}[]>([]);
  
  // Detect scroll to make the flow compact
  useEffect(() => {
    const handleScroll = () => {
      setIsCompact(window.scrollY > 200);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Map blocks to flow points
  useEffect(() => {
    if (!blocks.length) return;
    
    const points = blocks.map((block, index) => {
      // Determine which section this block belongs to based on type
      let section = 'exploration';
      
      if (index < 2) {
        section = 'introduction';
      } else if (block.type === 'quiz') {
        section = 'challenge';
      } else if (block.type === 'creative' || block.type === 'activity') {
        section = 'creation';
      } else if (block.type === 'mindfulness') {
        section = 'reflection';
      } else if (index > blocks.length - 3) {
        section = 'nextSteps';
      } else if (block.type === 'fact' && index < blocks.length / 2) {
        section = 'understanding';
      }
      
      return {
        id: block.id,
        label: `Wonder ${index + 1}`,
        type: block.type,
        section: section
      };
    });
    
    setFlowPoints(points);
  }, [blocks]);
  
  // Get icon for younger kids based on content type
  const getWonderIcon = (type: string) => {
    switch(type) {
      case 'quiz': return <Rocket className="h-4 w-4" />;
      case 'fact': return <Star className="h-4 w-4" />;
      case 'funFact': return <Sparkles className="h-4 w-4" />;
      case 'creative': return <Sun className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };
  
  // Each age group gets a different visual representation
  const renderFlowByAge = () => {
    switch(ageGroup) {
      // Simplified cosmic journey for youngest kids (5-7)
      case '5-7':
        return (
          <div className={`flex items-center justify-center gap-2 transition-all duration-300 ${isCompact ? 'scale-75' : 'scale-100'}`}>
            {flowPoints.map((point, index) => (
              <motion.button
                key={point.id}
                onClick={() => onNavigate(index)}
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ 
                  scale: currentBlockIndex === index ? 1.3 : 1,
                  opacity: currentBlockIndex === index ? 1 : 0.7
                }}
                whileHover={{ scale: 1.2, opacity: 1 }}
                className={`relative rounded-full p-2 ${
                  currentBlockIndex === index 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400 animate-pulse' 
                    : 'bg-white/20'
                }`}
              >
                {getWonderIcon(point.type)}
                
                {currentBlockIndex === index && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold text-white py-1 px-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                  >
                    Now
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        );
        
      // Interactive journey with connected nodes for middle kids (8-11)  
      case '8-11':
        return (
          <div className={`flex items-center overflow-x-auto hide-scrollbar py-2 transition-all duration-300 ${isCompact ? 'max-w-[80vw] mx-auto' : 'max-w-full'}`}>
            <div className="flex-shrink-0 w-4" />
            {flowPoints.map((point, index) => (
              <React.Fragment key={point.id}>
                <motion.button
                  onClick={() => onNavigate(index)}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: currentBlockIndex === index ? 1.2 : 1,
                    opacity: currentBlockIndex === index ? 1 : 0.7
                  }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className={`relative flex-shrink-0 rounded-full w-8 h-8 flex items-center justify-center ${
                    currentBlockIndex === index 
                      ? `bg-gradient-to-r ${cosmicColors[point.section as keyof typeof cosmicColors] || cosmicColors.exploration}` 
                      : index < currentBlockIndex ? 'bg-white/30' : 'bg-white/10'
                  }`}
                >
                  {currentBlockIndex === index && (
                    <Sparkles className="h-3 w-3 text-white absolute animate-ping opacity-60" />
                  )}
                  <span className={`text-xs font-bold ${
                    currentBlockIndex === index 
                      ? 'text-white' 
                      : 'text-white/60'
                  }`}>
                    {index + 1}
                  </span>
                </motion.button>
                {index < flowPoints.length - 1 && (
                  <div className={`h-0.5 w-6 ${index < currentBlockIndex ? 'bg-white/30' : 'bg-white/10'} flex-shrink-0`} />
                )}
              </React.Fragment>
            ))}
            <div className="flex-shrink-0 w-4" />
          </div>
        );
        
      // Sophisticated progress bar for older kids (12-16)
      case '12-16':
      default:
        return (
          <div className={`relative transition-all duration-300 ${isCompact ? 'h-6' : 'h-10'}`}>
            {/* Progress bar background */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/10 transform -translate-y-1/2 rounded-full" />
            
            {/* Colored progress line */}
            <div 
              className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transform -translate-y-1/2 rounded-full"
              style={{ width: `${Math.max(5, (currentBlockIndex / (blocks.length - 1)) * 100)}%` }}
            />
            
            {/* Section markers */}
            {flowPoints.map((point, index) => {
              const position = `${(index / (blocks.length - 1)) * 100}%`;
              const isActive = currentBlockIndex === index;
              const isPassed = currentBlockIndex > index;
              
              return (
                <motion.button
                  key={point.id}
                  onClick={() => onNavigate(index)}
                  initial={{ scale: 0.8, opacity: 0.5 }}
                  animate={{ 
                    scale: isActive ? 1.2 : 1,
                    opacity: isActive ? 1 : isPassed ? 0.9 : 0.6
                  }}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
                  style={{ left: position }}
                >
                  <div className={`rounded-full ${
                    isActive 
                      ? `w-4 h-4 bg-gradient-to-r ${cosmicColors[point.section as keyof typeof cosmicColors] || cosmicColors.exploration}` 
                      : isPassed 
                        ? 'w-3 h-3 bg-white/60' 
                        : 'w-2 h-2 bg-white/30'
                  }`} />
                  
                  {isActive && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                      <span className="px-2 py-1 bg-white/10 backdrop-blur-md rounded text-xs font-medium text-white/90">
                        {point.label}
                      </span>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );
    }
  };
  
  return (
    <div className="mb-6 relative">
      <AnimatePresence mode="wait">
        {!isCompact && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex justify-between items-center mb-2"
          >
            <h3 className="text-white/80 text-sm font-medium">
              {ageGroup === '5-7' ? 'Your Wonder Journey' : 
               ageGroup === '8-11' ? 'Knowledge Flow' : 
               'Learning Progress'}
            </h3>
            
            {ageGroup !== '5-7' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="text-white/60 hover:text-white hover:bg-white/5"
              >
                {showMap ? (
                  <>
                    <Compass className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Hide Map</span>
                  </>
                ) : (
                  <>
                    <Map className="h-4 w-4 mr-1.5" />
                    <span className="text-xs">Show Map</span>
                  </>
                )}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className={`bg-white/5 backdrop-blur-sm rounded-lg ${isCompact ? 'py-2 px-3' : 'p-3'} sticky top-16 z-30 transition-all duration-300`}>
        <AnimatePresence mode="wait">
          {showMap && !isCompact && ageGroup !== '5-7' ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 hide-scrollbar">
                  {Object.entries(cosmicColors).map(([section, gradient]) => (
                    <div key={section} className="flex items-center gap-1.5 flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${gradient}`} />
                      <span className="text-white/70 text-xs capitalize">{section}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-2 flex flex-wrap gap-2">
                  {flowPoints.length > 0 && [
                    'introduction', 'exploration', 'understanding', 
                    'challenge', 'creation', 'reflection', 'nextSteps'
                  ].map(section => {
                    const sectionPoints = flowPoints.filter(p => p.section === section);
                    if (sectionPoints.length === 0) return null;
                    
                    return (
                      <div key={section} className="text-xs text-white/60">
                        <span className="capitalize">{section}</span>:{' '}
                        <span>{sectionPoints.map((p, i) => 
                          blocks.findIndex(b => b.id === p.id) + 1).join(', ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        
        {renderFlowByAge()}
      </div>
    </div>
  );
};

export default CosmicFlow;
