
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronRight, ChevronDown, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';
import { supabase } from '@/integrations/supabase/client';

interface QuickAnswerProps {
  question: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId
}) => {
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playText, isLoading: isPlayingAudio } = useElevenLabsVoice();

  useEffect(() => {
    if (question && childId && !answer) {
      fetchQuickAnswer();
    }
  }, [question, childId]);

  const fetchQuickAnswer = async () => {
    if (!question || !childId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get child age from profile for context
      const { data: profileData } = await supabase
        .from('child_profiles')
        .select('age')
        .eq('id', childId)
        .single();
        
      const childAge = profileData?.age || 10;
      
      const { data, error } = await supabase.functions.invoke('generate-quick-answer', {
        body: { 
          query: question,
          childAge,
          curioContext: question
        }
      });
      
      if (error) throw new Error(error.message);
      
      if (data?.answer) {
        setAnswer(data.answer);
      } else {
        throw new Error('No answer returned');
      }
    } catch (err) {
      console.error('Error fetching quick answer:', err);
      setError('Unable to generate an answer at this time.');
      
      // Set a fallback answer
      if (question.toLowerCase().includes('brain') && question.toLowerCase().includes('morning')) {
        setAnswer("Our brains have a natural wake-up cycle, also known as our circadian rhythm. This is controlled by a small group of cells in the brain called the suprachiasmatic nucleus (SCN). The SCN responds to light and darkness to tell our body when it's time to be awake or asleep.");
      } else {
        setAnswer("I'm not sure about that. Would you like to explore this topic together?");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAnswer = () => {
    if (answer) {
      playText(answer, 'whizzy');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <Card className="bg-wonderwhiz-purple border-none overflow-hidden shadow-lg">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-wonderwhiz-bright-pink mr-2" />
                <h3 className="text-lg font-medium text-white">Quick Answer</h3>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayAnswer}
                  disabled={loading || isPlayingAudio || !answer}
                  className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  <Volume2 className={`h-4 w-4 mr-1 ${isPlayingAudio ? 'text-wonderwhiz-bright-pink' : ''}`} />
                  Listen
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleExpand}
                  className="bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className={`text-white transition-all duration-300 ${isExpanded ? 'max-h-[500px]' : 'max-h-[120px] overflow-hidden'}`}>
              {loading ? (
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-2 bg-white/20 rounded"></div>
                    <div className="h-2 bg-white/20 rounded"></div>
                    <div className="h-2 bg-white/20 rounded w-3/4"></div>
                  </div>
                </div>
              ) : error ? (
                <p className="text-red-300">{error}</p>
              ) : (
                answer || "I'm exploring this topic now..."
              )}
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20">
                  Science
                </Badge>
                <Badge variant="outline" className="bg-white/10 text-white/90 border-white/20">
                  Biology
                </Badge>
              </div>
              
              <Button
                onClick={onStartJourney}
                size="sm"
                className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/80 text-white"
              >
                Explore More
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickAnswer;
