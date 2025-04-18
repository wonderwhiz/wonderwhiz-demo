
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
import PinchCollector from './PinchCollector';
import MultiTouchExpander from './MultiTouchExpander';
import RestReminder from './RestReminder';
import FamilyMessaging from './FamilyMessaging';
import confetti from 'canvas-confetti';

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
  const [particles, setParticles] = useState<Array<{id: number, size: number, color: string, delay: number, pattern: string}>>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const { childProfile } = useChildProfile(childId);
  const { streakDays, sparkAnimation } = useSparksSystem(childId);
  const childAge = childProfile?.age ? Number(childProfile.age) : 10;
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
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
      content: 'Black holes are regions of spacetime where gravity is so strong that nothing can escape from it – not even light! Scientists are still studying these fascinating cosmic objects to understand how they form and behave.',
      backgroundColor: 'from-indigo-900 to-purple-900',
      relevanceScore: 0.95,
      relatedTopics: ['Gravity', 'Stars', 'Space-time'],
      emotionalTone: 'mysterious'
    },
    {
      id: '2',
      title: 'Dinosaur Discoveries',
      content: 'Scientists recently found a new dinosaur species with feathers that could be related to modern birds! This discovery helps us understand how birds evolved from dinosaurs millions of years ago.',
      backgroundColor: 'from-rose-900 to-pink-800',
      relevanceScore: 0.87,
      relatedTopics: ['Fossils', 'Evolution', 'Birds'],
      emotionalTone: 'exciting'
    },
    {
      id: '3',
      title: 'Ocean Wonders',
      content: 'The deep ocean is one of the least explored places on Earth. Scientists estimate we've only discovered about 5% of the ocean! New species are being found all the time in these mysterious waters.',
      backgroundColor: 'from-blue-900 to-cyan-800',
      relevanceScore: 0.92,
      relatedTopics: ['Marine Life', 'Deep Sea', 'Exploration'],
      emotionalTone: 'calming'
    }
  ];

  useEffect(() => {
    // Determine time of day
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
    
    // Generate background particles with different patterns
    const patterns = ['float', 'spiral', 'pulse', 'zigzag'];
    const newParticles = Array(25).fill(0).map((_, index) => ({
      id: index,
      size: Math.random() * 6 + 2,
      color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
      delay: Math.random() * 5,
      pattern: patterns[Math.floor(Math.random() * patterns.length)]
    }));
    
    setParticles(newParticles);
    
    // Add interactive particles
    const canvas = canvasRef.current;
    if (canvas) {
      const addInteractiveParticle = () => {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        
        // Generate color based on time of day
        let hue;
        if (timeOfDay === 'morning') {
          hue = Math.random() * 30 + 40; // Yellow-orange
        } else if (timeOfDay === 'afternoon') {
          hue = Math.random() * 40 + 200; // Blue
        } else {
          hue = Math.random() * 60 + 240; // Purple
        }
        
        particle.classList.add('absolute', 'rounded-full', 'cursor-pointer');
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = `hsla(${hue}, 80%, 70%, 0.4)`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        canvas.appendChild(particle);
        
        // Animate
        const keyframes = [
          { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: 0.1 },
          { transform: `translateY(-${Math.random() * 50 + 20}px) rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 1})`, opacity: 0.7 },
          { transform: `translateY(-${Math.random() * 100 + 50}px) rotate(${Math.random() * 720}deg) scale(${Math.random() * 0.5 + 0.5})`, opacity: 0 }
        ];
        
        const animation = particle.animate(keyframes, {
          duration: 10000 + Math.random() * 15000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        });
        
        animation.onfinish = () => {
          particle.remove();
          setTimeout(addInteractiveParticle, Math.random() * 5000);
        };
        
        // Add interactive effect
        particle.addEventListener('mouseover', () => {
          particle.style.transform = 'scale(1.5)';
          particle.style.backgroundColor = `hsla(${hue}, 100%, 70%, 0.8)`;
          particle.style.boxShadow = `0 0 10px hsla(${hue}, 100%, 70%, 0.5)`;
        });
        
        particle.addEventListener('mouseout', () => {
          particle.style.transform = 'scale(1)';
          particle.style.backgroundColor = `hsla(${hue}, 80%, 70%, 0.4)`;
          particle.style.boxShadow = 'none';
        });
        
        particle.addEventListener('click', () => {
          // Collect a spark when clicked
          handleCollectSpark(1);
          particle.remove();
          setTimeout(addInteractiveParticle, Math.random() * 1000);
        });
      };
      
      // Add several interactive particles
      for (let i = 0; i < 5; i++) {
        setTimeout(addInteractiveParticle, i * 2000);
      }
    }
  }, [timeOfDay]);

  const handleVoiceInput = async (transcript: string) => {
    setIsListening(true);
    try {
      await onVoiceInput(transcript);
    } finally {
      setIsListening(false);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    // Handle swipe navigation
    if (direction === 'up') {
      setShowConstellation(true);
      toast.info("Exploring your knowledge universe", {
        icon: '🌌',
        position: 'top-center'
      });
    } else if (direction === 'down') {
      setShowConstellation(false);
    } else if (direction === 'left') {
      // Move to next card
      setActiveCard(prev => (prev < sampleCards.length - 1 ? prev + 1 : 0));
      toast.info("Next topic", {
        icon: '→',
        position: 'bottom-center'
      });
    } else if (direction === 'right') {
      // Move to previous card
      setActiveCard(prev => (prev > 0 ? prev - 1 : sampleCards.length - 1));
      toast.info("Previous topic", {
        icon: '←',
        position: 'bottom-center'
      });
    }
  };

  const handlePinch = (scale: number) => {
    // Visual feedback for pinch (actual collection happens in PinchCollector)
    const feedback = document.createElement('div');
    feedback.classList.add('fixed', 'inset-0', 'pointer-events-none', 'flex', 'items-center', 'justify-center', 'z-50');
    feedback.innerHTML = `<div class="text-white/40 text-3xl">Collecting knowledge</div>`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 500);
  };

  const handleSpread = (scale: number) => {
    // Handle spread to expand topic
    if (scale > 1.3 && expandedCardIndex === null) {
      setExpandedCardIndex(activeCard);
      
      toast.success("Topic expanded!", {
        icon: '🔍',
        position: 'bottom-center'
      });
    }
  };
  
  const handleCollectSpark = (amount: number) => {
    // In a real app, this would update the database
    console.log(`Collected ${amount} sparks`);
    
    // Create a visual spark collection effect
    const sparkElement = document.createElement('div');
    sparkElement.innerHTML = `<div class="flex items-center"><span class="text-wonderwhiz-vibrant-yellow">+${amount}</span><svg class="w-4 h-4 ml-1 text-wonderwhiz-vibrant-yellow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg></div>`;
    sparkElement.className = 'fixed text-xl text-white font-bold pointer-events-none z-50 transition-all duration-1000';
    sparkElement.style.left = `${Math.random() * 50 + 25}%`;
    sparkElement.style.top = `${Math.random() * 30 + 30}%`;
    document.body.appendChild(sparkElement);
    
    setTimeout(() => {
      sparkElement.style.transform = 'translateY(-100px) scale(1.5)';
      sparkElement.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(sparkElement);
      }, 1000);
    }, 10);
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
  
  const handleExpandCard = () => {
    setExpandedCardIndex(activeCard);
    
    // Trigger confetti for excitement
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.7 }
    });
  };
  
  const handleDismissCard = () => {
    setExpandedCardIndex(null);
  };
  
  const handleRelatedTopicClick = (topic: string) => {
    toast.success(`Exploring related topic: ${topic}`, {
      icon: '🔍',
      position: 'bottom-center'
    });
    
    // In a real app, this would navigate to the related topic
    setExpandedCardIndex(null);
    
    // Award sparks for exploration
    handleCollectSpark(2);
  };

  // Get background gradient based on time of day
  const getTimeBasedGradient = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'from-indigo-900 via-purple-800 to-pink-800';
      case 'afternoon':
        return 'from-blue-900 via-indigo-800 to-purple-900';
      case 'evening':
        return 'from-wonderwhiz-deep-purple to-indigo-900';
      default:
        return 'from-wonderwhiz-deep-purple to-wonderwhiz-light-purple';
    }
  };

  return (
    <div ref={canvasRef} className={`relative w-full h-screen overflow-hidden bg-gradient-to-b ${getTimeBasedGradient()}`}>
      {/* Background particles with different patterns */}
      {particles.map((particle) => (
        <FloatingParticle 
          key={particle.id}
          size={particle.size}
          color={particle.color}
          delay={particle.delay}
          pattern={particle.pattern as 'float' | 'spiral' | 'pulse' | 'zigzag'}
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
      
      {/* Sparks animation system with time-based variant */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="fixed top-4 right-4 z-40"
      >
        <SparksSystem
          sparksCount={childProfile?.sparks_balance || 0}
          animate={sparkAnimation}
          variant={timeOfDay === 'morning' ? 'energetic' : timeOfDay === 'afternoon' ? 'standard' : 'cosmic'}
          onSparkClick={() => {
            toast.success(`You have ${childProfile?.sparks_balance || 0} sparks!`, {
              position: 'top-right',
              icon: '✨'
            });
          }}
        />
      </motion.div>
      
      {/* Special gesture handlers */}
      <PinchCollector 
        onPinchCollect={handleCollectSpark}
        childAge={childAge}
        enabled={!showConstellation}
      />
      
      <MultiTouchExpander
        onExpand={() => {
          if (expandedCardIndex === null) {
            setExpandedCardIndex(activeCard);
          }
        }}
        childAge={childAge}
        enabled={!showConstellation && expandedCardIndex === null}
      />
      
      {/* Rest reminder for wellbeing */}
      <RestReminder
        childAge={childAge}
        sessionDuration={20} // Show after 20 minutes
        onRest={() => {
          // In a real app, this would pause the session or show relaxation content
          toast.success("Taking a break is great for your brain!", {
            icon: "🧠",
            position: "top-center"
          });
        }}
      />
      
      {/* Family messaging for social connection */}
      <FamilyMessaging
        childId={childId}
        childName={childProfile?.name}
        childAge={childAge}
        initialMessages={[
          {
            id: '1',
            sender: 'parent',
            content: "How's your learning adventure going today?",
            type: 'text',
            timestamp: new Date(Date.now() - 3600000) // 1 hour ago
          }
        ]}
        onShareDiscovery={(content) => {
          // Award sparks for sharing
          handleCollectSpark(1);
        }}
      />
      
      {/* Main gesture handler */}
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
          
          {/* Card-based content flow */}
          <div className="fixed bottom-32 left-4 right-4 z-30 pointer-events-none">
            <AnimatePresence mode="wait">
              {!showConstellation && (
                <motion.div 
                  key={`card-${activeCard}`}
                  className="max-w-md mx-auto pointer-events-auto"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <ImmersiveCard
                    title={sampleCards[activeCard].title}
                    content={sampleCards[activeCard].content}
                    backgroundColor={sampleCards[activeCard].backgroundColor}
                    relevanceScore={sampleCards[activeCard].relevanceScore}
                    relatedTopics={sampleCards[activeCard].relatedTopics}
                    emotionalTone={sampleCards[activeCard].emotionalTone as any}
                    ageGroup={childAge < 8 ? '5-7' : childAge < 12 ? '8-11' : '12-16'}
                    onExpand={handleExpandCard}
                    onDismiss={handleDismissCard}
                    onRelatedTopicClick={handleRelatedTopicClick}
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
