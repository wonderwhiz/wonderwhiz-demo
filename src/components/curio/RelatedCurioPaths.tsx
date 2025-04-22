
import React from 'react';
import { motion } from 'framer-motion';
import { Compass, ExternalLink, Globe, Lightbulb, Map, Sparkles, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import SpecialistAvatar from '../SpecialistAvatar';

interface RelatedCurioPathsProps {
  currentTopic: string;
  onPathSelect?: (path: string) => void;
  childAge?: number;
  profileId?: string;
  className?: string;
}

const RelatedCurioPaths: React.FC<RelatedCurioPathsProps> = ({
  currentTopic,
  onPathSelect,
  childAge = 10,
  profileId,
  className = ''
}) => {
  const navigate = useNavigate();
  
  // Generate paths based on the current topic and child age
  const generatePaths = () => {
    const cleanTopic = currentTopic
      .replace(/^(why|how|what|when|where|who)\s(can|do|does|is|are|did|would|will|should|could|has|have|had)\s/i, '')
      .replace(/\?$/, '');
    
    if (childAge <= 7) {
      // Simpler, more fun oriented paths for younger children
      return [
        { 
          title: `Fun facts about ${cleanTopic}`,
          icon: <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />,
          specialistId: 'spark'
        },
        { 
          title: `How to draw ${cleanTopic}`,
          icon: <Lightbulb className="h-4 w-4 text-wonderwhiz-cyan" />,
          specialistId: 'nova'
        },
        { 
          title: `${cleanTopic} for kids`,
          icon: <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />,
          specialistId: 'whizzy'
        }
      ];
    } else if (childAge <= 11) {
      // More diverse, still accessible paths for middle age
      return [
        { 
          title: `How does ${cleanTopic} work?`,
          icon: <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />,
          specialistId: 'prism'
        },
        { 
          title: `Interesting facts about ${cleanTopic}`,
          icon: <Sparkles className="h-4 w-4 text-wonderwhiz-vibrant-yellow" />,
          specialistId: 'spark'
        },
        { 
          title: `${cleanTopic} in history`,
          icon: <Map className="h-4 w-4 text-wonderwhiz-light-purple" />,
          specialistId: 'atlas'
        },
        { 
          title: `The future of ${cleanTopic}`,
          icon: <Target className="h-4 w-4 text-wonderwhiz-blue" />,
          specialistId: 'pixel'
        }
      ];
    } else {
      // More advanced, thought-provoking paths for older kids
      return [
        { 
          title: `The science behind ${cleanTopic}`,
          icon: <Compass className="h-4 w-4 text-wonderwhiz-bright-pink" />,
          specialistId: 'prism'
        },
        { 
          title: `Impact of ${cleanTopic} on society`,
          icon: <Globe className="h-4 w-4 text-wonderwhiz-cyan" />,
          specialistId: 'atlas'
        },
        { 
          title: `How ${cleanTopic} has evolved over time`,
          icon: <Map className="h-4 w-4 text-wonderwhiz-light-purple" />,
          specialistId: 'whizzy'
        },
        { 
          title: `Future innovations in ${cleanTopic}`,
          icon: <Target className="h-4 w-4 text-wonderwhiz-blue" />,
          specialistId: 'pixel'
        }
      ];
    }
  };
  
  const paths = generatePaths();
  
  const handlePathSelect = async (path: string) => {
    if (onPathSelect) {
      onPathSelect(path);
    }
    
    // If we have a profileId, we can create a new curio
    if (profileId) {
      toast.loading("Creating new exploration...");
      
      try {
        const { data: newCurio, error } = await supabase
          .from('curios')
          .insert({
            child_id: profileId,
            title: path,
            query: path,
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
                profileId,
                amount: 2
              })
            });
            
            confetti({
              particleCount: 70,
              spread: 80,
              origin: { y: 0.6 },
              zIndex: 1000,
              colors: ['#FF5BA3', '#00E2FF', '#4A6FFF']
            });
            
            toast.success("You earned 2 sparks for your curiosity!", {
              icon: "✨"
            });
          } catch (err) {
            console.error('Error awarding sparks:', err);
          }
          
          // Navigate to the new curio
          navigate(`/curio/${profileId}/${newCurio.id}`);
        }
      } catch (error) {
        console.error('Error creating curio:', error);
        toast.error("Could not create new exploration");
      }
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-br from-wonderwhiz-deep-purple/40 to-wonderwhiz-light-purple/30 backdrop-blur-md border border-wonderwhiz-light-purple/30 rounded-xl p-4 mb-6 ${className}`}
    >
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-wonderwhiz-light-purple/50 flex items-center justify-center mr-3">
          <Map className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white font-nunito">Explore Related Paths</h2>
      </div>
      
      <p className="text-white/80 text-sm mb-4 font-inter">
        Discover more about this topic by exploring these connected paths.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {paths.map((path, index) => (
          <motion.button
            key={index}
            className="flex items-start bg-white/5 hover:bg-white/10 transition-colors p-3 rounded-lg border border-white/10 text-left group"
            onClick={() => handlePathSelect(path.title)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SpecialistAvatar specialistId={path.specialistId} size="sm" className="mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <div className="flex items-center mb-1">
                {path.icon}
                <span className="ml-1.5 text-wonderwhiz-vibrant-yellow/80 text-xs">Explore</span>
              </div>
              <p className="text-white text-sm group-hover:text-wonderwhiz-bright-pink transition-colors font-inter">
                {path.title}
              </p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-white/40 ml-auto self-start mt-1" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default RelatedCurioPaths;
