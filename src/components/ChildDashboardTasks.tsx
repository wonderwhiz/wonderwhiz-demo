
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
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
    <Card className="bg-white/5 border-white/10 overflow-hidden">
      <CardHeader 
        className="cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="mr-2 h-5 w-5 text-wonderwhiz-purple" />
            My Tasks
          </CardTitle>
          <div className="text-white/60">
            {isExpanded ? '▲' : '▼'}
          </div>
        </div>
      </CardHeader>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent>
              <ChildTaskList childId={childId} onTaskComplete={handleTaskComplete} />
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Sparks earned animation */}
      <AnimatePresence>
        {recentlyEarnedSparks > 0 && (
          <motion.div 
            className="fixed bottom-10 right-10 bg-wonderwhiz-purple text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
          >
            <CheckCircle className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
            <span>You earned {recentlyEarnedSparks} sparks!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ChildDashboardTasks;
