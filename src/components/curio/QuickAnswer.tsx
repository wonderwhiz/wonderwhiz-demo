
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronDown, ChevronUp, Volume2, VolumeX } from 'lucide-react';
import { useGroqGeneration } from '@/hooks/useGroqGeneration';
import { useElevenLabsVoice } from '@/hooks/useElevenLabsVoice';

interface QuickAnswerProps {
  question: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStartJourney: () => void;
  childId?: string;
  answer?: string;
}

const QuickAnswer: React.FC<QuickAnswerProps> = ({
  question,
  isExpanded,
  onToggleExpand,
  onStartJourney,
  childId,
  answer
}) => {
  const { generateQuickAnswer } = useGroqGeneration();
  const { playText, isLoading: isVoiceLoading } = useElevenLabsVoice();
  
  const [quickAnswer, setQuickAnswer] = useState<string>(answer || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect(() => {
    if (!quickAnswer && question) {
      loadQuickAnswer();
    }
  }, [question]);

  const loadQuickAnswer = async () => {
    if (answer) {
      setQuickAnswer(answer);
      return;
    }
    
    setIsLoading(true);
    try {
      const generatedAnswer = await generateQuickAnswer(question);
      setQuickAnswer(generatedAnswer);
      
      // Auto-play the answer when it's first loaded and not muted
      if (!isMuted && generatedAnswer) {
        playVoice(generatedAnswer);
      }
    } catch (error) {
      console.error('Error generating quick answer:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const playVoice = async (text: string) => {
    setIsPlaying(true);
    await playText(text, 'spark');
    setIsPlaying(false);
  };
  
  const handleToggleSound = () => {
    setIsMuted(!isMuted);
    
    if (isMuted && quickAnswer && !isPlaying) {
      // Play voice when unmuting
      playVoice(quickAnswer);
    }
  };
  
  const handlePlaySound = () => {
    if (!isPlaying && quickAnswer) {
      playVoice(quickAnswer);
    }
  };

  if (!question) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6 bg-gradient-to-br from-wonderwhiz-deep-purple/30 to-wonderwhiz-purple/20 backdrop-blur-sm rounded-lg overflow-hidden"
    >
      <div
        className="px-4 py-3 bg-black/20 flex justify-between items-center cursor-pointer"
        onClick={onToggleExpand}
      >
        <h3 className="text-white font-medium text-lg">Quick Answer</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 rounded-full text-white/70 hover:text-white hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSound();
            }}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-white/70" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/70" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4">
          <h4 className="text-white/90 font-medium mb-2">{question}</h4>
          
          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-white/10 rounded w-full"></div>
              <div className="h-4 bg-white/10 rounded w-5/6"></div>
              <div className="h-4 bg-white/10 rounded w-4/6"></div>
            </div>
          ) : (
            <div className="relative">
              <p className="text-white/80 text-sm leading-relaxed">{quickAnswer}</p>
              
              {!isMuted && !isPlaying && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-0 right-0 h-8 w-8 p-0 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                  onClick={handlePlaySound}
                  disabled={isVoiceLoading}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              )}
              
              {isVoiceLoading && (
                <div className="absolute top-0 right-0 h-8 w-8 flex items-center justify-center">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-wonderwhiz-bright-pink rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-4">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onStartJourney();
              }}
              className="bg-wonderwhiz-bright-pink hover:bg-wonderwhiz-bright-pink/90 text-white"
              size="sm"
            >
              Explore Full Journey
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default QuickAnswer;
