
import React from 'react';
import { motion } from 'framer-motion';
import MagicalBorder from './MagicalBorder';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
        toast.loading("Creating new exploration...", {
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
          toast.error("Could not create new exploration", {
            id: "create-curio"
          });
          // Fallback to just setting the query
          onClick(suggestion);
          return;
        }
        
        if (newCurio && newCurio.id) {
          toast.success("New exploration created!", {
            id: "create-curio"
          });
          
          // FIX: Navigate to the curio page with the correct path
          navigate(`/curio/${profileId}/${newCurio.id}`);
        } else {
          console.error('No curio ID returned after creation');
          toast.error("Could not create new exploration", {
            id: "create-curio"
          });
          onClick(suggestion);
        }
      } catch (error) {
        console.error('Error creating curio from suggestion:', error);
        toast.error("Could not create new exploration", {
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
          <span className="block font-medium line-clamp-2">{suggestion}</span>
        </button>
      </MagicalBorder>
    </motion.div>
  );
};

export default CurioSuggestion;
