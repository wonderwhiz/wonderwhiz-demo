
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
  answer?: string; // Optional provided answer
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

  // Ocean-specific fallback answer since that's the current topic
  const oceanFallbackAnswer = "The ocean is Earth's largest unexplored frontier! Covering more than 70% of our planet, oceans are home to millions of species, from microscopic plankton to enormous whales. Scientists estimate we've explored less than 20% of this vast underwater world. Ocean mysteries include deep sea creatures with bioluminescence, underwater volcanoes that form new islands, and powerful currents that affect global climate patterns. As you explore this topic, you'll discover fascinating facts about marine life, underwater ecosystems, ocean geology, and how humans interact with this vital part of our planet.";

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
        
        // If the question contains "ocean" or related terms, ensure we're generating
        // content specifically about oceans
        let queryText = question;
        if (question.includes('?')) {
          // If it's "Ocean mysteries?" or similar, expand it to get better results
          if (question.toLowerCase().includes('ocean')) {
            queryText = "Explain fascinating ocean mysteries and deep sea phenomena for children";
          }
        }
        
        console.log(`Generating quick answer for: ${queryText}, age: ${childAge}`);
        const generatedAnswer = await generateQuickAnswer(queryText, childAge);
        
        if (generatedAnswer && generatedAnswer.length > 20) {
          setAnswer(generatedAnswer);
        } else {
          // If the generated answer is too short or empty, use the fallback
          setAnswer(oceanFallbackAnswer);
        }
      } catch (error) {
        console.error('Error loading quick answer:', error);
        setAnswer(oceanFallbackAnswer);
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
