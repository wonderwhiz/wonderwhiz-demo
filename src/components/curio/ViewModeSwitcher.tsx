
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Layout, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface ViewModeSwitcherProps {
  currentMode: 'standard' | 'enhanced' | 'simplified';
}

const ViewModeSwitcher: React.FC<ViewModeSwitcherProps> = ({ currentMode }) => {
  const { childId, curioId } = useParams<{ childId: string, curioId: string }>();
  const navigate = useNavigate();
  
  const handleModeChange = (mode: 'standard' | 'enhanced' | 'simplified') => {
    if (!childId || !curioId) return;
    
    switch (mode) {
      case 'standard':
        navigate(`/curio/${childId}/${curioId}`);
        break;
      case 'enhanced':
        navigate(`/curio/${childId}/${curioId}`); // Currently the enhanced is the default
        break;
      case 'simplified':
        navigate(`/simple-curio/${childId}/${curioId}`);
        break;
    }
  };
  
  const handleBackToDashboard = () => {
    if (childId) {
      navigate(`/dashboard/${childId}`);
    }
  };
  
  return (
    <div className="flex items-center gap-2 mb-4">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleBackToDashboard}
        className="text-white/70 hover:text-white group transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform duration-200" />
        <span>Dashboard</span>
      </Button>
      
      <div className="ml-auto flex items-center gap-1 bg-white/5 p-1 rounded-lg">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={currentMode === 'standard' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('standard')}
            className={currentMode === 'standard' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white'}
          >
            <Layout className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Standard</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={currentMode === 'enhanced' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('enhanced')}
            className={currentMode === 'enhanced' ? 'bg-primary text-primary-foreground' : 'text-white/70 hover:text-white'}
          >
            <Layers className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Enhanced</span>
          </Button>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={currentMode === 'simplified' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleModeChange('simplified')}
            className={currentMode === 'simplified' ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white' : 'text-white/70 hover:text-white'}
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            <span className="hidden sm:inline">Simplified</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default ViewModeSwitcher;
