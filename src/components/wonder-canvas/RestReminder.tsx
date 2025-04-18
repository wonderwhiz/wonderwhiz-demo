
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Coffee, Moon, Sun, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface RestReminderProps {
  childAge?: number;
  sessionDuration?: number; // in minutes
  onDismiss?: () => void;
  onRest?: () => void;
}

const RestReminder: React.FC<RestReminderProps> = ({
  childAge = 10,
  sessionDuration = 30, // Default 30 minutes
  onDismiss,
  onRest
}) => {
  const [showReminder, setShowReminder] = useState(false);
  const [sessionTime, setSessionTime] = useState(0); // in seconds
  const [timeVisible, setTimeVisible] = useState(false);
  
  // Convert session duration to seconds
  const sessionDurationSeconds = sessionDuration * 60;
  
  // Determine message and icon based on child age and time of day
  const getMessageContent = () => {
    const currentHour = new Date().getHours();
    const isEvening = currentHour >= 19 || currentHour < 6;
    const isAfternoon = currentHour >= 13 && currentHour < 19;
    
    let icon = <Clock className="h-6 w-6 text-white" />;
    if (isEvening) {
      icon = <Moon className="h-6 w-6 text-indigo-200" />;
    } else if (isAfternoon) {
      icon = <Coffee className="h-6 w-6 text-amber-200" />;
    } else {
      icon = <Sun className="h-6 w-6 text-yellow-200" />;
    }
    
    // Different messages based on age
    if (childAge < 8) {
      return {
        title: isEvening ? "Bedtime reminder" : "Rest reminder",
        message: isEvening 
          ? "Time to rest your eyes! Maybe it's getting close to bedtime?"
          : "You've been exploring for a while. Time for a quick break!",
        icon,
        actions: ["Take a break", "5 more minutes"]
      };
    } else {
      return {
        title: "Learning break reminder",
        message: isEvening 
          ? "It's getting late. Consider taking a break and continuing tomorrow."
          : `You've been exploring for ${Math.floor(sessionTime / 60)} minutes. Short breaks help your brain remember what you've learned.`,
        icon,
        actions: ["Take a break", "Continue learning"]
      };
    }
  };
  
  // Track session time
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => {
        const newTime = prev + 1;
        
        // Show reminder at intervals
        if (newTime >= sessionDurationSeconds && newTime % sessionDurationSeconds === 0) {
          setShowReminder(true);
        }
        
        // Toggle time visibility every 5 minutes as a gentle reminder
        if (newTime % 300 === 0) { // Every 5 minutes
          setTimeVisible(true);
          setTimeout(() => setTimeVisible(false), 5000);
        }
        
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [sessionDurationSeconds]);
  
  const handleDismiss = () => {
    setShowReminder(false);
    if (onDismiss) onDismiss();
  };
  
  const handleRest = () => {
    setShowReminder(false);
    toast.success("Great choice! Taking breaks helps your brain grow stronger.", {
      icon: "🧠",
      position: "top-center"
    });
    if (onRest) onRest();
  };
  
  const content = getMessageContent();
  
  return (
    <>
      {/* Session time indicator */}
      <AnimatePresence>
        {timeVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-4 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 text-sm text-white/90 flex items-center z-50"
          >
            <Clock className="h-3.5 w-3.5 mr-1.5 text-white/70" />
            <span>{Math.floor(sessionTime / 60)}m</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Rest reminder modal */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              className="bg-gradient-to-br from-wonderwhiz-deep-purple to-indigo-900 rounded-2xl p-5 max-w-sm w-full relative"
            >
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-white/70 hover:text-white bg-white/10 rounded-full p-1"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-indigo-500/20 rounded-full">
                  {content.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  {content.title}
                </h3>
                
                <p className="text-white/80 text-center mb-6">
                  {content.message}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <Button
                    onClick={handleRest}
                    className="bg-wonderwhiz-bright-pink hover:bg-pink-600 text-white flex-1"
                  >
                    {content.actions[0]}
                  </Button>
                  
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 flex-1"
                  >
                    {content.actions[1]}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RestReminder;
