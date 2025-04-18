
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Heart, MessageCircle, Award, Timer, Bell, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SocialWellbeingProps {
  childId: string;
  childAge?: number;
  isOpen?: boolean;
  onClose: () => void;
  onShare?: (method: 'parent' | 'friend' | 'teacher') => void;
}

const SocialWellbeing: React.FC<SocialWellbeingProps> = ({
  childId,
  childAge = 10,
  isOpen = false,
  onClose,
  onShare
}) => {
  const [sessionDuration, setSessionDuration] = useState(0);
  
  // Start a timer to track session duration
  React.useEffect(() => {
    const startTime = localStorage.getItem('session_start_time');
    if (!startTime) {
      localStorage.setItem('session_start_time', Date.now().toString());
    }
    
    const interval = setInterval(() => {
      const start = parseInt(localStorage.getItem('session_start_time') || Date.now().toString());
      const duration = Math.floor((Date.now() - start) / 60000); // in minutes
      setSessionDuration(duration);
      
      // Show wellbeing reminder after 30 minutes
      if (duration === 30 && !isOpen) {
        toast.info("Time for a quick break!", {
          description: "You've been exploring for 30 minutes. Remember to rest your eyes!",
          position: 'top-center',
          duration: 10000,
          icon: '🌿',
          action: {
            label: "Take break",
            onClick: () => {
              toast.success("Great choice! Take a 5-minute break, stretch, and look at something far away.");
            }
          }
        });
      }
    }, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [isOpen]);
  
  const handleShare = (method: 'parent' | 'friend' | 'teacher') => {
    if (onShare) onShare(method);
    
    // Show appropriate toast based on sharing method
    switch (method) {
      case 'parent':
        toast.success("Shared with parent!", {
          description: "They'll receive this in their WonderWhiz parent dashboard.",
          icon: '👪'
        });
        break;
      case 'friend':
        toast.success("Created a share link!", {
          description: "Now you can share this discovery with friends.",
          icon: '👭'
        });
        break;
      case 'teacher':
        toast.success("Added to school portfolio!", {
          description: "Your teacher will see this in your learning collection.",
          icon: '👩‍🏫'
        });
        break;
    }
  };
  
  const handleScheduleReminder = () => {
    toast.success("Learning reminder scheduled!", {
      description: "We'll remind you to continue your exploration tomorrow.",
      icon: '⏰'
    });
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div 
            className="bg-gradient-to-br from-wonderwhiz-deep-purple to-wonderwhiz-light-purple/90 rounded-t-3xl sm:rounded-3xl w-full sm:w-auto sm:max-w-lg p-6 m-0 sm:m-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-white/20 rounded-full mx-auto sm:hidden mb-4" />
            
            <h2 className="text-xl font-bold text-white mb-4 text-center">
              Share & Wellbeing
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-auto p-4 bg-white/10 border-white/10 hover:bg-white/20 text-white"
                onClick={() => handleShare('parent')}
              >
                <div className="w-10 h-10 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center">
                  <Heart className="h-5 w-5 text-wonderwhiz-bright-pink" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Share with Parent</div>
                  <div className="text-xs text-white/70">Add to family collection</div>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-auto p-4 bg-white/10 border-white/10 hover:bg-white/20 text-white"
                onClick={() => handleShare('friend')}
              >
                <div className="w-10 h-10 rounded-full bg-wonderwhiz-cyan/20 flex items-center justify-center">
                  <Share2 className="h-5 w-5 text-wonderwhiz-cyan" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Share with Friend</div>
                  <div className="text-xs text-white/70">Create a shareable link</div>
                </div>
              </Button>
              
              {childAge > 7 && (
                <Button
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-auto p-4 bg-white/10 border-white/10 hover:bg-white/20 text-white"
                  onClick={() => handleShare('teacher')}
                >
                  <div className="w-10 h-10 rounded-full bg-wonderwhiz-gold/20 flex items-center justify-center">
                    <Award className="h-5 w-5 text-wonderwhiz-gold" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">School Portfolio</div>
                    <div className="text-xs text-white/70">Add to your school collection</div>
                  </div>
                </Button>
              )}
              
              <Button
                variant="outline"
                className="flex items-center justify-start gap-3 h-auto p-4 bg-white/10 border-white/10 hover:bg-white/20 text-white"
                onClick={handleScheduleReminder}
              >
                <div className="w-10 h-10 rounded-full bg-wonderwhiz-vibrant-yellow/20 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-wonderwhiz-vibrant-yellow" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Learning Reminder</div>
                  <div className="text-xs text-white/70">Schedule a reminder</div>
                </div>
              </Button>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-white/70" />
                <div>
                  <div className="text-sm text-white/70">Learning session</div>
                  <div className="text-lg font-bold text-white">{sessionDuration} minutes</div>
                </div>
              </div>
              
              {sessionDuration > 40 && (
                <div className="mt-2 text-sm text-wonderwhiz-bright-pink">
                  Remember to take a break! Rest your eyes and stretch.
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button variant="ghost" onClick={onClose} className="text-white/70">
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SocialWellbeing;
