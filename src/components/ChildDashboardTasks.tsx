
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Award, Sparkles } from 'lucide-react';
import ChildTaskList from './ChildTaskList';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ChildDashboardTasksProps {
  childId: string;
  onSparkEarned?: (amount: number) => void;
}

const ChildDashboardTasks: React.FC<ChildDashboardTasksProps> = ({ childId, onSparkEarned }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentlyEarnedSparks, setRecentlyEarnedSparks] = useState(0);

  const handleTaskComplete = (sparks: number) => {
    setRecentlyEarnedSparks(sparks);
    
    // Show the animation and reset after 3 seconds
    setTimeout(() => {
      setRecentlyEarnedSparks(0);
    }, 3000);
    
    // Call the parent component's callback if provided
    if (onSparkEarned) {
      onSparkEarned(sparks);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-wonderwhiz-purple/10 rounded-full blur-xl -mr-8 -mt-8 z-0"></div>
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-wonderwhiz-pink/10 rounded-full blur-lg -ml-8 -mb-8 z-0"></div>
      
      <CardHeader 
        className="cursor-pointer hover:bg-white/5 transition-colors relative z-10"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: isExpanded ? [0, 360] : 0 }}
              transition={{ duration: 0.6 }}
            >
              <CheckCircle className="mr-2 h-6 w-6 text-wonderwhiz-purple" />
            </motion.div>
            <motion.span
              initial={{ y: 0 }}
              animate={{ y: isExpanded ? [0, -2, 0] : 0 }}
              transition={{ duration: 0.3 }}
              className="font-baloo"
            >
              My Tasks
            </motion.span>
          </CardTitle>
          
          <motion.div 
            className="text-white/60 flex items-center"
            animate={{ rotateX: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.4 }}
          >
            <Award className="h-4 w-4 mr-1 text-wonderwhiz-gold" />
            <span className="mr-2 text-sm">Earn Sparks!</span>
            <span className="text-lg">▼</span>
          </motion.div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="relative z-10"
          >
            <CardContent>
              <ChildTaskList 
                childId={childId} 
                onSparkEarned={onSparkEarned}
                onTaskComplete={handleTaskComplete} 
              />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparks earned animation - enhanced */}
      <AnimatePresence>
        {recentlyEarnedSparks > 0 && (
          <motion.div 
            className="fixed bottom-10 right-10 bg-gradient-to-r from-wonderwhiz-purple to-wonderwhiz-purple/80 text-white px-6 py-4 rounded-xl shadow-lg flex items-center z-50 border border-white/20"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
          >
            <div className="mr-3 relative">
              <Sparkles className="h-8 w-8 text-wonderwhiz-gold" />
              <motion.div 
                className="absolute inset-0"
                animate={{ 
                  scale: [1, 1.4, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <Sparkles className="h-8 w-8 text-wonderwhiz-gold/50" />
              </motion.div>
            </div>
            
            <div>
              <p className="text-lg font-bold font-baloo">Amazing work!</p>
              <div className="flex items-center">
                <span>You earned </span>
                <motion.span 
                  className="mx-1 text-wonderwhiz-gold font-bold"
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {recentlyEarnedSparks}
                </motion.span>
                <span> sparks!</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ChildDashboardTasks;
