
import React from 'react';
import { motion } from 'framer-motion';
import EnhancedSearchInput from './EnhancedSearchInput';
import { Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import WelcomeHeader from './WelcomeHeader';

interface WelcomeViewProps {
  childId: string;
  childProfile: any;
  curioSuggestions: string[];
  pastCurios: any[];
  query: string;
  setQuery: (query: string) => void;
  handleSubmitQuery: () => void;
  isGenerating: boolean;
  onCurioSuggestionClick: (suggestion: string) => void;
  onRefreshSuggestions?: () => void;
  isLoadingSuggestions?: boolean;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({
  childId,
  childProfile,
  curioSuggestions,
  pastCurios,
  query,
  setQuery,
  handleSubmitQuery,
  isGenerating,
  onCurioSuggestionClick,
  onRefreshSuggestions,
  isLoadingSuggestions = false,
}) => {
  
  const handleFormSubmit = () => {
    if (query.trim() && !isGenerating) {
      handleSubmitQuery();
    } else if (!query.trim()) {
      toast.error("Please tell me what you want to learn about!");
    }
  };

  const handleImageUpload = async (file: File) => {
    const mockQuery = "What is this picture?";
    setQuery(mockQuery);
    handleSubmitQuery();
  };

  const handleVoiceInput = (transcript: string) => {
    setQuery(transcript);
    if (transcript.trim()) {
      setTimeout(() => handleSubmitQuery(), 300);
    }
  };

  return (
    <div className="container mx-auto pt-1 pb-4">
      <div className="max-w-3xl mx-auto">
        <WelcomeHeader 
          childName={childProfile?.name || "Explorer"}
          streakDays={childProfile?.streak_days || 0}
          sparksBalance={childProfile?.sparks_balance || 0}
          childAge={childProfile?.age}
        />
        
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl md:text-3xl font-nunito font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent text-center mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            What do you want to learn today?
          </motion.h1>
        </motion.div>

        <div className="mb-6">
          <EnhancedSearchInput
            onSearch={(q) => {
              setQuery(q);
              setTimeout(() => handleSubmitQuery(), 100);
            }}
            onImageCapture={handleImageUpload}
            onVoiceCapture={handleVoiceInput}
            isProcessing={isGenerating}
            childAge={childProfile?.age}
            initialQuery={query}
            placeholder="I want to learn about..."
          />
        </div>
        
        {/* Simplified suggestions section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white/5 p-5 rounded-xl border border-white/10"
        >
          <h2 className="text-xl font-nunito font-bold text-white flex items-center mb-4">
            <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
            Fun Things to Explore
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {curioSuggestions.map((suggestion, index) => (
              <motion.div
                key={`suggestion-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.1 * index } 
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onCurioSuggestionClick(suggestion)}
                className="bg-white/10 hover:bg-white/15 transition-colors border border-white/20 rounded-lg p-3 cursor-pointer"
              >
                <p className="text-white font-nunito font-medium">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeView;
