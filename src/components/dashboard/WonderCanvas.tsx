
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Compass, Book, CheckSquare, Star, 
  Search, Plus, ArrowRight, Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import WonderOrb from './WonderOrb';
import CurioCard from './CurioCard';
import TasksPanel from './TasksPanel';
import SparksPanel from './SparksPanel';
import PastCuriosPanel from './PastCuriosPanel';
import SuggestionsCloud from './SuggestionsCloud';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import confetti from 'canvas-confetti';

interface WonderCanvasProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  onRefreshSuggestions?: () => void;
  sparksBalance: number;
  streakDays: number;
}

const WonderCanvas: React.FC<WonderCanvasProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  onCurioSuggestionClick,
  onRefreshSuggestions,
  sparksBalance,
  streakDays
}) => {
  const [activePanel, setActivePanel] = useState<'none' | 'curios' | 'tasks' | 'sparks'>('none');
  const [orbExpanded, setOrbExpanded] = useState(false);
  const [showVoicePrompt, setShowVoicePrompt] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // For particle effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Create subtle floating particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.classList.add('absolute', 'rounded-full', 'opacity-30', 'pointer-events-none');
      
      // Random properties
      const size = Math.random() * 8 + 4;
      const hue = Math.floor(Math.random() * 60) + 240; // Blues and purples
      
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = `hsl(${hue}, 80%, 70%)`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.bottom = '-20px';
      particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
      particle.style.transform = `translateX(${Math.random() * 100 - 50}px)`;
      
      canvas.appendChild(particle);
      
      // Set animation
      const animation = particle.animate(
        [
          { transform: 'translateY(0) rotate(0deg)', opacity: 0 },
          { transform: `translateY(-${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0.7 }
        ],
        {
          duration: Math.random() * 20000 + 15000,
          easing: 'cubic-bezier(0.1, 0.8, 0.2, 1)'
        }
      );
      
      animation.onfinish = () => {
        particle.remove();
      };
    };
    
    // Create initial particles
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createParticle(), Math.random() * 5000);
    }
    
    // Create new particles periodically
    const interval = setInterval(() => {
      if (Math.random() > 0.7) createParticle();
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle voice input
  const startVoiceInput = () => {
    setIsListening(true);
    setShowVoicePrompt(true);
    
    // Simulate voice recognition (replace with actual implementation)
    const simulateVoiceRecognition = () => {
      const phrases = [
        "Tell me about space", 
        "How do animals communicate?", 
        "Why is the sky blue?",
        "How do volcanoes work?"
      ];
      let transcript = '';
      let counter = 0;
      
      const typingInterval = setInterval(() => {
        if (counter < phrases[Math.floor(Math.random() * phrases.length)].length) {
          transcript += phrases[Math.floor(Math.random() * phrases.length)][counter];
          setVoiceTranscript(transcript);
          counter++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsListening(false);
            setQuery(transcript);
            setTimeout(() => {
              setShowVoicePrompt(false);
              handleSubmitQuery();
            }, 500);
          }, 500);
        }
      }, 50);
    };
    
    simulateVoiceRecognition();
  };
  
  const togglePanel = (panel: 'curios' | 'tasks' | 'sparks') => {
    setActivePanel(prev => prev === panel ? 'none' : panel);
    
    // Trigger confetti on first sparks panel open
    if (panel === 'sparks' && activePanel !== 'sparks') {
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.7, x: 0.8 }
        });
      }, 300);
    }
  };
  
  const handleCreateCurio = async (customQuery?: string) => {
    if (isGenerating) {
      toast.info("I'm already creating something amazing! Please wait...");
      return;
    }
    
    const queryToUse = customQuery || query;
    
    if (!queryToUse.trim()) {
      // Focus the input with a gentle pulse animation
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.classList.add('animate-pulse-gentle');
        setTimeout(() => {
          if (inputRef.current) inputRef.current.classList.remove('animate-pulse-gentle');
        }, 1000);
      }
      toast.error("Tell me what you want to learn about!");
      return;
    }
    
    setOrbExpanded(true);
    
    // Start the creation process
    handleSubmitQuery();
    
    // Animate the orb expansion
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.5, x: 0.5 }
      });
    }, 500);
  };
  
  // Handle suggestion click with animated feedback
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    
    // Create a temporary floating element that flies to the center
    const tempElement = document.createElement('div');
    tempElement.innerText = suggestion;
    tempElement.className = 'fixed text-white font-bold pointer-events-none z-50 transition-all duration-700';
    tempElement.style.left = `${Math.random() * 50 + 25}%`;
    tempElement.style.top = `${Math.random() * 30 + 60}%`;
    document.body.appendChild(tempElement);
    
    // Animate to center
    setTimeout(() => {
      tempElement.style.left = '50%';
      tempElement.style.top = '40%';
      tempElement.style.transform = 'translate(-50%, -50%) scale(1.5)';
      tempElement.style.opacity = '0';
      
      setTimeout(() => {
        document.body.removeChild(tempElement);
        handleCreateCurio(suggestion);
      }, 700);
    }, 10);
    
    onCurioSuggestionClick(suggestion);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex flex-col items-center">
      {/* Background particle container */}
      <div ref={canvasRef} className="absolute inset-0 pointer-events-none overflow-hidden" />
      
      {/* Top welcome bar */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="flex items-center justify-between w-full max-w-3xl px-4 py-4"
      >
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full p-1.5">
            <div className="bg-black rounded-full p-1">
              <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
            </div>
          </div>
          <div className="ml-2">
            <h1 className="text-lg font-bold text-white">
              Hi, {childProfile?.name || 'Explorer'}!
            </h1>
            <p className="text-xs text-white/60">Day {streakDays} of your adventure</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => togglePanel('sparks')}
            className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-1" />
            <span className="text-white font-bold">{sparksBalance}</span>
          </button>
        </div>
      </motion.div>
      
      {/* Main content area with wonder orb */}
      <motion.div 
        className="flex-1 w-full flex flex-col items-center justify-center px-4 pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {!orbExpanded ? (
            <motion.div 
              key="input-area"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-xl"
            >
              <div className="relative mb-8">
                <h2 className="text-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 font-nunito">
                  What shall we explore today?
                </h2>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-wonderwhiz-vibrant-yellow text-6xl"
                >
                  ↓
                </motion.div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow rounded-full blur-xl opacity-20" />
                
                <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-4 flex items-center relative overflow-hidden">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCreateCurio()}
                    placeholder="I want to learn about..."
                    className="flex-1 bg-transparent border-none outline-none text-white font-nunito placeholder:text-white/50 text-lg"
                  />
                  
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={startVoiceInput}
                      variant="ghost"
                      size="icon"
                      className="text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      onClick={() => handleCreateCurio()}
                      disabled={isGenerating}
                      className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow text-wonderwhiz-deep-purple font-bold rounded-full"
                    >
                      {isGenerating ? (
                        <span className="flex items-center">
                          <span className="mr-2">Creating</span>
                          <span className="animate-pulse">...</span>
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <span className="mr-2">Explore</span>
                          <Compass className="h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Suggestions cloud */}
              <SuggestionsCloud 
                suggestions={curioSuggestions}
                onSuggestionClick={handleSuggestionClick}
              />
            </motion.div>
          ) : (
            <motion.div
              key="expanding-orb"
              className="flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <WonderOrb
                isExpanding={isGenerating}
                query={query}
                onComplete={() => {
                  setOrbExpanded(false);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Voice input prompt overlay */}
        <AnimatePresence>
          {showVoicePrompt && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={() => {
                if (!isListening) setShowVoicePrompt(false);
              }}
            >
              <div 
                className="bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-light-purple p-8 rounded-3xl max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Voice Wonder</h3>
                
                <div className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${isListening ? 'animate-pulse bg-wonderwhiz-bright-pink/20' : 'bg-white/10'}`}>
                    <Volume2 className={`h-12 w-12 ${isListening ? 'text-wonderwhiz-bright-pink' : 'text-white/70'}`} />
                  </div>
                  
                  <p className="text-white/80 text-center mb-4">
                    {isListening 
                      ? "I'm listening..." 
                      : "Tap the microphone and ask me anything!"}
                  </p>
                  
                  {voiceTranscript && (
                    <div className="bg-white/10 rounded-lg p-4 w-full mb-4">
                      <p className="text-white text-lg">{voiceTranscript}</p>
                    </div>
                  )}
                  
                  <div className="flex gap-4 mt-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowVoicePrompt(false)}
                      disabled={isListening}
                    >
                      Cancel
                    </Button>
                    
                    <Button
                      onClick={startVoiceInput}
                      disabled={isListening}
                    >
                      {isListening ? "Listening..." : "Start Speaking"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Bottom dock navigation */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 flex justify-center pb-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className="flex items-center gap-2 bg-black/20 backdrop-blur-md p-1.5 rounded-full">
          <Button 
            variant="ghost"
            size="icon"
            className={`rounded-full p-2 ${activePanel === 'none' ? 'bg-wonderwhiz-bright-pink text-white' : 'text-white/70'}`}
            onClick={() => setActivePanel('none')}
          >
            <Plus className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className={`rounded-full p-2 ${activePanel === 'curios' ? 'bg-wonderwhiz-bright-pink text-white' : 'text-white/70'}`}
            onClick={() => togglePanel('curios')}
          >
            <Book className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className={`rounded-full p-2 ${activePanel === 'tasks' ? 'bg-wonderwhiz-bright-pink text-white' : 'text-white/70'}`}
            onClick={() => togglePanel('tasks')}
          >
            <CheckSquare className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost"
            size="icon"
            className={`rounded-full p-2 ${activePanel === 'sparks' ? 'bg-wonderwhiz-bright-pink text-white' : 'text-white/70'}`}
            onClick={() => togglePanel('sparks')}
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>
      
      {/* Sliding panels */}
      <AnimatePresence>
        {activePanel === 'curios' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-wonderwhiz-deep-purple to-wonderwhiz-light-purple/90 backdrop-blur-lg rounded-t-3xl z-40 pb-20"
            style={{ maxHeight: '80vh' }}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3" />
            <PastCuriosPanel
              pastCurios={pastCurios}
              childId={childId}
              onClose={() => setActivePanel('none')}
            />
          </motion.div>
        )}
        
        {activePanel === 'tasks' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-wonderwhiz-deep-purple to-wonderwhiz-light-purple/90 backdrop-blur-lg rounded-t-3xl z-40 pb-20"
            style={{ maxHeight: '80vh' }}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3" />
            <TasksPanel 
              childId={childId}
              onClose={() => setActivePanel('none')}
            />
          </motion.div>
        )}
        
        {activePanel === 'sparks' && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-wonderwhiz-deep-purple to-wonderwhiz-light-purple/90 backdrop-blur-lg rounded-t-3xl z-40 pb-20"
            style={{ maxHeight: '80vh' }}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto my-3" />
            <SparksPanel
              childId={childId}
              sparksBalance={sparksBalance}
              streakDays={streakDays}
              onClose={() => setActivePanel('none')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WonderCanvas;
