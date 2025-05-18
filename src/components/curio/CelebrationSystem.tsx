
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Award, Star, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: 'star' | 'sparkle' | 'trophy' | 'award';
  color: string;
}

interface CelebrationSystemProps {
  milestone?: 'first_block' | 'half_complete' | 'all_complete' | 'question_asked' | 'reply_sent';
  sparksEarned?: number;
  achievement?: Achievement;
  childAge?: number;
  onClose?: () => void;
  position?: 'bottom' | 'center';
}

const CelebrationSystem: React.FC<CelebrationSystemProps> = ({
  milestone,
  sparksEarned = 0,
  achievement,
  childAge = 10,
  onClose,
  position = 'bottom'
}) => {
  const [visible, setVisible] = useState(false);
  const [celebrationType, setCelebrationType] = useState<'milestone' | 'sparks' | 'achievement' | null>(null);
  const hasTriggeredConfetti = useRef<boolean>(false);
  const lastCelebrationTime = useRef<number>(0);
  const celebrationCooldown = 5000; // 5 seconds cooldown between celebrations

  useEffect(() => {
    const now = Date.now();
    // Only show celebration if we're not in cooldown period
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    if (milestone && !hasTriggeredConfetti.current && shouldCelebrate) {
      setCelebrationType('milestone');
      setVisible(true);
      triggerCelebration('small');
      hasTriggeredConfetti.current = true;
      lastCelebrationTime.current = now;
      
      // Auto-hide milestone celebrations after delay
      const timer = setTimeout(() => {
        setVisible(false);
        hasTriggeredConfetti.current = false;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone]);

  useEffect(() => {
    const now = Date.now();
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    // Only celebrate if sparks is significant (more than 1) and not in cooldown
    if (sparksEarned > 1 && !hasTriggeredConfetti.current && shouldCelebrate) {
      setCelebrationType('sparks');
      setVisible(true);
      triggerCelebration('small');
      hasTriggeredConfetti.current = true;
      lastCelebrationTime.current = now;
      
      // Auto-hide spark celebrations after delay
      const timer = setTimeout(() => {
        setVisible(false);
        hasTriggeredConfetti.current = false;
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sparksEarned]);

  useEffect(() => {
    const now = Date.now();
    const shouldCelebrate = now - lastCelebrationTime.current > celebrationCooldown;
    
    if (achievement && !hasTriggeredConfetti.current && shouldCelebrate) {
      setCelebrationType('achievement');
      setVisible(true);
      triggerCelebration('medium'); // Reduced from 'large' to 'medium'
      hasTriggeredConfetti.current = true;
      lastCelebrationTime.current = now;
    }
  }, [achievement]);

  const triggerCelebration = (size: 'small' | 'medium' | 'large') => {
    // Prevent multiple confetti calls
    if (hasTriggeredConfetti.current) {
      return;
    }
    
    switch (size) {
      case 'small':
        confetti({
          particleCount: 15, // Reduced from 30
          spread: 40, // Reduced from 50
          origin: { y: 0.6 }
        });
        break;
      case 'medium':
        confetti({
          particleCount: 40, // Reduced from 70
          spread: 50, // Reduced from 70
          origin: { y: 0.6 }
        });
        break;
      case 'large': {
        // Single burst for large celebration instead of continuous animation
        confetti({
          particleCount: 70, // Reduced from 100
          spread: 80, // Reduced from 100
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FF00FF', '#00FFFF', '#FF4500']
        });
        break;
      }
    }
  };

  const handleClose = () => {
    setVisible(false);
    hasTriggeredConfetti.current = false;
    if (onClose) onClose();
  };

  // Get icon based on type
  const getIcon = () => {
    if (celebrationType === 'sparks') {
      return <Sparkles className="h-5 w-5 text-amber-400" />;
    }

    if (celebrationType === 'milestone') {
      switch (milestone) {
        case 'first_block':
          return <Star className="h-5 w-5 text-purple-400" />;
        case 'half_complete':
          return <Award className="h-5 w-5 text-indigo-400" />;
        case 'all_complete':
          return <Trophy className="h-5 w-5 text-amber-400" />;
        default:
          return <Star className="h-5 w-5 text-blue-400" />;
      }
    }

    if (celebrationType === 'achievement' && achievement) {
      switch (achievement.icon) {
        case 'star':
          return <Star className="h-5 w-5" style={{ color: achievement.color }} />;
        case 'sparkle':
          return <Sparkles className="h-5 w-5" style={{ color: achievement.color }} />;
        case 'trophy':
          return <Trophy className="h-5 w-5" style={{ color: achievement.color }} />;
        case 'award':
          return <Award className="h-5 w-5" style={{ color: achievement.color }} />;
      }
    }

    return <Star className="h-5 w-5 text-purple-400" />;
  };

  // Get text content based on type
  const getContent = () => {
    if (celebrationType === 'sparks') {
      return {
        title: `+${sparksEarned} ${sparksEarned === 1 ? 'Spark' : 'Sparks'}!`,
        description: childAge <= 8 
          ? 'Great job exploring!' 
          : 'Earned for your curiosity and exploration.',
      };
    }

    if (celebrationType === 'milestone') {
      switch (milestone) {
        case 'first_block':
          return {
            title: 'First Discovery!',
            description: childAge <= 8 
              ? 'You found something amazing!' 
              : 'You\'ve started your learning journey.',
          };
        case 'half_complete':
          return {
            title: 'Halfway There!',
            description: childAge <= 8 
              ? 'Keep going, you\'re doing great!' 
              : 'You\'ve explored half of this topic.',
          };
        case 'all_complete':
          return {
            title: 'Topic Mastered!',
            description: childAge <= 8 
              ? 'Wow! You learned it all!' 
              : 'You\'ve explored all content on this topic.',
          };
        case 'question_asked':
          return {
            title: 'Great Question!',
            description: childAge <= 8 
              ? 'Asking questions helps you learn!' 
              : 'Curious minds ask great questions.',
          };
        case 'reply_sent':
          return {
            title: 'Thoughtful Reply!',
            description: childAge <= 8 
              ? 'Thanks for sharing your ideas!' 
              : 'Engaging with content deepens understanding.',
          };
        default:
          return {
            title: 'Achievement!',
            description: 'You\'ve reached a milestone.',
          };
      }
    }

    if (celebrationType === 'achievement' && achievement) {
      return {
        title: achievement.title,
        description: achievement.description,
      };
    }

    return {
      title: 'Great Job!',
      description: 'Keep exploring and learning.',
    };
  };

  // Position styles
  const positionStyles = position === 'center'
    ? "fixed inset-0 flex items-center justify-center z-50"
    : "fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50";

  // Size and style based on age and type
  const getSizeStyles = () => {
    if (celebrationType === 'achievement') {
      return "p-5 max-w-sm";
    }
    
    if (childAge <= 8) {
      return "p-4 max-w-xs";
    }
    
    return "p-3 max-w-xs";
  };

  const content = getContent();
  const icon = getIcon();

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className={positionStyles}
        >
          <div 
            className={`${getSizeStyles()} rounded-lg bg-wonderwhiz-deep-purple/90 backdrop-blur-md border border-wonderwhiz-purple/30 shadow-lg text-white`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 bg-white/10 rounded-full p-3">
                {icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-medium ${childAge <= 8 ? 'text-lg' : 'text-base'}`}>
                  {content.title}
                </h3>
                <p className={`${childAge <= 8 ? 'text-sm' : 'text-xs'} text-white/80`}>
                  {content.description}
                </p>
              </div>
            </div>
            
            {celebrationType === 'achievement' && (
              <div className="mt-3 flex justify-end">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClose} 
                  className="text-white/70 hover:text-white hover:bg-white/10"
                >
                  {childAge <= 8 ? 'Awesome!' : 'Dismiss'}
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CelebrationSystem;
