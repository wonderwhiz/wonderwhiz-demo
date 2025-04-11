
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bookmark, ChevronDown, X, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSpecialistInfo } from '@/utils/specialists';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SavedItem {
  id: string;
  type: string;
  content: any;
  specialist_id: string;
  curio_id: string;
  title?: string;
  curio_title?: string;
  saved_at?: string;
}

interface SavedItemsSidebarProps {
  childId?: string;
  onViewItem?: (item: SavedItem) => void;
}

const SavedItemsSidebar: React.FC<SavedItemsSidebarProps> = ({ childId, onViewItem }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayedItemsCount, setDisplayedItemsCount] = useState(5);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    if (childId) {
      fetchSavedItems();
    }
  }, [childId]);

  const fetchSavedItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('id, type, content, specialist_id, curio_id, bookmarked, curios(title)')
        .eq('bookmarked', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedItems = data.map(item => ({
        id: item.id,
        type: item.type,
        content: item.content,
        specialist_id: item.specialist_id,
        curio_id: item.curio_id,
        title: getItemTitle(item.type, item.content),
        curio_title: item.curios?.title,
        saved_at: new Date().toISOString() // This should ideally come from a saved_at column
      }));

      setSavedItems(formattedItems);
    } catch (error) {
      console.error('Error fetching saved items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getItemTitle = (type: string, content: any): string => {
    switch (type) {
      case 'fact':
      case 'funFact':
        return content?.title || content?.fact?.substring(0, 50) + '...' || 'Interesting Fact';
      case 'quiz':
        return content?.question?.substring(0, 50) + '...' || 'Quiz';
      case 'flashcard':
        return content?.front?.substring(0, 50) + '...' || 'Flashcard';
      case 'creative':
        return content?.prompt?.substring(0, 50) + '...' || 'Creative Challenge';
      case 'task':
        return content?.title || content?.task?.substring(0, 50) + '...' || 'Task';
      case 'news':
        return content?.headline || 'News';
      case 'mindfulness':
        return content?.title || 'Mindfulness Exercise';
      default:
        return 'Saved Item';
    }
  };

  const handleLoadMore = () => {
    setDisplayedItemsCount(prev => Math.min(prev + 5, savedItems.length));
  };

  const handleFilterChange = (newFilter: string | null) => {
    setFilter(newFilter);
    setDisplayedItemsCount(5);
  };

  const filteredItems = filter
    ? savedItems.filter(item => item.type === filter)
    : savedItems;

  const getItemTypeLabel = (type: string): string => {
    switch (type) {
      case 'fact': return 'Fact';
      case 'funFact': return 'Fun Fact';
      case 'quiz': return 'Quiz';
      case 'flashcard': return 'Flashcard';
      case 'creative': return 'Creative';
      case 'task': return 'Task';
      case 'news': return 'News';
      case 'mindfulness': return 'Mindfulness';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const getItemTypeIcon = (type: string) => {
    // You would add specific icons for each type
    return <Bookmark className="h-4 w-4" />;
  };

  return (
    <Sidebar variant="inset" className="bg-purple-950">
      <SidebarHeader className="rounded-none bg-violet-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bookmark className="mr-2 h-5 w-5 text-yellow-400" />
            <h3 className="text-white font-medium">Saved Items</h3>
          </div>
          <SidebarTrigger />
        </div>
        
        <div className="flex items-center gap-2 mt-2 pb-1 overflow-x-auto scrollbar-hide">
          <Button
            variant={filter === null ? "secondary" : "ghost"}
            size="sm"
            className="text-xs whitespace-nowrap"
            onClick={() => handleFilterChange(null)}
          >
            All
          </Button>
          {['fact', 'quiz', 'flashcard', 'creative', 'mindfulness'].map(type => (
            <Button
              key={type}
              variant={filter === type ? "secondary" : "ghost"}
              size="sm"
              className="text-xs whitespace-nowrap"
              onClick={() => handleFilterChange(type)}
            >
              {getItemTypeLabel(type)}
            </Button>
          ))}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="bg-purple-950">
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white/5 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : savedItems.length === 0 ? (
              <div className="text-center p-6">
                <Bookmark className="mx-auto h-10 w-10 text-white/30 mb-2" />
                <p className="text-white/60">No saved items yet</p>
                <p className="text-white/40 text-sm mt-1">
                  Click the Save button on content you'd like to revisit later
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredItems.slice(0, displayedItemsCount).map((item) => {
                  const specialist = getSpecialistInfo(item.specialist_id);
                  
                  return (
                    <Card 
                      key={item.id}
                      className="overflow-hidden bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                      onClick={() => onViewItem && onViewItem(item)}
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={specialist.avatar} alt={specialist.name} />
                            <AvatarFallback className={specialist.fallbackColor}>{specialist.fallbackInitial}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium text-white/70">{specialist.name}</span>
                          <Badge className="ml-auto text-[10px] bg-white/10 text-white/70 hover:bg-white/20">
                            {getItemTypeLabel(item.type)}
                          </Badge>
                        </div>
                        
                        <h4 className="text-sm font-medium text-white line-clamp-2">{item.title}</h4>
                        
                        {item.curio_title && (
                          <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-white/50 italic">
                              From: {item.curio_title}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 text-white/40 hover:text-white hover:bg-white/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Implement view in curio logic
                              }}
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </Card>
                  );
                })}
                
                {displayedItemsCount < filteredItems.length && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-white/60 hover:text-white hover:bg-white/10"
                    onClick={handleLoadMore}
                  >
                    Load More <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
};

export default SavedItemsSidebar;
