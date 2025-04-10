
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';
import { useChildProfile } from '@/hooks/use-child-profile';

interface QuickAnswerProps {
  question: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
  answer?: string; // Make this optional so we can provide it directly or generate it
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId,
  answer: providedAnswer
}) => {
  const [answer, setAnswer] = useState<string>(providedAnswer || '');
  const [isLoading, setIsLoading] = useState(!providedAnswer);
  const { generateQuickAnswer } = useGroqGeneration();
  const { childProfile } = useChildProfile(childId);

  useEffect(() => {
    // If answer is already provided, don't generate a new one
    if (providedAnswer) {
      setAnswer(providedAnswer);
      setIsLoading(false);
      return;
    }
    
    async function loadQuickAnswer() {
      if (!question) return;
      
      setIsLoading(true);
      try {
        const childAge = childProfile?.age ? Number(childProfile.age) : 10;
        const generatedAnswer = await generateQuickAnswer(question, childAge);
        setAnswer(generatedAnswer);
      } catch (error) {
        console.error('Error loading quick answer:', error);
        // Provide a meaningful fallback that's relevant to the question
        const fallbackAnswers = {
          default: `${question} involves fascinating concepts you'll explore in this journey. You'll discover key facts, understand the principles, and engage with fun activities to deepen your knowledge.`,
          "ocean mysteries": "The ocean is full of incredible mysteries! Did you know that we've explored less than 20% of our oceans? From bioluminescent creatures in the deep sea to massive underwater mountain ranges, the ocean holds countless wonders waiting to be discovered.",
          "volcanoes": "Volcanoes are powerful geological features that form when magma from the Earth's core rises to the surface! They can create new islands, change landscapes, and have played a crucial role in Earth's development throughout history.",
          "space": "Space is the vast expanse beyond Earth's atmosphere, containing planets, stars, galaxies, and countless mysteries! Scientists discover new wonders every day as we explore this infinite frontier.",
          "dinosaurs": "Dinosaurs ruled Earth for over 165 million years! These fascinating creatures came in all shapes and sizes, from tiny chicken-sized predators to massive plant-eaters longer than three school buses.",
          "robots": "Robots are amazing machines that can be programmed to perform tasks automatically! From helping in factories to exploring other planets, robots are becoming an increasingly important part of our world."
        };
        
        // Find the most relevant fallback by checking if the question contains any of our keywords
        const relevantTopic = Object.keys(fallbackAnswers).find(topic => 
          question.toLowerCase().includes(topic)
        );
        
        setAnswer(relevantTopic ? fallbackAnswers[relevantTopic] : fallbackAnswers.default);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadQuickAnswer();
  }, [question, childProfile, providedAnswer, generateQuickAnswer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        <h3 className="font-bold text-lg sm:text-xl text-white mb-2">Quick Answer</h3>
        <p className="text-white/80 text-sm sm:text-base mb-3">{question}</p>
        
        <div 
          className={`relative overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[300px]' : 'max-h-20'}`}
          style={{ 
            maskImage: !isExpanded ? 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0))' : 'none',
            WebkitMaskImage: !isExpanded ? 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0))' : 'none' 
          }}
        >
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-full mb-2"></div>
              <div className="h-4 bg-white/10 rounded w-2/3"></div>
            </div>
          ) : (
            <p className="text-white/90 leading-relaxed">{answer}</p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center mt-4 gap-3 justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
            className="text-white/70 hover:text-white hover:bg-white/10 flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4" />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                <span>Read More</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={onStartJourney}
            className="bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-vibrant-yellow hover:opacity-90 text-wonderwhiz-deep-purple font-medium rounded-full w-full sm:w-auto"
          >
            <Rocket className="h-4 w-4 mr-2" />
            <span>Start Knowledge Journey</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default QuickAnswer;
