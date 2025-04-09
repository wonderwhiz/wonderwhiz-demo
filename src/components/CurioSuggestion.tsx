
import React from 'react';
import { motion } from 'framer-motion';
import MagicalBorder from './MagicalBorder';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface CurioSuggestionProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  index: number;
  directGenerate?: boolean;
  profileId?: string;
}

const COLOR_VARIANTS = [
  'rainbow', 'gold', 'purple', 'blue'
];

const CurioSuggestion: React.FC<CurioSuggestionProps> = ({ 
  suggestion, 
  onClick,
  index,
  directGenerate = true,
  profileId
}) => {
  const colorVariant = COLOR_VARIANTS[index % COLOR_VARIANTS.length];
  const navigate = useNavigate();
  
  const handleClick = async () => {
    if (directGenerate && profileId) {
      try {
        toast.loading("Creating your wonder journey...", {
          id: "create-curio",
          duration: 3000
        });
        
        // Create a new curio based on the suggestion
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileId,
            title: suggestion,
            query: suggestion,
          })
          .select('id')
          .single();
          
        if (error) {
          console.error('Error creating curio from suggestion:', error);
          toast.error("Oops! Couldn't start your journey", {
            id: "create-curio"
          });
          // Fallback to just setting the query
          onClick(suggestion);
          return;
        }
        
        if (newCurio && newCurio.id) {
          // Celebration with confetti
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33'],
            disableForReducedMotion: true
          });
          
          toast.success("Your adventure begins!", {
            id: "create-curio"
          });
          
          // Award sparks for curiosity
          try {
            await supabase.functions.invoke('increment-sparks-balance', {
              body: JSON.stringify({
                profileId: profileId,
                amount: 2
              })
            });
            
            await supabase.from('sparks_transactions').insert({
              child_id: profileId,
              amount: 2,
              reason: 'Starting a new adventure'
            });
            
            toast.success('You earned 2 sparks for exploring!', {
              icon: '✨',
              position: 'bottom-right',
              duration: 3000
            });
          } catch (err) {
            console.error('Error awarding sparks:', err);
          }
          
          // Navigate to the curio page with the correct path
          navigate(`/curio/${profileId}/${newCurio.id}`);
        } else {
          console.error('No curio ID returned after creation');
          toast.error("Couldn't create your journey", {
            id: "create-curio"
          });
          onClick(suggestion);
        }
      } catch (error) {
        console.error('Error creating curio from suggestion:', error);
        toast.error("Couldn't create your journey", {
          id: "create-curio"
        });
        // Fallback to just setting the query
        onClick(suggestion);
      }
    } else {
      // Original behavior
      onClick(suggestion);
    }
  };
  
  // Extract a key keyword from the suggestion for personalized messaging
  const getKeyword = () => {
    const words = suggestion.toLowerCase().split(' ');
    const keyTopics = ['space', 'animals', 'dinosaurs', 'oceans', 'planets', 'stars', 'robots', 
                      'science', 'history', 'magic', 'body', 'brain', 'earth', 'technology'];
    
    for (const topic of keyTopics) {
      if (suggestion.toLowerCase().includes(topic)) {
        return topic;
      }
    }
    
    return '';
  };
  
  const keyword = getKeyword();
  const hasKeyword = keyword.length > 0;
  
  // Get engaging prefix based on suggestion content
  const getPrefix = () => {
    if (suggestion.toLowerCase().includes('how') || suggestion.toLowerCase().includes('why')) {
      return "Discover";
    } else if (suggestion.toLowerCase().includes('what')) {
      return "Explore";
    } else if (hasKeyword) {
      return "Adventure into";
    }
    return "Wonder about";
  };
  
  const prefix = getPrefix();
  const displayText = hasKeyword 
    ? `${prefix} ${keyword}!` 
    : suggestion.length > 30 ? suggestion.substring(0, 27) + '...' : suggestion;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + (index * 0.1) }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <MagicalBorder 
        active={true} 
        type={colorVariant as 'rainbow' | 'gold' | 'purple' | 'blue'} 
        className="rounded-2xl h-full"
      >
        <button
          onClick={handleClick}
          className="w-full h-full p-4 bg-white/10 text-white text-left rounded-2xl border-white/20 hover:bg-white/20 transition-colors font-nunito"
        >
          <span className="block font-bold line-clamp-2">{displayText}</span>
          <span className="block mt-1 text-xs text-white/70 line-clamp-1">
            {suggestion}
          </span>
        </button>
      </MagicalBorder>
    </motion.div>
  );
};

export default CurioSuggestion;
