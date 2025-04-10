
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Sparkles, MapPin } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { supabase } from '@/integrations/supabase/client';

interface QuickAnswerProps {
  question: string;
  answer?: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  answer,
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId
}) => {
  const [loading, setLoading] = useState(false);
  const [quickAnswer, setQuickAnswer] = useState(answer || '');
  const { user } = useUser();

  const handleStartJourney = () => {
    onStartJourney();
  };

  return (
    <Card className="overflow-hidden bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 shadow-lg mb-8">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-400" />
            <h3 className="text-lg font-semibold text-white">Quick Answer</h3>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleExpand}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>
        
        <div className="text-white/90 font-medium mb-2">{question}</div>
        
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-2 text-white/80">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse bg-white/20 h-4 w-full rounded"></div>
                  </div>
                ) : (
                  quickAnswer || "Loading your quick answer..."
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-3 flex justify-end">
          <Button 
            size="sm"
            onClick={handleStartJourney}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Explore Deeper
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default QuickAnswer;
