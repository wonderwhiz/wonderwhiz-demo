
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WonderOrb from './WonderOrb';
import GestureHandler from './GestureHandler';
import { toast } from 'sonner';
import { useChildProfile } from '@/hooks/use-child-profile';
import KnowledgeConstellation from './KnowledgeConstellation';
import SparksSystem from './SparksSystem';
import FloatingParticle from './FloatingParticle';
import { useSparksSystem } from '@/hooks/useSparksSystem';
import ImmersiveCard from './ImmersiveCard';

interface WonderCanvasProps {
  childId: string;
  onSearch: (query: string) => void;
  onVoiceInput: (transcript: string) => void;
  children: React.ReactNode;
}

const WonderCanvas: React.FC<WonderCanvasProps> = ({
  childId,
  onSearch,
  onVoiceInput,
  children
}) => {
  const [isListening, setIsListening] = useState(false);
  const [showConstellation, setShowConstellation] = useState(false);
  const [activeStarId, setActiveStarId] = useState<string | undefined>(undefined);
  const [particles, setParticles] = useState<Array<{id: number, size: number, color: string, delay: number}>>([]);
  const { childProfile } = useChildProfile(childId);
  const { streakDays, sparkAnimation } = useSparksSystem(childId);
  const childAge = childProfile?.age ? Number(childProfile.age) : 10;
  
  // Sample constellation data - in a real app, this would come from the API
  const constellationNodes = [
    { id: '1', title: 'Space Exploration', x: 25, y: 30, size: 60, color: '#8b5cf6' },
    { id: '2', title: 'Dinosaurs', x: 70, y: 45, size: 50, color: '#ec4899' },
    { id: '3', title: 'Ocean Life', x: 40, y: 70, size: 55, color: '#06b6d4' },
    { id: '4', title: 'Ancient Egypt', x: 80, y: 20, size: 45, color: '#f59e0b' },
    { id: '5', title: 'Future Technology', x: 15, y: 60, size: 40, color: '#10b981', locked: true },
  ];
  
  const constellationEdges = [
    { source: '1', target: '2', strength: 0.7 },
    { source: '1', target: '3', strength: 0.3 },
    { source: '2', target: '4', strength: 0.5 },
    { source: '3', target: '4', strength: 0.6 },
    { source: '2', target: '5', strength: 0.2 },
  ];
  
  // Sample cards data - would come from the API in a real app
  const sampleCards = [
    {
      id: '1',
      title: 'The Mysterious Black Holes',
      content: 'Black holes are regions of spacetime where gravity is so strong that nothing can escape from it – not even light!',
      backgroundColor: 'from-indigo-900 to-purple-900',
      relevanceScore: 0.95
    },
    {
      id: '2',
      title: 'Dinosaur Discoveries',
      content: 'Scientists recently found a new dinosaur species with feathers that could be related to modern birds!',
      backgroundColor: 'from-rose-900 to-pink-800',
      relevanceScore: 0.87
    }
  ];

  useEffect(() => {
    // Generate background particles
    const newParticles = Array(20).fill(0).map((_, index) => ({
      id: index,
      size: Math.random() * 6 + 2,
      color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
      delay: Math.random() * 5
    }));
    
    setParticles(newParticles);
  }, []);

  const handleVoiceInput = async (transcript: string) => {
    setIsListening(true);
    try {
      await onVoiceInput(transcript);
    } finally {
      setIsListening(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    // Implement swipe handling logic
    if (direction === 'up') {
      setShowConstellation(true);
    } else if (direction === 'down') {
      setShowConstellation(false);
    } else {
      toast.info(`Swiped ${direction}`, {
        icon: direction === 'left' ? '👈' : '👉',
        position: 'bottom-center'
      });
    }
  };

  const handlePinch = (scale: number) => {
    // Add visual feedback for pinch
    const feedback = document.createElement('div');
    feedback.classList.add('fixed', 'inset-0', 'pointer-events-none', 'flex', 'items-center', 'justify-center', 'z-50');
    feedback.innerHTML = `<div class="text-white/40 text-3xl">Zoom ${scale < 1 ? 'Out' : 'In'}</div>`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 500);
    
    console.log('Pinch scale:', scale);
  };

  const handleSpread = (scale: number) => {
    // Implement spread interaction logic
    console.log('Spread scale:', scale);
  };
  
  const handleStarClick = (nodeId: string) => {
    setActiveStarId(nodeId);
    
    // Find the node to get its title
    const node = constellationNodes.find(n => n.id === nodeId);
    if (node) {
      toast.success(`Exploring: ${node.title}`, {
        position: 'top-center',
        icon: '🔭'
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-wonderwhiz-deep-purple to-wonderwhiz-light-purple">
      {/* Background particles */}
      {particles.map((particle) => (
        <FloatingParticle 
          key={particle.id}
          size={particle.size}
          color={particle.color}
          delay={particle.delay}
        />
      ))}
      
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          backgroundImage: 'url("/patterns/wonder-pattern.svg")',
          backgroundSize: '100% 100%',
        }}
      />
      
      {/* Sparks animation system */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-4 right-4 z-40"
      >
        <SparksSystem
          sparksCount={childProfile?.sparks_balance || 0}
          animate={sparkAnimation}
          onSparkClick={() => {
            toast.success(`You have ${childProfile?.sparks_balance || 0} sparks!`, {
              position: 'top-right',
              icon: '✨'
            });
          }}
        />
      </motion.div>
      
      {/* Gesture handler */}
      <GestureHandler
        onSwipe={handleSwipe}
        onPinch={handlePinch}
        onSpread={handleSpread}
      >
        {/* Knowledge Constellation (shown when swiped up) */}
        <AnimatePresence>
          {showConstellation && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ type: "spring", damping: 20 }}
              className="absolute inset-0 z-20 bg-gradient-to-b from-wonderwhiz-deep-purple/95 to-wonderwhiz-light-purple/95 backdrop-blur-sm"
            >
              <div className="w-full h-full p-4">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold text-white">Your Knowledge Universe</h2>
                  <p className="text-white/70 text-sm">Swipe down to return</p>
                </div>
                <div className="w-full h-[calc(100%-80px)]">
                  <KnowledgeConstellation
                    nodes={constellationNodes}
                    edges={constellationEdges}
                    onNodeClick={handleStarClick}
                    activeNodeId={activeStarId}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      
        {/* Main content */}
        <motion.div className="relative z-10 w-full h-full">
          {children}
          
          {/* Example of card-based content flow */}
          <div className="fixed bottom-32 left-4 right-4 z-30 pointer-events-none">
            <AnimatePresence>
              {!showConstellation && (
                <motion.div 
                  className="max-w-md mx-auto pointer-events-auto"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ delay: 0.2 }}
                >
                  <ImmersiveCard
                    title={sampleCards[0].title}
                    content={sampleCards[0].content}
                    backgroundColor={sampleCards[0].backgroundColor}
                    relevanceScore={sampleCards[0].relevanceScore}
                    ageGroup={childAge < 8 ? '5-7' : childAge < 12 ? '8-11' : '12-16'}
                    onExpand={() => {
                      toast.info("Expanding card...", {
                        position: "bottom-center"
                      });
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Wonder Orb */}
        <WonderOrb
          onSearch={onSearch}
          onVoiceInput={handleVoiceInput}
          childAge={childAge}
          isListening={isListening}
        />
        
        {/* Swipe indicator */}
        <motion.div
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 text-white/50 text-xs"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            y: [0, -10, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          Swipe up to see your knowledge universe
        </motion.div>
      </GestureHandler>
    </div>
  );
};

export default WonderCanvas;
