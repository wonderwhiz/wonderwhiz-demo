
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Plus, MinusCircle, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImmersiveCardProps {
  title: string;
  content: React.ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
  onExpand?: () => void;
  onDismiss?: () => void;
  ageGroup?: '5-7' | '8-11' | '12-16';
  relevanceScore?: number;
  relatedTopics?: string[];
  onRelatedTopicClick?: (topic: string) => void;
  interactiveElements?: boolean;
  emotionalTone?: 'neutral' | 'exciting' | 'calming' | 'mysterious';
}

const ImmersiveCard: React.FC<ImmersiveCardProps> = ({
  title,
  content,
  backgroundImage,
  backgroundColor = 'from-wonderwhiz-deep-purple to-wonderwhiz-purple',
  onExpand,
  onDismiss,
  ageGroup = '8-11',
  relevanceScore = 1,
  relatedTopics = [],
  onRelatedTopicClick,
  interactiveElements = true,
  emotionalTone = 'neutral'
}) => {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [contentHeight, setContentHeight] = useState<number | null>(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [progressLevel, setProgressLevel] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // For 3D card effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  // Smooth spring physics for the card rotation
  const springConfig = { damping: 15, stiffness: 150 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  
  // Set content height for animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [content]);
  
  // Update progress based on expanded state
  useEffect(() => {
    if (expanded) {
      const timer = setInterval(() => {
        setProgressLevel(prev => {
          if (prev < 100) return prev + 1;
          clearInterval(timer);
          return 100;
        });
      }, 50);
      
      return () => clearInterval(timer);
    }
  }, [expanded]);
  
  const handleExpand = () => {
    setExpanded(true);
    setShowFullContent(true);
    if (onExpand) onExpand();
  };
  
  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveElements) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set((e.clientX - centerX) / 5);
    y.set((e.clientY - centerY) / 5);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  // Get emotional design elements based on tone
  const getEmotionalDesign = () => {
    switch(emotionalTone) {
      case 'exciting':
        return {
          gradientOverlay: 'bg-gradient-to-tr from-orange-500/20 to-pink-500/20',
          animation: 'pulse-gentle',
          iconAnimation: 'animate-bounce-gentle',
          icon: <Sparkles className="h-6 w-6 text-yellow-300" />
        };
      case 'calming':
        return {
          gradientOverlay: 'bg-gradient-to-tr from-blue-500/20 to-teal-500/20',
          animation: 'float',
          iconAnimation: 'animate-float',
          icon: null
        };
      case 'mysterious':
        return {
          gradientOverlay: 'bg-gradient-to-tr from-purple-700/30 to-indigo-900/30',
          animation: 'pulse-gentle',
          iconAnimation: 'animate-rotate',
          icon: <div className="h-8 w-8 rounded-full bg-indigo-600/40 blur-sm" />
        };
      default: // neutral
        return {
          gradientOverlay: '',
          animation: '',
          iconAnimation: '',
          icon: null
        };
    }
  };
  
  // Adjust font size based on age group
  const getTitleSize = () => {
    switch (ageGroup) {
      case '5-7': return 'text-2xl md:text-3xl';
      case '8-11': return 'text-xl md:text-2xl';
      case '12-16': return 'text-lg md:text-xl';
      default: return 'text-xl md:text-2xl';
    }
  };
  
  // Adjust content size based on age group
  const getContentSize = () => {
    switch (ageGroup) {
      case '5-7': return 'text-lg leading-relaxed';
      case '8-11': return 'text-base leading-relaxed';
      case '12-16': return 'text-sm leading-relaxed';
      default: return 'text-base leading-relaxed';
    }
  };
  
  // Adjust interaction style based on age group
  const getInteractionStyle = () => {
    switch (ageGroup) {
      case '5-7': return 'p-3 text-lg rounded-2xl';
      case '8-11': return 'p-2 text-base rounded-xl';
      case '12-16': return 'p-2 text-sm rounded-lg';
      default: return 'p-2 text-base rounded-xl';
    }
  };
  
  const emotionalDesign = getEmotionalDesign();
  
  return (
    <motion.div
      className={`w-full rounded-3xl overflow-hidden shadow-lg ${
        dismissed ? 'pointer-events-none' : ''
      }`}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ 
        opacity: dismissed ? 0 : 1, 
        y: dismissed ? -100 : 0,
        scale: expanded ? 1 : 0.97,
        height: expanded ? 'auto' : undefined
      }}
      exit={{ opacity: 0, y: 100, scale: 0.9 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      whileHover={{ scale: expanded ? 1 : interactiveElements ? 1.02 : 1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        className={`w-full h-full ${emotionalDesign.gradientOverlay} ${emotionalDesign.animation}`}
        style={{
          rotateX: interactiveElements ? springRotateX : 0,
          rotateY: interactiveElements ? springRotateY : 0,
          transformPerspective: 1000
        }}
      >
        <div 
          className={`w-full h-full bg-gradient-to-br ${backgroundColor} ${
            backgroundImage ? 'bg-opacity-70 backdrop-blur-sm' : ''
          }`}
        >
          <div className="p-5 md:p-7 relative">
            {emotionalDesign.icon && (
              <div className={`absolute top-4 right-4 ${emotionalDesign.iconAnimation}`}>
                {emotionalDesign.icon}
              </div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className={`font-bold mb-3 text-white ${getTitleSize()}`}>
                {title}
              </h2>
              
              <div 
                ref={contentRef}
                className={`text-white/90 ${getContentSize()}`}
              >
                {expanded ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {content}
                  </motion.div>
                ) : (
                  <div className="relative max-h-24 overflow-hidden">
                    {content}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-wonderwhiz-purple/90 to-transparent" />
                  </div>
                )}
              </div>
              
              {!expanded && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleExpand}
                    className={`bg-white/20 hover:bg-white/30 text-white ${getInteractionStyle()}`}
                  >
                    <span className="mr-2">Discover More</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              {expanded && relatedTopics.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white text-sm font-medium mb-2">
                    Related topics to explore
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {relatedTopics.map((topic, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => onRelatedTopicClick?.(topic)}
                        className="bg-white/10 hover:bg-white/20 text-white rounded-full"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {expanded && (
                <div className="mt-6">
                  <div className="bg-white/10 h-1 rounded-full">
                    <motion.div 
                      className="h-full bg-wonderwhiz-bright-pink rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressLevel}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Progress</span>
                    <span>{progressLevel}%</span>
                  </div>
                </div>
              )}
              
              {expanded && (
                <div className="flex justify-end mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="text-white/70 hover:text-white/90 hover:bg-white/10"
                  >
                    Dismiss
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Progressive disclosure controls (for young children) */}
      {expanded && ageGroup === '5-7' && (
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-full bg-white/20 text-white hover:bg-white/30"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? <MinusCircle className="h-5 w-5" /> : <PlusCircle className="h-5 w-5" />}
          </Button>
        </div>
      )}
      
      {/* Relevance indicator */}
      <div 
        className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white/80"
        style={{ opacity: relevanceScore * 0.7 + 0.3 }}
      >
        {Math.floor(relevanceScore * 100)}% Relevant
      </div>
    </motion.div>
  );
};

export default ImmersiveCard;
