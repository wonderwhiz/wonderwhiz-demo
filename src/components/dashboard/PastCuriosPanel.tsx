
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Book, Clock, Search, ArrowUpRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

interface PastCuriosPanelProps {
  pastCurios: any[];
  childId: string;
  onClose: () => void;
}

const PastCuriosPanel: React.FC<PastCuriosPanelProps> = ({ pastCurios, childId, onClose }) => {
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  
  const handleCurioClick = (curioId: string) => {
    navigate(`/curio/${childId}/${curioId}`);
    onClose();
  };
  
  const filteredCurios = pastCurios.filter(curio => 
    curio.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-5 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white flex items-center">
          <Book className="mr-2 h-5 w-5 text-wonderwhiz-vibrant-yellow" />
          Your Wonder Journal
        </h3>
        
        <Button variant="ghost" size="icon" className="text-white/70" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="bg-white/10 rounded-xl flex items-center px-3 py-2 mb-5">
        <Search className="h-4 w-4 text-white/60 mr-2" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search past adventures..."
          className="bg-transparent border-none w-full text-white focus:outline-none text-sm"
        />
      </div>
      
      <div className="space-y-3">
        {filteredCurios.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-white/60 mb-2">No adventures found</div>
            {filter && (
              <Button variant="outline" size="sm" onClick={() => setFilter('')}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          filteredCurios.map((curio, index) => (
            <motion.div 
              key={curio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleCurioClick(curio.id)}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white text-base line-clamp-1">{curio.title}</h4>
                  <ArrowUpRight className="h-4 w-4 text-white/60" />
                </div>
                
                <div className="flex items-center mt-2 text-white/60 text-xs">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {formatDistanceToNow(new Date(curio.created_at), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default PastCuriosPanel;
