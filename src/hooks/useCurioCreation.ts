
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Curio {
  id: string;
  title: string;
  query: string;
  created_at: string;
}

interface ChildProfile {
  id: string;
  name: string;
  avatar_url: string;
  interests: string[];
  age: number;
  sparks_balance: number;
}

export const useCurioCreation = (
  profileId?: string, 
  childProfile?: ChildProfile | null,
  setPastCurios?: React.Dispatch<React.SetStateAction<Curio[]>>,
  setChildProfile?: React.Dispatch<React.SetStateAction<ChildProfile | null>>,
  setCurrentCurio?: React.Dispatch<React.SetStateAction<Curio | null>>
) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmitQuery = async () => {
    if (!query.trim() || isGenerating || !childProfile || !profileId) {
      console.error('Cannot submit query: ', {
        queryEmpty: !query.trim(),
        isGenerating: isGenerating,
        noChildProfile: !childProfile,
        noProfileId: !profileId
      });
      return;
    }
    
    setIsGenerating(true);
    console.log('Submitting curio query:', query, 'for child:', profileId);
    
    try {
      // Create a new curio
      const { data: newCurio, error: curioError } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          query: query.trim(),
          title: query.trim()
        })
        .select()
        .single();
        
      if (curioError) {
        console.error('Error creating curio:', curioError);
        throw curioError;
      }

      console.log('New curio created:', newCurio);

      if (setPastCurios) {
        setPastCurios(prev => [newCurio, ...prev]);
      }
      
      if (setCurrentCurio) {
        setCurrentCurio(newCurio);
      }
      
      // Navigate to the new curio
      window.location.href = `/curio/${profileId}/${newCurio.id}`;
      
      setQuery('');
      
      setTimeout(async () => {
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 1
            })
          });
  
          if (childProfile && setChildProfile) {
            setChildProfile({
              ...childProfile,
              sparks_balance: (childProfile.sparks_balance || 0) + 1
            });
          }
  
          await supabase.from('sparks_transactions').insert({
            child_id: profileId,
            amount: 1,
            reason: 'Starting new Curio'
          });
          
          toast.success('You earned 1 spark for your curiosity!', {
            duration: 2000,
            position: 'bottom-right'
          });
        } catch (error) {
          console.error('Error awarding sparks for new curio:', error);
        }
      }, 100);
      
    } catch (error) {
      console.error('Error creating curio:', error);
      toast.error("Oops! Something went wrong with your question.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFollowRabbitHole = async (question: string) => {
    setQuery(question);
    
    Promise.resolve().then(async () => {
      try {
        await supabase.functions.invoke('increment-sparks-balance', {
          body: JSON.stringify({
            profileId: profileId,
            amount: 2
          })
        });
        
        if (childProfile && setChildProfile) {
          setChildProfile({
            ...childProfile,
            sparks_balance: (childProfile.sparks_balance || 0) + 2
          });
        }
        
        await supabase.from('sparks_transactions').insert({
          child_id: profileId,
          amount: 2,
          reason: 'Following a rabbit hole'
        });
        
        toast.success('You earned 2 sparks for exploring deeper!', {
          duration: 2000,
          position: 'bottom-right'
        });
      } catch (error) {
        console.error('Error awarding sparks for rabbit hole:', error);
      }
    });
    
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };

  const handleCurioSuggestionClick = async (suggestion: string) => {
    console.log('Handling curio suggestion click:', suggestion);
    setQuery(suggestion);
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };

  const handlePastCurioClick = async (curioQuery: string) => {
    console.log('Handling past curio click:', curioQuery);
    setQuery(curioQuery);
    setTimeout(() => {
      handleSubmitQuery();
    }, 100);
  };

  return {
    query,
    setQuery,
    isGenerating,
    setIsGenerating,
    handleSubmitQuery,
    handleFollowRabbitHole,
    handleCurioSuggestionClick,
    handlePastCurioClick
  };
};
