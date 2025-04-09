
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, Sparkles } from 'lucide-react';

interface NarrativeProgressProps {
  totalBlocks: number;
  theme: string;
}

const NarrativeProgress: React.FC<NarrativeProgressProps> = ({ totalBlocks, theme }) => {
  // Create stages based on learning journey
  const stages = [
    { name: "Introduction", description: "Begin your discovery" },
    { name: "Exploration", description: "Deepen your understanding" },
    { name: "Connection", description: "Apply your knowledge" },
    { name: "Reflection", description: "Wonder and imagine" }
  ];
  
  // Simplify for smaller journeys
  const visibleStages = totalBlocks <= 4 ? 
    stages.slice(0, Math.max(2, totalBlocks - 1)) :
    stages;
  
  // Get theme-specific colors
  const getThemeColors = (): { primary: string; secondary: string; accent: string } => {
    switch (theme) {
      case 'cosmic-discovery':
        return { 
          primary: 'from-indigo-500', 
          secondary: 'to-purple-600', 
          accent: 'text-indigo-300' 
        };
      case 'scientific-inquiry':
        return { 
          primary: 'from-emerald-500', 
          secondary: 'to-teal-600', 
          accent: 'text-emerald-300' 
        };
      case 'historical-journey':
        return { 
          primary: 'from-amber-500', 
          secondary: 'to-orange-600', 
          accent: 'text-amber-300' 
        };
      case 'creative-exploration':
        return { 
          primary: 'from-pink-500', 
          secondary: 'to-rose-600', 
          accent: 'text-pink-300' 
        };
      case 'technological-adventure':
        return { 
          primary: 'from-blue-500', 
          secondary: 'to-cyan-600', 
          accent: 'text-blue-300' 
        };
      case 'natural-connection':
        return { 
          primary: 'from-green-500', 
          secondary: 'to-emerald-600', 
          accent: 'text-green-300' 
        };
      default:
        return { 
          primary: 'from-wonderwhiz-bright-pink', 
          secondary: 'to-wonderwhiz-vibrant-yellow', 
          accent: 'text-wonderwhiz-gold' 
        };
    }
  };
  
  const { primary, secondary, accent } = getThemeColors();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-6 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${primary} ${secondary} flex items-center justify-center`}>
          <Star className="h-3 w-3 text-white" />
        </div>
        <h3 className="text-sm font-medium text-white">Your Wonder Journey</h3>
        <div className="ml-auto flex items-center">
          <Sparkles className={`h-3.5 w-3.5 mr-1 ${accent}`} />
          <span className={`text-xs ${accent}`}>{totalBlocks} discoveries</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className={`absolute left-0 right-0 h-0.5 top-3 bg-gradient-to-r ${primary} ${secondary}`} />
        
        {/* Progress stages */}
        {visibleStages.map((stage, index) => (
          <div key={index} className="relative flex flex-col items-center z-10">
            <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${primary} ${secondary} flex items-center justify-center mb-1`}>
              <span className="text-white text-xs">{index + 1}</span>
            </div>
            <span className="text-white text-xs font-medium">{stage.name}</span>
            <span className="text-white/60 text-[10px] text-center max-w-[80px]">{stage.description}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default NarrativeProgress;
