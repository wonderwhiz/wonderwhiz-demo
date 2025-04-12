
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, PlayCircle, PauseCircle } from 'lucide-react';
import { toast } from 'sonner';
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
  const [answer, setAnswer] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    const generateQuickAnswer = async () => {
      if (!question) return;
      
      try {
        setIsLoading(true);
        
        // Generate a simple, short answer to the question
        // In a real app, this would call an API to get an actual answer
        const simplifiedQuestion = question.toLowerCase();
        let generatedAnswer = '';
        
        if (simplifiedQuestion.includes('space') || simplifiedQuestion.includes('planet')) {
          generatedAnswer = "Space is incredibly vast! It contains billions of galaxies, each with billions of stars. Our solar system has 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune. Earth is the only planet we know has life.";
        } else if (simplifiedQuestion.includes('animal') || simplifiedQuestion.includes('wildlife')) {
          generatedAnswer = "There are over 1 million known animal species on Earth! Animals range from tiny microscopic creatures to the massive blue whale, which is the largest animal ever known to exist.";
        } else if (simplifiedQuestion.includes('dinosaur')) {
          generatedAnswer = "Dinosaurs lived during the Mesozoic Era, from about 245 to 66 million years ago. They were the dominant land animals until a massive asteroid impact caused their extinction.";
        } else if (simplifiedQuestion.includes('ocean') || simplifiedQuestion.includes('sea')) {
          generatedAnswer = "Oceans cover about 71% of Earth's surface and contain 97% of Earth's water. The deepest part is the Mariana Trench, which reaches depths of almost 11,000 meters (36,000 feet)!";
        } else {
          generatedAnswer = `${question} is a fascinating topic! As you explore the content below, you'll discover amazing facts and knowledge about this subject. Let the journey of discovery begin!`;
        }
        
        setAnswer(generatedAnswer);
      } catch (error) {
        console.error('Error generating quick answer:', error);
        setAnswer("Let's explore this fascinating topic together! Scroll down to begin your learning journey.");
      } finally {
        setIsLoading(false);
      }
    };
    
    generateQuickAnswer();
  }, [question]);
  
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
    <Card className="bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border-none overflow-hidden shadow-xl">
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
