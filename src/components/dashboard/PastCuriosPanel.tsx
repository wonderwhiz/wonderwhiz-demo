
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, MessageSquare, Search, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';

interface PastCuriosPanelProps {
  childId: string;
  pastCurios: any[];
  onClose?: () => void;
}

const PastCuriosPanel: React.FC<PastCuriosPanelProps> = ({ 
  childId, 
  pastCurios: initialCurios, 
  onClose 
}) => {
  const [pastCurios, setPastCurios] = useState<any[]>(initialCurios || []);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCurios, setFilteredCurios] = useState<any[]>(initialCurios || []);
  
  // Fetch curios from Supabase if not provided
  useEffect(() => {
    if (initialCurios && initialCurios.length > 0) {
      setPastCurios(initialCurios);
      setFilteredCurios(initialCurios);
      return;
    }
    
    const fetchCurios = async () => {
      if (!childId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('curios')
          .select('*')
          .eq('child_id', childId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setPastCurios(data || []);
        setFilteredCurios(data || []);
      } catch (error) {
        console.error('Error fetching past curios:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurios();
  }, [childId, initialCurios]);
  
  // Filter curios based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCurios(pastCurios);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = pastCurios.filter(curio => 
      curio.query?.toLowerCase().includes(query) || 
      curio.title?.toLowerCase().includes(query)
    );
    
    setFilteredCurios(filtered);
  }, [searchQuery, pastCurios]);

  return (
    <div className="px-4 py-3">
      {/* Panel header with back button */}
      <div className="flex justify-between items-center mb-4">
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
          <h2 className="text-xl font-bold text-white flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-wonderwhiz-cyan" />
            Past Explorations
          </h2>
        </div>
      </div>
      
      {/* Search box */}
      <div className="relative mb-4">
        <Input
          className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          placeholder="Search your explorations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
      </div>
      
      {/* Curios list */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-t-2 border-b-2 border-wonderwhiz-bright-pink rounded-full"></div>
        </div>
      ) : filteredCurios.length === 0 ? (
        <div className="text-center p-6 text-white/60">
          <p>{searchQuery ? 'No explorations match your search' : 'No past explorations yet'}</p>
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
        <div className="space-y-3 pr-2" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {filteredCurios.map((curio, index) => (
            <motion.div
              key={curio.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Link 
                to={`/curio/${childId}/${curio.id}`}
                className="block bg-white/5 hover:bg-white/10 transition-colors rounded-lg p-3 border border-white/10"
              >
                <h3 className="font-medium text-white">{curio.title || curio.query}</h3>
                {curio.created_at && (
                  <div className="flex items-center mt-2 text-white/60 text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{format(new Date(curio.created_at), 'MMM d, h:mm a')}</span>
                    
                    {curio.blocks_count && (
                      <span className="flex items-center ml-3">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        {curio.blocks_count} blocks
                      </span>
                    )}
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PastCuriosPanel;
