
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, PartyPopper, Medal } from 'lucide-react';
import confetti from 'canvas-confetti';

interface KidCelebrationSystemProps {
  trigger?: boolean;
  type?: 'section_complete' | 'topic_complete' | 'quiz_complete' | 'milestone';
  childAge?: number;
  onComplete?: () => void;
}

const KidCelebrationSystem: React.FC<KidCelebrationSystemProps> = ({
  trigger = false,
  type = 'section_complete',
  childAge = 10,
  onComplete
}) => {
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowCelebration(true);
      triggerConfetti();
      
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onComplete?.();
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  const triggerConfetti = () => {
    // Different confetti patterns based on celebration type
    if (type === 'topic_complete') {
      // Big celebration for completing a whole topic
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#d946ef', '#f59e0b', '#10b981']
      });
    } else {
      // Smaller celebration for sections
      confetti({
        particleCount: 50,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#8b5cf6', '#d946ef']
      });
    }
  };

  const getCelebrationContent = () => {
    const isYoung = childAge <= 8;
    
    switch (type) {
      case 'section_complete':
        return {
          icon: <Star className="h-12 w-12 text-wonderwhiz-vibrant-yellow" />,
          title: isYoung ? "🌟 Awesome Job!" : "Section Complete! ⭐",
          message: isYoung 
            ? "You're such a great learner! Keep going!" 
            : "Great work! Ready for the next section?",
          emoji: "🎉"
        };
      
      case 'topic_complete':
        return {
          icon: <Trophy className="h-12 w-12 text-wonderwhiz-vibrant-yellow" />,
          title: isYoung ? "🏆 You Did It!" : "Topic Mastered! 🏆",
          message: isYoung 
            ? "You learned so much! You're amazing!" 
            : "Congratulations! You've completed this topic!",
          emoji: "🎊"
        };
      
      case 'quiz_complete':
        return {
          icon: <Medal className="h-12 w-12 text-wonderwhiz-bright-pink" />,
          title: isYoung ? "🥇 Smart Cookie!" : "Quiz Champion! 🥇",
          message: isYoung 
            ? "You answered so well! High five!" 
            : "Excellent work on the quiz!",
          emoji: "🧠"
        };
      
      default:
        return {
          icon: <Sparkles className="h-12 w-12 text-wonderwhiz-purple" />,
          title: isYoung ? "✨ Way to Go!" : "Achievement Unlocked! ✨",
          message: isYoung 
            ? "You're doing fantastic!" 
            : "Keep up the great work!",
          emoji: "⭐"
        };
    }
  };

  const content = getCelebrationContent();

  return (
    <AnimatePresence>
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="bg-gradient-to-br from-wonderwhiz-bright-pink to-wonderwhiz-purple p-8 rounded-3xl shadow-2xl border-4 border-white/30 max-w-sm mx-4"
          >
            <div className="text-center space-y-4">
              {/* Animated icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 0.6,
                  repeat: 2,
                  ease: "easeInOut"
                }}
                className="flex justify-center"
              >
                {content.icon}
              </motion.div>

              {/* Title with emoji animation */}
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`font-bold text-white ${childAge <= 8 ? 'text-2xl' : 'text-xl'}`}
              >
                {content.title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className={`text-white/90 ${childAge <= 8 ? 'text-lg' : 'text-base'}`}
              >
                {content.message}
              </motion.p>

              {/* Floating emojis */}
              <div className="relative h-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute text-2xl"
                    initial={{ 
                      x: 0, 
                      y: 0, 
                      opacity: 0,
                      scale: 0
                    }}
                    animate={{ 
                      x: (Math.random() - 0.5) * 200,
                      y: -100 - Math.random() * 50,
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.2,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  >
                    {content.emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KidCelebrationSystem;
