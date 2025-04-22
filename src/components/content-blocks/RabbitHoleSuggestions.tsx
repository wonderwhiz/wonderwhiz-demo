
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Sparkles, Lightbulb } from 'lucide-react';
import SpecialistAvatar from '@/components/SpecialistAvatar';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface RabbitHoleSuggestionsProps {
  curioTitle: string;
  profileId: string;
  onSuggestionClick: (question: string) => void;
  specialistIds: string[];
}

const RabbitHoleSuggestions: React.FC<RabbitHoleSuggestionsProps> = ({
  curioTitle,
  profileId,
  onSuggestionClick,
  specialistIds = []
}) => {
  const navigate = useNavigate();
  
  // Generate related suggestions based on the curio title
  const generateSuggestions = () => {
    // Remove any "why", "how", "what" prefix to create cleaner related questions
    const cleanTitle = curioTitle
      .replace(/^(why|how|what|when|where|who)\s(can|do|does|is|are|did|would|will|should|could|has|have|had)\s/i, '')
      .replace(/\?$/, '');
    
    const basicSuggestions = [
      `How do ${cleanTitle} impact our daily lives?`,
      `What are the most interesting facts about ${cleanTitle}?`,
      `The history of ${cleanTitle} explained`,
      `What science is behind ${cleanTitle}?`,
      `The future of ${cleanTitle}`
    ];
    
    // Keep a subset of suggestions
    return basicSuggestions.slice(0, 3);
  };
  
  const suggestions = generateSuggestions();
  
  const handleSuggestionClick = async (question: string) => {
    // Show loading toast
    toast.loading("Creating new exploration...");
    
    try {
      // Create a new curio with the question
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: profileId,
          title: question,
          query: question,
        })
        .select('id')
        .single();
      
      if (error) {
        console.error('Error creating curio:', error);
        toast.error("Could not create new exploration");
        return;
      }
      
      if (newCurio && newCurio.id) {
        toast.success("New exploration created!");
        
        // Award sparks for following curiosity
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: profileId,
              amount: 2
            })
          });
          
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
            zIndex: 1000,
            colors: ['#FF5BA3', '#00E2FF', '#4A6FFF'] // Brand colors
          });
          
          toast.success("You earned 2 sparks for your curiosity!", {
            icon: "✨"
          });
        } catch (err) {
          console.error('Error awarding sparks:', err);
        }
        
        // Call the onSuggestionClick prop first
        onSuggestionClick(question);
        
        // Navigate to the new curio page
        navigate(`/curio/${profileId}/${newCurio.id}`);
      }
    } catch (error) {
      console.error('Error creating new curio:', error);
      toast.error("Could not create new exploration");
    }
  };
  
  // Determine which icon to use based on suggestion content
  const getSuggestionIcon = (suggestion: string, index: number) => {
    if (suggestion.toLowerCase().includes('how') || suggestion.toLowerCase().includes('science')) {
      return <Compass className="h-4 w-4 text-wonderwhiz-bright-pink flex-shrink-0" />;
    } else if (suggestion.toLowerCase().includes('facts') || suggestion.toLowerCase().includes('interesting')) {
      return <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow flex-shrink-0" />;
    } else {
      return <Lightbulb className="h-4 w-4 text-wonderwhiz-cyan flex-shrink-0" />;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-wonderwhiz-light-purple/50 flex items-center justify-center mr-3">
          <Compass className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white font-nunito">Continue Your Exploration</h2>
      </div>
      
      <p className="text-white/80 text-sm mb-4 font-inter">
        What would you like to discover next? Here are some interesting paths to follow.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((suggestion, index) => {
          // Get a specialist ID for this suggestion
          const specialistId = specialistIds[index % specialistIds.length] || 'nova';
          
          return (
            <motion.button
              key={index}
              className="flex items-start bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg border border-white/10 text-left group"
              onClick={() => handleSuggestionClick(suggestion)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <SpecialistAvatar specialistId={specialistId} size="sm" className="mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="flex items-center mb-1">
                  {getSuggestionIcon(suggestion, index)}
                  <span className="ml-1.5 text-wonderwhiz-vibrant-yellow/80 text-xs">Explore</span>
                </div>
                <p className="text-white text-sm group-hover:text-wonderwhiz-bright-pink transition-colors font-inter">
                  {suggestion}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default RabbitHoleSuggestions;
