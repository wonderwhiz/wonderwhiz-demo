
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface QuickAnswerProps {
  question: string;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
  isExpanded?: boolean; // Keep this prop for flexibility
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  onToggleExpand,
  onStartJourney,
  childId,
  isExpanded = true // Default to true for fully expanded view
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
              query: question, // Changed from question to query based on logs
              childAge // Using childAge instead of childProfile object
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
          throw error; // Re-throw to be caught by the outer catch
        }
      } catch (error) {
        console.error('Error generating quick answer:', error);
        
        // Generate a fallback answer based on the question
        setAnswerSource('fallback');
        const fallbackAnswer = generateFallbackAnswer(question);
        setAnswer(fallbackAnswer);
        
        // Optional: show a toast for the error
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
      return 10; // Default age
    }
  };
  
  const generateFallbackAnswer = (question: string): string => {
    // Extract the core topic from the question
    const simplifiedQuestion = question.toLowerCase();
    let topic = question;
    
    // Try to extract the main topic by removing question words
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
    
    // Remove trailing punctuation
    topic = topic.replace(/[?.!,]$/, '').trim();
    
    // Generate an informative but generic answer
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
      // Generic response for any topic
      return `${topic} is a fascinating topic with many interesting aspects to explore! The content below will help you understand the key facts and concepts related to this subject.`;
    }
  };
  
  const handleToggleExpand = () => {
    onToggleExpand();
  };

  const handleToggleAudio = () => {
    if (isPlaying) {
      // Stop audio logic would go here
      setIsPlaying(false);
      toast.info("Audio playback stopped");
    } else {
      // Play audio logic would go here
      setIsPlaying(true);
      toast("Playing audio summary...", {
        duration: 3000,
      });
      
      // Simulate audio ending after a few seconds
      setTimeout(() => {
        setIsPlaying(false);
      }, 10000);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-none overflow-hidden shadow-xl mb-6">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-white">Quick Summary</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleExpand}
            className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <AnimatePresence initial={false}>
          {isExpanded ? (
            <motion.div
              key="content"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {isLoading ? (
                <div className="py-4 flex items-center justify-center">
                  <div className="h-5 w-5 rounded-full border-2 border-indigo-400/30 border-t-indigo-400 animate-spin"></div>
                  <span className="ml-3 text-white/70">Generating summary...</span>
                </div>
              ) : (
                <div className="py-2">
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
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-white/70 text-sm line-clamp-1"
            >
              {isLoading ? "Generating a quick summary..." : answer.substring(0, 100) + "..."}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

export default QuickAnswer;
