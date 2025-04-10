
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CurioPageNavigationProps {
  childId?: string;
}

const CurioPageNavigation: React.FC<CurioPageNavigationProps> = ({ childId }) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    if (childId) {
      navigate(`/dashboard/${childId}`);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center mb-4"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBackToDashboard}
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-full px-3 flex items-center"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        <span className="hidden sm:inline">Back to Dashboard</span>
        <span className="sm:hidden">Back</span>
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate('/')}
        className="text-white/80 hover:text-white hover:bg-white/10 rounded-full ml-2"
      >
        <Home className="w-4 h-4" />
      </Button>
    </motion.div>
  );
};

export default CurioPageNavigation;
