import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Bookmark, X, Heart, Clock, Tag, Filter, Search,
  Trash2, ArrowLeft
} from 'lucide-react';
import { Sidebar, SidebarHeader, SidebarContent } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';

interface SavedItemsSidebarProps {
  childId: string;
  onClose?: () => void;
}

interface SavedItem {
  id: string;
  blockId: string;
  bookmarked: boolean;
  liked: boolean;
  createdAt: string;
  content: any;
  type: string;
  curioId: string;
  curioTitle: string;
}

const SavedItemsSidebar: React.FC<SavedItemsSidebarProps> = ({ childId, onClose }) => {
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'liked'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        
        // Query content_blocks table for liked or bookmarked items
        const { data: blocks, error } = await supabase
          .from('content_blocks')
          .select(`
            id,
            content,
            type,
            curio_id,
            liked,
            bookmarked,
            created_at,
            curios:curio_id(id, title, query)
          `)
          .eq('liked', true)
          .or('bookmarked.eq.true')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform the data
        const formattedItems = blocks?.map(block => ({
          id: block.id,
          blockId: block.id,
          bookmarked: block.bookmarked,
          liked: block.liked,
          createdAt: block.created_at,
          content: block.content,
          type: block.type,
          curioId: block.curio_id,
          curioTitle: block.curios?.title || 'Untitled Curio'
        })) || [];
        
        setSavedItems(formattedItems);
      } catch (error) {
        console.error('Error fetching saved items:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedItems();
  }, [childId]);
  
  // Filter and search items
  const getFilteredItems = () => {
    let filteredItems = [...savedItems];
    
    // Apply type filter
    if (filter === 'bookmarked') {
      filteredItems = filteredItems.filter(item => item.bookmarked);
    } else if (filter === 'liked') {
      filteredItems = filteredItems.filter(item => item.liked);
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filteredItems = filteredItems.filter(item => {
        const content = typeof item.content === 'string' 
          ? item.content 
          : JSON.stringify(item.content);
        
        return content.toLowerCase().includes(query) || 
               item.curioTitle.toLowerCase().includes(query);
      });
    }
    
    return filteredItems;
  };
  
  const filteredItems = getFilteredItems();
  
  // Get excerpt text from block content
  const getExcerpt = (content: any, maxLength = 80) => {
    if (!content) return 'No content';
    
    let text = '';
    
    if (typeof content === 'string') {
      text = content;
    } else if (content.fact) {
      text = content.fact;
    } else if (content.question) {
      text = content.question;
    } else if (content.text) {
      text = content.text;
    } else if (content.description) {
      text = content.description;
    } else {
      text = JSON.stringify(content);
    }
    
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...'
      : text;
  };
  
  return (
    <Sidebar 
      side="right" 
      className="border-l border-white/10"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {onClose && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2 text-white/70 hover:text-white"
                onClick={onClose}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="text-lg font-bold text-white flex items-center">
              <Bookmark className="mr-2 h-5 w-5 text-wonderwhiz-gold" />
              Saved Items
            </h2>
          </div>
          
          {onClose && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white/70 hover:text-white"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Search and filters */}
        <div className="mb-4 space-y-2">
          <div className="relative">
            <Input
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              placeholder="Search saved items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant={filter === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? "bg-wonderwhiz-bright-pink text-white" : "text-white/70"}
            >
              All
            </Button>
            <Button 
              variant={filter === 'bookmarked' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('bookmarked')}
              className={filter === 'bookmarked' ? "bg-wonderwhiz-gold text-wonderwhiz-deep-purple" : "text-white/70"}
            >
              <Bookmark className="h-4 w-4 mr-1" />
              Bookmarked
            </Button>
            <Button 
              variant={filter === 'liked' ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter('liked')}
              className={filter === 'liked' ? "bg-wonderwhiz-bright-pink text-white" : "text-white/70"}
            >
              <Heart className="h-4 w-4 mr-1" />
              Liked
            </Button>
          </div>
        </div>
        
        {/* Saved items list */}
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink rounded-full"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center p-6 text-white/60">
            <p>No saved items found</p>
            {searchQuery && (
              <Button 
                variant="link" 
                className="text-wonderwhiz-bright-pink mt-2"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3 pr-2" style={{ maxHeight: 'calc(100vh - 230px)', overflowY: 'auto' }}>
            {filteredItems.map((item, index) => (
              <Link
                key={`${item.id}-${index}`}
                to={`/curio/${childId}/${item.curioId}?blockId=${item.blockId}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {item.liked && <Heart className="h-4 w-4 text-wonderwhiz-bright-pink mr-1" fill="currentColor" />}
                      {item.bookmarked && <Bookmark className="h-4 w-4 text-wonderwhiz-gold mr-1" fill="currentColor" />}
                      <span className="text-xs text-white/50">{item.type}</span>
                    </div>
                    <div className="flex items-center text-xs text-white/50">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(item.createdAt), 'MMM d')}
                    </div>
                  </div>
                  
                  <p className="text-sm text-white font-medium mb-1">
                    {getExcerpt(item.content)}
                  </p>
                  
                  <p className="text-xs text-wonderwhiz-cyan">
                    From: {item.curioTitle}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

export default SavedItemsSidebar;
