
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Book, Wand, Home } from 'lucide-react';
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
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'collections', label: 'My Stories', icon: Book }
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
              className={`${activeView === view.id ? 'bg-white/15 text-white' : 'text-white/70'} px-4 py-2`}
            >
              <view.icon className="h-4 w-4 mr-2 inline-block" />
              {view.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        
        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
            <Link to={`/curio/${profileId}/new`}>
              <Button size="lg" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-bold text-lg">
                <Wand className="w-5 h-5 mr-2" />
                <span>New Adventure!</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;
