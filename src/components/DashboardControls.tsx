
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles, Book, Wand, FlaskConical } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  return (
    <div className="py-4 px-4 sm:px-6 bg-gradient-to-r from-indigo-950/80 to-indigo-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <ToggleGroup type="single" value={activeView} onValueChange={(value) => value && setActiveView(value)}>
          <ToggleGroupItem value="dashboard" aria-label="Dashboard View">
            Dashboard
          </ToggleGroupItem>
          <ToggleGroupItem value="collections" aria-label="Collections View">
            Collections
          </ToggleGroupItem>
          <ToggleGroupItem value="games" aria-label="Games View">
            Games
          </ToggleGroupItem>
        </ToggleGroup>
        
        <div className="flex items-center gap-2">
          {curioId && (
            <div className="flex items-center space-x-2">
              <Link to={`/curio/${profileId}/${curioId}`}>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  <Book className="w-4 h-4 mr-1.5" />
                  <span>Standard View</span>
                </Button>
              </Link>
              
              <Link to={`/simple-curio/${profileId}/${curioId}`}>
                <Button size="sm" className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600">
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  <span>Simplified View</span>
                </Button>
              </Link>
            </div>
          )}
          
          <Link to={`/curio/${profileId}/new`}>
            <Button size="sm" className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple">
              <Wand className="w-4 h-4 mr-1.5" />
              <span>New Curio</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardControls;
