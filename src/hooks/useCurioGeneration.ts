
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useGroqGeneration } from './useGroqGeneration';
import confetti from 'canvas-confetti';

export function useCurioGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { generateQuickAnswer } = useGroqGeneration();

  const createNewCurio = async (query: string, childId: string, childAge: number = 10) => {
    if (!query || !childId) {
      setError('Query and child ID are required to create a curio');
      return null;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Show a loading toast
      toast.loading("Creating your exploration...", {
        id: "create-curio",
      });
      
      // Pre-generate a quick answer to have content ready
      generateQuickAnswer(query, childAge)
        .catch(err => console.error('Quick answer generation error:', err));
      
      // Create new curio in database
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: childId,
          title: query,
          query: query
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (!newCurio || !newCurio.id) {
        throw new Error('No curio ID returned from database');
      }
      
      // Show success toast
      toast.success("Your exploration is ready!", {
        id: "create-curio",
      });
      
      // Add sparks for the user
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: childId,
            amount: 2
          })
        });
        
        await supabase.from('sparks_transactions').insert({
          child_id: childId,
          amount: 2,
          reason: 'Starting a new exploration'
        });
        
        toast.success('You earned 2 sparks for your curiosity!', {
          icon: '✨',
          position: 'bottom-right',
          duration: 3000
        });
      } catch (err) {
        console.error('Error awarding sparks:', err);
      }
      
      // Create a fun celebration effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8b5cf6', '#d946ef', '#3b82f6']
      });
      
      return newCurio;
    } catch (err: any) {
      console.error('Error creating curio:', err);
      setError(err.message || 'Failed to create curio');
      toast.error("Couldn't create your exploration. Try again!", {
        id: "create-curio",
      });
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateExplorationAndNavigate = async (query: string, childId: string, childAge: number = 10) => {
    const newCurio = await createNewCurio(query, childId, childAge);
    
    if (newCurio && newCurio.id) {
      // Navigate to the new curio
      navigate(`/curio/${childId}/${newCurio.id}`);
      return true;
    }
    
    return false;
  };

  const generateRandomExploration = async (childId: string, childAge: number = 10) => {
    // Topics based on child's age
    const topics = childAge < 8 
      ? [
          "How do dinosaurs sleep?",
          "Why is the sky blue?",
          "How do butterflies fly?",
          "What do astronauts eat in space?",
          "How do frogs grow up?"
        ]
      : [
          "How do animals communicate with each other?",
          "Why do stars twinkle in the night sky?",
          "How do electric cars work?",
          "What makes rainbows appear after rain?",
          "How do plants know which way to grow?"
        ];
    
    // Select a random topic
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    // Generate and navigate
    return generateExplorationAndNavigate(randomTopic, childId, childAge);
  };

  return {
    createNewCurio,
    generateExplorationAndNavigate,
    generateRandomExploration,
    isGenerating,
    error
  };
}
