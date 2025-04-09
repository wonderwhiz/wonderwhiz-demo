
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lightbulb, Sparkles, BookOpen, Compass } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

interface ContextualRecommendationsProps {
  recommendations: string[];
  onRecommendationClick: (recommendation: string) => void;
  profileId?: string;
}

const ContextualRecommendations: React.FC<ContextualRecommendationsProps> = ({
  recommendations = [],
  onRecommendationClick,
  profileId
}) => {
  const navigate = useNavigate();

  // Safety check and limiting to 3-4 suggestions
  const safeRecommendations = Array.isArray(recommendations) ? recommendations.slice(0, 4) : [];
  
  if (safeRecommendations.length === 0) return null;
  
  // Filter and transform recommendations to be more engaging
  const transformedRecommendations = safeRecommendations.map(rec => {
    // Make questions more direct and personal
    let improved = rec.replace(/What is/i, "Discover");
    improved = improved.replace(/How does/i, "Explore how");
    improved = improved.replace(/Why do/i, "Uncover why");
    
    // Add excitement where appropriate
    if (!improved.includes("!") && !improved.includes("?")) {
      improved += "!";
    }
    
    return improved;
  });
  
  const handleRecommendationClick = async (recommendation: string) => {
    if (profileId) {
      try {
        toast.loading("Creating your wonder journey...", {
          id: "create-curio",
          duration: 3000
        });
        
        // Create a new curio based on the recommendation
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileId,
            title: recommendation,
            query: recommendation,
          })
          .select('id')
          .single();
          
        if (error) {
          console.error('Error creating curio from recommendation:', error);
          toast.error("Oops! Couldn't start your journey", {
            id: "create-curio"
          });
          // Fallback to just setting the query
          onRecommendationClick(recommendation);
          return;
        }
        
        if (newCurio && newCurio.id) {
          // Celebrate with confetti
          confetti({
            particleCount: 60,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#8b5cf6', '#ec4899', '#3b82f6'],
            disableForReducedMotion: true
          });
          
          toast.success("Your adventure begins!", {
            id: "create-curio"
          });
          
          try {
            // Award sparks for curiosity
            await supabase.functions.invoke('increment-sparks-balance', {
              body: JSON.stringify({
                profileId: profileId,
                amount: 2
              })
            });
            
            await supabase.from('sparks_transactions').insert({
              child_id: profileId,
              amount: 2,
              reason: 'Following curiosity'
            });
            
            toast.success('You earned 2 sparks for exploring!', {
              icon: '✨',
              position: 'bottom-right',
              duration: 3000
            });
          } catch (err) {
            console.error('Error awarding sparks:', err);
          }
          
          // Navigate to the correct curio path
          navigate(`/curio/${profileId}/${newCurio.id}`);
        } else {
          console.error('No curio ID returned after creation');
          toast.error("Couldn't create your journey", {
            id: "create-curio"
          });
          onRecommendationClick(recommendation);
        }
      } catch (error) {
        console.error('Error creating curio from recommendation:', error);
        toast.error("Couldn't create your journey", {
          id: "create-curio"
        });
        // Fallback to just setting the query
        onRecommendationClick(recommendation);
      }
    } else {
      // Without profileId, just call the original handler
      onRecommendationClick(recommendation);
    }
  };
  
  // Define different background colors for visual variety and engagement
  const getRecommendationBg = (index: number) => {
    const options = [
      'bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20',
      'bg-gradient-to-r from-pink-500/10 to-rose-500/10 hover:from-pink-500/20 hover:to-rose-500/20',
      'bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20',
      'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20',
      'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20'
    ];
    return options[index % options.length];
  };
  
  // Get recommendation icon based on the recommendation text
  const getRecommendationIcon = (recommendation: string, index: number) => {
    // Check if recommendation text contains certain keywords
    if (recommendation.toLowerCase().includes('why') || recommendation.toLowerCase().includes('how')) {
      return <Compass className="w-3 h-3 mr-1.5 text-cyan-300" />;
    } else if (recommendation.toLowerCase().includes('discover') || recommendation.toLowerCase().includes('explore')) {
      return <BookOpen className="w-3 h-3 mr-1.5 text-amber-300" />;
    } else if (recommendation.toLowerCase().includes('fact') || recommendation.toLowerCase().includes('learn')) {
      return <Lightbulb className="w-3 h-3 mr-1.5 text-emerald-300" />;
    } else {
      return <Sparkles className="w-3 h-3 mr-1.5 text-wonderwhiz-gold" />;
    }
  };
  
  return (
    <div className="mt-6 pt-4 border-t border-white/10">
      <h4 className="text-sm font-medium text-white/80 mb-3 flex items-center">
        <Sparkles className="w-3 h-3 mr-1.5 text-wonderwhiz-gold" />
        <span>Where should we go next?</span>
      </h4>
      <div className="flex flex-wrap gap-2.5">
        <AnimatePresence>
          {transformedRecommendations.map((recommendation, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`text-xs ${getRecommendationBg(index)} text-white/80 
                        hover:text-white transition-all duration-300 px-3 py-1.5 rounded-full 
                        flex items-center group border border-white/5 hover:border-white/20 backdrop-blur-sm`}
              onClick={() => handleRecommendationClick(recommendation)}
            >
              {getRecommendationIcon(recommendation, index)}
              <span className="line-clamp-1">{recommendation}</span>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-1.5"
              >
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ContextualRecommendations;
