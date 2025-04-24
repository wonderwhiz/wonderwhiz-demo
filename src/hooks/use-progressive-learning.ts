
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Define the learning stages for progressive content building
export type LearningStage = 'foundational' | 'expansion' | 'connection' | 'application' | 'deeper_dive';

interface ProgressiveLearningOptions {
  childId?: string;
  curioId?: string;
  childAge?: number;
  topic?: string;
}

interface ProgressiveSuggestion {
  question: string;
  learningStage: LearningStage;
}

export function useProgressiveLearning({
  childId,
  curioId,
  childAge = 10,
  topic
}: ProgressiveLearningOptions) {
  const [foundationalQuestions, setFoundationalQuestions] = useState<string[]>([]);
  const [expansionQuestions, setExpansionQuestions] = useState<string[]>([]);
  const [connectionQuestions, setConnectionQuestions] = useState<string[]>([]);
  const [applicationQuestions, setApplicationQuestions] = useState<string[]>([]);
  const [deeperDiveQuestions, setDeeperDiveQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [viewedBlocks, setViewedBlocks] = useState<number>(0);
  const [currentLearningStage, setCurrentLearningStage] = useState<LearningStage>('foundational');

  // Generate suggestions based on the topic and learning stage
  const generateStagedSuggestions = async (stage: LearningStage) => {
    if (!topic) return [];
    
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.functions.invoke('generate-curio-suggestions', {
        body: JSON.stringify({
          topic,
          childAge,
          count: 3,
          buildingBlockType: stage
        })
      });
      
      if (error) throw error;
      
      if (data?.suggestions) {
        return data.suggestions.map((s: ProgressiveSuggestion) => s.question);
      }
      
      return [];
    } catch (err) {
      console.error(`Error generating ${stage} suggestions:`, err);
      setError(err instanceof Error ? err : new Error('Failed to generate suggestions'));
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Determine the current learning stage based on blocks viewed
  useEffect(() => {
    if (viewedBlocks < 2) {
      setCurrentLearningStage('foundational');
    } else if (viewedBlocks < 4) {
      setCurrentLearningStage('expansion');
    } else if (viewedBlocks < 6) {
      setCurrentLearningStage('connection');
    } else if (viewedBlocks < 8) {
      setCurrentLearningStage('application');
    } else {
      setCurrentLearningStage('deeper_dive');
    }
  }, [viewedBlocks]);

  // Load suggestions for the current learning stage
  useEffect(() => {
    const loadSuggestionsForStage = async () => {
      switch (currentLearningStage) {
        case 'foundational':
          if (foundationalQuestions.length === 0) {
            const questions = await generateStagedSuggestions('foundational');
            setFoundationalQuestions(questions);
          }
          break;
        case 'expansion':
          if (expansionQuestions.length === 0) {
            const questions = await generateStagedSuggestions('expansion');
            setExpansionQuestions(questions);
          }
          break;
        case 'connection':
          if (connectionQuestions.length === 0) {
            const questions = await generateStagedSuggestions('connection');
            setConnectionQuestions(questions);
          }
          break;
        case 'application':
          if (applicationQuestions.length === 0) {
            const questions = await generateStagedSuggestions('application');
            setApplicationQuestions(questions);
          }
          break;
        case 'deeper_dive':
          if (deeperDiveQuestions.length === 0) {
            const questions = await generateStagedSuggestions('deeper_dive');
            setDeeperDiveQuestions(questions);
          }
          break;
      }
    };
    
    if (topic) {
      loadSuggestionsForStage();
    }
  }, [currentLearningStage, topic]);

  const incrementViewedBlocks = () => {
    setViewedBlocks(prev => prev + 1);
  };

  // Get questions for the current stage
  const getCurrentStageQuestions = (): string[] => {
    switch (currentLearningStage) {
      case 'foundational': return foundationalQuestions;
      case 'expansion': return expansionQuestions;
      case 'connection': return connectionQuestions;
      case 'application': return applicationQuestions;
      case 'deeper_dive': return deeperDiveQuestions;
    }
  };

  // Get suggestions for specific stages
  const getQuestionsByStage = (stage: LearningStage): string[] => {
    switch (stage) {
      case 'foundational': return foundationalQuestions;
      case 'expansion': return expansionQuestions;
      case 'connection': return connectionQuestions;
      case 'application': return applicationQuestions;
      case 'deeper_dive': return deeperDiveQuestions;
    }
  };

  return {
    currentLearningStage,
    foundationalQuestions,
    expansionQuestions,
    connectionQuestions,
    applicationQuestions,
    deeperDiveQuestions,
    isLoading,
    error,
    viewedBlocks,
    incrementViewedBlocks,
    getCurrentStageQuestions,
    getQuestionsByStage
  };
}
