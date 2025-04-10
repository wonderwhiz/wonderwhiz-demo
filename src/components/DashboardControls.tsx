
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Book, Wand, FlaskConical } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { motion } from 'framer-motion';

interface DashboardControlsProps {
  profileId: string;
  activeView: string;
  setActiveView: (view: string) => void;
  curioId?: string;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  profileId,
  activeView,
  setActiveView,
  curioId
}) => {
  const viewButtons = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'collections', label: 'Collections' },
    { id: 'games', label: 'Games' }
  ];

  return (
    <div className="py-4 px-4 sm:px-6 bg-gradient-to-r from-indigo-950/80 to-indigo-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value)} className="bg-white/5 p-1 rounded-lg">
          {viewButtons.map(view => (
            <ToggleGroupItem 
              key={view.id}
              value={view.id} 
              aria-label={`${view.label} View`}
              className={activeView === view.id ? 'bg-white/15 text-white' : 'text-white/70'}
            >
              {view.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        
        <div className="flex items-center gap-2">
          {curioId && (
            <div className="flex items-center space-x-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to={`/curio/${profileId}/${curioId}`}>
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                    <Book className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Standard</span>
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to={`/simple-curio/${profileId}/${curioId}`}>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                    <Sparkles className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Simplified</span>
                  </Button>
                </Link>
              </motion.div>
            </div>
          )}
          
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to={`/curio/${profileId}/new`}>
              <Button size="sm" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple">
                <Wand className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">New Curio</span>
                <span className="inline sm:hidden">New</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;
