
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface TasksSectionProps {
  childId: string;
  pendingTasksCount: number;
}

const TasksSection: React.FC<TasksSectionProps> = ({ childId, pendingTasksCount }) => {
  const navigate = useNavigate();
  
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  const handleNavigateToTasks = () => {
    navigate(`/dashboard/${childId}?tab=tasks`);
  };
  
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-wonderwhiz-bright-pink/20 flex items-center justify-center mr-3">
            <Award className="h-5 w-5 text-wonderwhiz-bright-pink" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Tasks</h3>
            <p className="text-white/60 text-sm">Complete tasks to earn sparks!</p>
          </div>
        </div>
        
        {pendingTasksCount > 0 && (
          <Badge className="bg-wonderwhiz-bright-pink text-white border-none">
            {pendingTasksCount} pending
          </Badge>
        )}
      </div>
      
      <div className="space-y-3 mb-4">
        {pendingTasksCount > 0 ? (
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-wonderwhiz-vibrant-yellow mr-2" />
              <span className="text-white">You have {pendingTasksCount} pending tasks</span>
            </div>
            <Check className="h-5 w-5 text-green-400" />
          </div>
        ) : (
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-white">All caught up! No pending tasks</span>
            </div>
          </div>
        )}
      </div>
      
      <Button 
        onClick={handleNavigateToTasks}
        className="w-full bg-gradient-to-r from-wonderwhiz-bright-pink/80 to-wonderwhiz-bright-pink/60 hover:opacity-90 text-white border-none"
      >
        View All Tasks
      </Button>
    </motion.div>
  );
};

export default TasksSection;
