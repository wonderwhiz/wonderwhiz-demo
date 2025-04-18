import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import WebGLBackground from './WebGLBackground';
import TaskOrbits from './TaskOrbits';
import { useAppPerformance } from '@/hooks/useAppPerformance';
import confetti from 'canvas-confetti';
import { useAmbientSound } from '@/hooks/useAmbientSound';
import { useAnalytics } from '@/hooks/useAnalytics';
import { usePersonalization } from '@/hooks/usePersonalization';
import { useWhizzyChat } from '@/hooks/useWhizzyChat';
import VoiceVisualizer from './VoiceVisualizer';
import ContentGenerator from './ContentGenerator';

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
  const [particles, setParticles] = useState<Array<{id: number; size: number; color: string; delay: number; pattern: string}>>([]);
  const [activeCard, setActiveCard] = useState(0);
  const [expandedCardIndex, setExpandedCardIndex] = useState<number | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [showTaskOrbits, setShowTaskOrbits] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceVisualizerActive, setVoiceVisualizerActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  
  const { childProfile } = useChildProfile(childId);
  const { streakDays, sparkAnimation } = useSparksSystem(childId);
  const childAge = childProfile?.age ? Number(childProfile.age) : 10;
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const { 
    isOnline, 
    isLowPerformanceDevice, 
    shouldUseReducedFeatures,
    storeOfflineData,
    getOfflineData,
    fps
  } = useAppPerformance({
    offlineFirst: true,
    checkInterval: 3000,
    lowPerformanceThreshold: 25
  });
  
  const { 
    playAmbientSound, 
    playInteractionSound,
    stopAllSounds,
    setVolume,
    isMuted,
    toggleMute
  } = useAmbientSound({
    defaultAmbientTrack: timeOfDay === 'morning' ? 'morning' : 
                         timeOfDay === 'afternoon' ? 'afternoon' : 'evening',
    volume: 0.5,
    initiallyMuted: shouldUseReducedFeatures
  });
  
  const {
    recordInteraction,
    learningProgress,
    topicAffinities,
    sessionTime,
    getRecommendedTopics
  } = useAnalytics(childId);
  
  const {
    userPreferences,
    contentStyle,
    interactionStyle,
    colorTheme,
    updatePreferences,
    getPersonalizedContent
  } = usePersonalization(childId);

  const { 
    isMuted: isWhizzyMuted,
    toggleMute: toggleWhizzyMute,
    isListening: isWhizzyListening,
    transcript: whizzyTranscript,
    toggleVoice: toggleWhizzyVoice,
    isProcessing: isWhizzyProcessing,
    chatHistory
  } = useWhizzyChat({
    childAge: childAge,
    onNewQuestionGenerated: (question) => {
      toast.info(`Generating content for: ${question}`, { position: "bottom-center" });
    }
  });

  const trackInteraction = useCallback((type: string, data?: any) => {
    setLastInteraction(Date.now());
    recordInteraction(type, data);
    
    if (audioEnabled) {
      switch (type) {
        case 'tap':
          playInteractionSound('tap');
          break;
        case 'swipe':
          playInteractionSound('swipe');
          break;
        case 'collect':
          playInteractionSound('collect');
          break;
        case 'expand':
          playInteractionSound('expand');
          break;
        default:
          playInteractionSound('interaction');
      }
    }
  }, [audioEnabled, playInteractionSound, recordInteraction]);

  useEffect(() => {
    const offlineCards = getOfflineData('wonder_cards');
    if (!isOnline && offlineCards) {
      toast.info("Using saved content while offline", {
        icon: "📡",
        id: "offline-mode"
      });
    }
    
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('afternoon');
    } else {
      setTimeOfDay('evening');
    }
    
    storeOfflineData('wonder_cards', sampleCards);
    storeOfflineData('constellation_data', { nodes: constellationNodes, edges: constellationEdges });
    storeOfflineData('tasks_data', sampleTasks);
    
    const particleCount = shouldUseReducedFeatures ? 10 : 25;
    
    const patterns = ['float', 'spiral', 'pulse', 'zigzag'];
    const newParticles = Array(particleCount).fill(0).map((_, index) => ({
      id: index,
      size: Math.random() * 6 + 2,
      color: `rgba(255, 255, 255, ${Math.random() * 0.2 + 0.1})`,
      delay: Math.random() * 5,
      pattern: patterns[Math.floor(Math.random() * patterns.length)]
    }));
    
    setParticles(newParticles);
    
    if (canvasRef.current && !shouldUseReducedFeatures) {
      const addInteractiveParticle = () => {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4;
        
        let hue;
        if (timeOfDay === 'morning') {
          hue = Math.random() * 30 + 40;
        } else if (timeOfDay === 'afternoon') {
          hue = Math.random() * 40 + 200;
        } else {
          hue = Math.random() * 60 + 240;
        }
        
        particle.classList.add('absolute', 'rounded-full', 'cursor-pointer');
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = `hsla(${hue}, 80%, 70%, 0.4)`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        canvasRef.current.appendChild(particle);
        
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
          handleCollectSpark(1);
          trackInteraction('collect', { source: 'particle' });
          particle.remove();
          setTimeout(addInteractiveParticle, Math.random() * 1000);
        });
      };
      
      for (let i = 0; i < 5; i++) {
        setTimeout(addInteractiveParticle, i * 2000);
      }
    }
    
    if (audioEnabled && !shouldUseReducedFeatures) {
      playAmbientSound();
    }
    
    if (!isOnline) {
      toast.info("You're currently offline. Some features may be limited.", {
        id: "offline-status",
        duration: 5000
      });
    }
    
    return () => {
      stopAllSounds();
    };
  }, [timeOfDay, isOnline, shouldUseReducedFeatures, storeOfflineData, getOfflineData, audioEnabled, playAmbientSound, stopAllSounds]);

  useEffect(() => {
    const checkInactivity = () => {
      const now = Date.now();
      const inactiveTime = now - lastInteraction;
      
      if (inactiveTime > 5 * 60 * 1000) {
        setVolume(0.2);
      }
    };
    
    const interval = setInterval(checkInactivity, 60 * 1000);
    
    return () => clearInterval(interval);
  }, [lastInteraction, setVolume]);

  const handleVoiceInput = async (transcript: string) => {
    setIsListening(true);
    setVoiceTranscript(transcript);
    setVoiceVisualizerActive(true);
    
    try {
      trackInteraction('voice_input', { transcript });
      await onVoiceInput(transcript);
    } finally {
      setTimeout(() => {
        setIsListening(false);
        setVoiceVisualizerActive(false);
      }, 1000);
    }
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up' | 'down') => {
    trackInteraction('swipe', { direction });
    
    if (direction === 'up') {
      setShowConstellation(true);
      toast.info("Exploring your knowledge universe", {
        icon: '🌌',
        position: 'top-center'
      });
    } else if (direction === 'down') {
      setShowConstellation(false);
    } else if (direction === 'left') {
      setActiveCard(prev => (prev < sampleCards.length - 1 ? prev + 1 : 0));
      toast.info("Next topic", {
        icon: '→',
        position: 'bottom-center'
      });
    } else if (direction === 'right') {
      setActiveCard(prev => (prev > 0 ? prev - 1 : sampleCards.length - 1));
      toast.info("Previous topic", {
        icon: '←',
        position: 'bottom-center'
      });
    }
  };

  const handlePinch = (scale: number) => {
    const feedback = document.createElement('div');
    feedback.classList.add('fixed', 'inset-0', 'pointer-events-none', 'flex', 'items-center', 'justify-center', 'z-50');
    feedback.innerHTML = `<div class="text-white/40 text-3xl">Collecting knowledge</div>`;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.remove();
    }, 500);
    
    trackInteraction('pinch', { scale });
  };

  const handleSpread = (scale: number) => {
    if (scale > 1.3 && expandedCardIndex === null) {
      setExpandedCardIndex(activeCard);
      trackInteraction('spread', { scale, cardIndex: activeCard });
      
      toast.success("Topic expanded!", {
        icon: '🔍',
        position: 'bottom-center'
      });
    }
  };
  
  const handleCollectSpark = (amount: number) => {
    console.log(`Collected ${amount} sparks`);
    
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
    
    trackInteraction('collect_spark', { amount });
  };
  
  const handleStarClick = (nodeId: string) => {
    setActiveStarId(nodeId);
    trackInteraction('star_click', { nodeId });
    
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
    trackInteraction('expand_card', { cardIndex: activeCard });
    
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.7 }
    });
  };
  
  const handleDismissCard = () => {
    setExpandedCardIndex(null);
    trackInteraction('dismiss_card');
  };
  
  const handleRelatedTopicClick = (topic: string) => {
    toast.success(`Exploring related topic: ${topic}`, {
      icon: '🔍',
      position: 'bottom-center'
    });
    
    trackInteraction('related_topic', { topic });
    
    setExpandedCardIndex(null);
    
    handleCollectSpark(2);
  };
  
  const handleTaskClick = (taskId: string) => {
    const task = sampleTasks.find(t => t.id === taskId);
    if (task) {
      toast.success(`Starting task: ${task.title}`, {
        icon: '📝',
        position: 'bottom-center'
      });
      
      trackInteraction('task_click', { taskId, title: task.title });
      
      setShowTaskOrbits(false);
    }
  };
  
  const handleOrbLongPress = () => {
    setShowTaskOrbits(prev => !prev);
    trackInteraction('orb_long_press', { action: !showTaskOrbits ? 'show_tasks' : 'hide_tasks' });
    
    if (!showTaskOrbits) {
      toast.info("Your tasks orbit", {
        icon: '✨',
        position: 'bottom-center'
      });
    }
  };

  const handleToggleAudio = () => {
    setAudioEnabled(!audioEnabled);
    if (audioEnabled) {
      stopAllSounds();
    } else {
      playAmbientSound();
    }
    toast.info(audioEnabled ? "Sound off" : "Sound on", {
      icon: audioEnabled ? '🔇' : '🔊',
      position: 'top-right'
    });
  };

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
      {!shouldUseReducedFeatures && (
        <WebGLBackground 
          timeOfDay={timeOfDay}
          intensity={0.8}
          particleCount={isLowPerformanceDevice ? 500 : 1500}
          interactive={true}
          lowPerformance={isLowPerformanceDevice}
        />
      )}
      
      {particles.map((particle) => (
        <FloatingParticle 
          key={particle.id}
          size={particle.size}
          color={particle.color}
          delay={particle.delay}
          pattern={particle.pattern as 'float' | 'spiral' | 'pulse' | 'zigzag'}
          amplitude={shouldUseReducedFeatures ? 30 : 50}
          speed={shouldUseReducedFeatures ? 0.7 : 1}
        />
      ))}
      
      {!shouldUseReducedFeatures && (
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
      )}
      
      {!isOnline && (
        <div className="fixed top-4 left-4 bg-amber-600/90 text-white text-xs px-2 py-1 rounded-full z-50 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-white mr-1 animate-pulse"></span>
          Offline
        </div>
      )}
      
      {shouldUseReducedFeatures && (
        <div className="fixed top-4 left-20 bg-gray-600/90 text-white text-xs px-2 py-1 rounded-full z-50">
          Lite Mode
        </div>
      )}
      
      <div className="fixed top-4 left-40 bg-black/50 text-white text-xs px-2 py-1 rounded-full z-50">
        {fps} FPS
      </div>
      
      <button 
        onClick={handleToggleAudio}
        className="fixed top-4 right-24 bg-black/50 text-white p-2 rounded-full z-50"
      >
        {audioEnabled ? '🔊' : '🔇'}
      </button>
      
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
            trackInteraction('spark_click');
          }}
        />
      </motion.div>
      
      <AnimatePresence>
        {voiceVisualizerActive && (
          <VoiceVisualizer 
            isActive={isListening}
            transcript={voiceTranscript}
            colorScheme={timeOfDay}
          />
        )}
      </AnimatePresence>
      
      <TaskOrbits
        tasks={sampleTasks}
        visible={showTaskOrbits}
        onTaskClick={handleTaskClick}
        maxTasks={shouldUseReducedFeatures ? 3 : 5}
      />
      
      <PinchCollector 
        onPinchCollect={handleCollectSpark}
        childAge={childAge}
        enabled={!showConstellation}
      />
      
      <MultiTouchExpander
        onExpand={() => {
          if (expandedCardIndex === null) {
            setExpandedCardIndex(activeCard);
            trackInteraction('multi_touch_expand');
          }
        }}
        childAge={childAge}
        enabled={!showConstellation && expandedCardIndex === null}
      />
      
      <RestReminder
        childAge={childAge}
        sessionDuration={20}
        onRest={() => {
          toast.success("Taking a break is great for your brain!", {
            icon: "🧠",
            position: "top-center"
          });
          trackInteraction('take_rest');
        }}
      />
      
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
            timestamp: new Date(Date.now() - 3600000)
          }
        ]}
        onShareDiscovery={(content) => {
          handleCollectSpark(1);
          trackInteraction('share_discovery', { content });
        }}
      />
      
      <ContentGenerator 
        childId={childId}
        childAge={childAge}
        userInterests={topicAffinities}
        onContentGenerated={(content) => {
          console.log("New content generated:", content);
        }}
        isVisible={false}
      />
      
      <GestureHandler
        onSwipe={handleSwipe}
        onPinch={handlePinch}
        onSpread={handleSpread}
      >
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
      
        <motion.div className="relative z-10 w-full h-full">
          {children}
          
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

        <WonderOrb
          onSearch={onSearch}
          onVoiceInput={handleVoiceInput}
          childAge={childAge}
          isListening={isListening}
          onLongPress={handleOrbLongPress}
        />
        
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
