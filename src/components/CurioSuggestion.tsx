
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MagicalBorder from './MagicalBorder';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

type CardType = 'space' | 'animals' | 'science' | 'history' | 'technology' | 'general';

interface CurioSuggestionProps {
  suggestion: string;
  onClick: (suggestion: string) => void;
  index?: number;
  directGenerate?: boolean;
  profileId?: string;
  type?: CardType;
  loading?: boolean;
}

const COLOR_VARIANTS = [
  'rainbow', 'gold', 'purple', 'blue'
];

const CurioSuggestion: React.FC<CurioSuggestionProps> = ({ 
  suggestion, 
  onClick,
  index = 0,
  directGenerate = true,
  profileId,
  type = 'general',
  loading = false
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const colorVariant = COLOR_VARIANTS[index % COLOR_VARIANTS.length];
  const navigate = useNavigate();
  
  const handleClick = async () => {
    // Prevent multiple rapid clicks
    if (loading || isCreating) return;
    
    // Always call onClick to ensure the parent knows the suggestion was clicked
    onClick(suggestion);
    
    if (directGenerate && profileId) {
      try {
        setIsCreating(true);
        
        toast.loading("Creating your wonder journey...", {
          id: "create-curio",
          duration: 3000
        });
        
        console.log(`Creating curio for suggestion: ${suggestion}`);
        
        // Check if this suggestion was recently created
        const { data: existingCurios, error: checkError } = await supabase
          .from('curios')
          .select('id')
          .eq('child_id', profileId)
          .eq('title', suggestion)
          .order('created_at', { ascending: false })
          .limit(1);
          
        if (checkError) {
          console.error('Error checking for existing curios:', checkError);
        }
        
        // If we found a recent match, just navigate to it
        if (existingCurios && existingCurios.length > 0) {
          console.log(`Found existing curio for suggestion: ${suggestion}`);
          toast.success("Starting your journey!", {
            id: "create-curio"
          });
          
          setTimeout(() => {
            navigate(`/curio/${profileId}/${existingCurios[0].id}`);
          }, 300);
          return;
        }
        
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
          return;
        }
        
        if (newCurio && newCurio.id) {
          // Celebration with confetti
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3'],
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
                amount: 3
              })
            });
            
            await supabase.from('sparks_transactions').insert({
              child_id: profileId,
              amount: 3,
              reason: 'Starting a new adventure with curiosity'
            });
            
            toast.success('You earned 3 sparks for exploring!', {
              icon: '✨',
              position: 'bottom-right',
              duration: 3000
            });
          } catch (err) {
            console.error('Error awarding sparks:', err);
          }
          
          // Navigate to the curio page with the correct path
          setTimeout(() => {
            navigate(`/curio/${profileId}/${newCurio.id}`);
          }, 300);
        } else {
          console.error('No curio ID returned after creation');
          toast.error("Couldn't create your journey", {
            id: "create-curio"
          });
        }
      } catch (error) {
        console.error('Error creating curio from suggestion:', error);
        toast.error("Couldn't create your journey", {
          id: "create-curio"
        });
      } finally {
        setIsCreating(false);
      }
    }
  };
  
  const getKeyword = () => {
    const words = suggestion.toLowerCase().split(' ');
    const keyTopics = ['space', 'animals', 'dinosaurs', 'oceans', 'planets', 'stars', 'robots', 
                      'science', 'history', 'magic', 'body', 'brain', 'earth', 'technology', 
                      'bugs', 'weather', 'music', 'art', 'sports', 'food', 'friends'];
    
    for (const topic of keyTopics) {
      if (suggestion.toLowerCase().includes(topic)) {
        return topic;
      }
    }
    
    return '';
  };
  
  const keyword = getKeyword();
  const hasKeyword = keyword.length > 0;
  
  const getPrefix = () => {
    if (suggestion.toLowerCase().includes('how')) {
      return "Uncover";
    } else if (suggestion.toLowerCase().includes('why')) {
      return "Discover";
    } else if (suggestion.toLowerCase().includes('what')) {
      return "Explore";
    } else if (suggestion.toLowerCase().includes('can')) {
      return "Find Out";
    } else if (suggestion.toLowerCase().includes('do')) {
      return "Investigate";
    } else if (hasKeyword) {
      const options = ["Adventure into", "Journey through", "Leap into", "Dive into", "Zoom into"];
      return options[Math.floor(Math.random() * options.length)];
    }
    return "Wonder about";
  };
  
  const getEmoji = () => {
    if (!keyword) return "✨";
    
    const emojiMap: Record<string, string> = {
      'space': '🚀',
      'animals': '🦁',
      'dinosaurs': '🦖',
      'oceans': '🌊',
      'planets': '🪐',
      'stars': '⭐',
      'robots': '🤖',
      'science': '🔬',
      'history': '📜',
      'magic': '🪄',
      'body': '💪',
      'brain': '🧠',
      'earth': '🌍',
      'technology': '💻',
      'bugs': '🐛',
      'weather': '☀️',
      'music': '🎵',
      'art': '🎨',
      'sports': '⚽',
      'food': '🍕',
      'friends': '👫'
    };
    
    return emojiMap[keyword] || "✨";
  };
  
  const prefix = getPrefix();
  const emoji = getEmoji();
  
  const displayText = hasKeyword 
    ? `${prefix} ${keyword}! ${emoji}` 
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
          className={`w-full h-full p-4 bg-white/10 text-white text-left rounded-2xl border-white/20 hover:bg-white/20 transition-colors font-nunito ${(loading || isCreating) ? 'opacity-70' : ''}`}
          disabled={loading || isCreating}
        >
          {(loading || isCreating) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
              <div className="animate-spin h-5 w-5 border-2 border-white/60 border-t-transparent rounded-full"></div>
            </div>
          )}
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
