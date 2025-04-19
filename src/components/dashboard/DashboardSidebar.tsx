
import React, { useState } from 'react';
import { ChevronDown, MessageSquare, Bookmark, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import SparksBalance from '@/components/SparksBalance';
import SavedItemsSidebar from './SavedItemsSidebar';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface DashboardSidebarProps {
  childId: string;
  sparksBalance: number;
  pastCurios: Curio[];
  currentCurioId?: string;
  onCurioSelect: (curio: Curio) => void;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  childId, 
  sparksBalance, 
  pastCurios, 
  currentCurioId,
  onCurioSelect 
}) => {
  const [showSavedItems, setShowSavedItems] = useState(false);
  const [curioPageSize] = useState(5);
  const [displayedCuriosCount, setDisplayedCuriosCount] = useState(curioPageSize);

  const handleLoadMoreCurios = () => {
    setDisplayedCuriosCount(prev => Math.min(prev + curioPageSize, pastCurios.length));
  };

  return (
    <>
      <Sidebar variant="inset" className="bg-purple-950">
        <SidebarHeader className="rounded-none bg-violet-900">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-medium">Dashboard</h3>
            <SidebarTrigger />
          </div>
          <div className="flex items-center">
            <SparksBalance childId={childId} initialBalance={sparksBalance} size="md" />
            <button 
              onClick={() => setShowSavedItems(true)} 
              className="ml-auto text-white/60 hover:text-white transition-colors flex items-center"
            >
              <Bookmark className="mr-1.5 h-4 w-4 text-yellow-400" />
              <span>View Saved</span>
            </button>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="bg-purple-950">
          <div className="p-4">
            <h3 className="text-white font-medium mb-3 flex items-center">
              <span>Your Past Curios</span>
              <div className="ml-2 text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/70">
                {pastCurios.length}
              </div>
            </h3>
            
            {pastCurios.length === 0 ? (
              <p className="text-white/60 text-sm">Ask a question to start exploring!</p>
            ) : (
              <div className="space-y-3">
                {pastCurios.slice(0, displayedCuriosCount).map((curio, index) => (
                  <Card 
                    key={curio.id} 
                    className={`
                      cursor-pointer 
                      transition-all 
                      hover:bg-white/10 
                      border 
                      border-opacity-20 
                      rounded-lg 
                      overflow-hidden 
                      shadow-sm 
                      hover:shadow-md
                      ${getCardColorClass(index)}
                    `} 
                    onClick={() => onCurioSelect(curio)}
                  >
                    <div 
                      className={`
                        p-3 
                        flex 
                        items-center 
                        ${currentCurioId === curio.id ? 'bg-white/10 text-white' : 'text-white/80'}
                        line-clamp-2 
                        break-words 
                        overflow-hidden
                      `}
                    >
                      <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span 
                        className="
                          text-sm 
                          font-medium 
                          leading-tight 
                          line-clamp-2 
                          break-words 
                          max-h-[3rem] 
                          overflow-hidden 
                          text-ellipsis
                        "
                      >
                        {curio.title}
                      </span>
                    </div>
                  </Card>
                ))}
                
                {displayedCuriosCount < pastCurios.length && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="flex justify-center pt-2"
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="
                        text-white/60 
                        hover:text-white 
                        hover:bg-white/10 
                        flex 
                        items-center 
                        gap-1 
                        text-xs 
                        border 
                        border-white/10 
                        rounded-full
                      " 
                      onClick={handleLoadMoreCurios}
                    >
                      Load More <ChevronDown className="h-3 w-3" />
                    </Button>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>

      {/* Saved Items Sidebar */}
      <AnimatePresence>
        {showSavedItems && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
          >
            <div className="relative h-full">
              <div className="absolute top-0 left-0 h-full">
                <SavedItemsSidebar 
                  childId={childId}
                  onViewItem={(item) => {
                    // Handle viewing saved item
                    setShowSavedItems(false);
                  }}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/20 hover:bg-black/40"
                onClick={() => setShowSavedItems(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Helper function to get the color class based on index
const getCardColorClass = (index: number) => {
  switch (index % 5) {
    case 0: return "border-wonderwhiz-pink/60 bg-wonderwhiz-pink/5";
    case 1: return "border-wonderwhiz-gold/60 bg-wonderwhiz-gold/5";
    case 2: return "border-wonderwhiz-blue/60 bg-wonderwhiz-blue/5";
    case 3: return "border-wonderwhiz-purple/60 bg-wonderwhiz-purple/5";
    case 4: return "border-emerald-400/60 bg-emerald-400/5";
    default: return "border-white/60 bg-white/5";
  }
};

export default DashboardSidebar;
