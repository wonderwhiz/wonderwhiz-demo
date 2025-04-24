import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickAnswerProps {
  question: string;
  onStartJourney: () => void;
  childId?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  onStartJourney,
  childId
}) => {
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [answerSource, setAnswerSource] = useState<'api' | 'fallback' | 'error'>('api');
  
  useEffect(() => {
    const generateQuickAnswer = async () => {
      if (!question) return;
      
      try {
        setIsLoading(true);
        
        // Get child's age if childId is available
        let childAge = 10;
        if (childId) {
          childAge = await getChildAge(childId);
        }
        
        // Call the Supabase function with a try-catch block
        try {
          const { data, error } = await supabase.functions.invoke('generate-quick-answer', {
            body: { 
              query: question,
              childAge
            }
          });
          
          if (error) {
            throw new Error(`API error: ${error.message}`);
          }
          
          if (data && data.answer) {
            setAnswer(data.answer);
            setAnswerSource(data.source || 'api');
          } else {
            throw new Error('Invalid response format');
          }
        } catch (error) {
          console.error('Error generating quick answer:', error);
          throw error;
        }
      } catch (error) {
        console.error('Error generating quick answer:', error);
        
        // Generate a fallback answer based on the question
        setAnswerSource('fallback');
        const fallbackAnswer = generateFallbackAnswer(question);
        setAnswer(fallbackAnswer);
        
        toast.error('Could not generate a detailed answer. Showing a basic summary instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    generateQuickAnswer();
  }, [question, childId]);
  
  const getChildAge = async (childId: string): Promise<number> => {
    try {
      const { data } = await supabase
        .from('child_profiles')
        .select('age')
        .eq('id', childId)
        .single();
        
      return data?.age ? Number(data.age) : 10;
    } catch (err) {
      console.error('Error fetching child age:', err);
      return 10;
    }
  };
  
  const generateFallbackAnswer = (question: string): string => {
    const simplifiedQuestion = question.toLowerCase();
    let topic = question;
    
    if (simplifiedQuestion.includes('what is') || 
        simplifiedQuestion.includes('what are')) {
      topic = question.replace(/what is|what are/i, '').trim();
    } else if (simplifiedQuestion.includes('how do') ||
               simplifiedQuestion.includes('how does')) {
      topic = question.replace(/how do|how does/i, '').trim();
    } else if (simplifiedQuestion.includes('why do') ||
               simplifiedQuestion.includes('why does')) {
      topic = question.replace(/why do|why does/i, '').trim();
    }
    
    topic = topic.replace(/[?.!,]$/, '').trim();
    
    if (simplifiedQuestion.includes('space') || 
        simplifiedQuestion.includes('planet') || 
        simplifiedQuestion.includes('star')) {
      return `${topic} is a fascinating subject in astronomy! Space is incredibly vast and contains billions of galaxies, each with billions of stars. As you explore below, you'll discover amazing facts about ${topic}.`;
    } else if (simplifiedQuestion.includes('animal') || 
               simplifiedQuestion.includes('wildlife') ||
               simplifiedQuestion.includes('ocean')) {
      return `${topic} is an interesting area of biology! Our planet has incredible biodiversity with millions of species. The content below will help you understand more about ${topic}.`;
    } else if (simplifiedQuestion.includes('dinosaur')) {
      return `Dinosaurs are fascinating prehistoric creatures! They ruled Earth for over 165 million years before going extinct about 66 million years ago. Let's explore more about ${topic} in the content below.`;
    } else {
      return `${topic} is a fascinating topic with many interesting aspects to explore! The content below will help you understand the key facts and concepts related to this subject.`;
    }
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      setIsPlaying(false);
      toast.info("Audio playback stopped");
    } else {
      setIsPlaying(true);
      toast("Playing audio summary...", {
        duration: 3000,
      });
      
      setTimeout(() => {
        setIsPlaying(false);
      }, 10000);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-none overflow-hidden shadow-xl mb-6">
      <div className="p-4 sm:p-5">
        <div className="py-2">
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="h-5 w-5 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin"></div>
              <span className="ml-3 text-white/70">Generating summary...</span>
            </div>
          ) : (
            <>
              <p className="text-white/90 leading-relaxed">{answer}</p>
              
              {answerSource === 'fallback' && (
                <p className="text-white/50 text-xs mt-2">
                  Note: This is a quick summary. Explore the content below for more detailed information.
                </p>
              )}
              
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleAudio}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/10"
                >
                  {isPlaying ? (
                    <>
                      <PauseCircle className="h-4 w-4 mr-2" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      <span>Listen</span>
                    </>
                  )}
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={onStartJourney}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
                >
                  Start Learning
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuickAnswer;
