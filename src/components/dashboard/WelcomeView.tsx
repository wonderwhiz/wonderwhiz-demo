
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedSearchInput from './EnhancedSearchInput';
import { Button } from '@/components/ui/button';
import { RefreshCw, Sparkles, BookOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import WhizzyChat from '@/components/curio/WhizzyChat';
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
    <div className="container mx-auto px-4 pt-4 pb-16">
      <div className="max-w-3xl mx-auto">
        <WelcomeHeader 
          childName={childProfile?.name || "Explorer"}
          streakDays={childProfile?.streak_days || 0}
          sparksBalance={childProfile?.sparks_balance || 0}
          childAge={childProfile?.age}
        />
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-2xl md:text-3xl font-nunito font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent text-center mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            What would you like to learn today?
          </motion.h1>
        </motion.div>

        <div className="mb-8">
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
        
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-nunito font-bold text-white flex items-center">
              <Sparkles className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
              Fun Things to Explore
            </h2>
            <Button 
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => {
                if (onRefreshSuggestions) {
                  toast.loading("Finding fun topics for you...");
                  onRefreshSuggestions();
                }
              }}
              disabled={isLoadingSuggestions}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingSuggestions ? 'animate-spin' : ''}`} />
              New Topics
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {curioSuggestions.slice(0, 4).map((suggestion, index) => (
              <motion.div
                key={`suggestion-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                className="bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 rounded-lg p-4 cursor-pointer transition-all"
                onClick={() => onCurioSuggestionClick(suggestion)}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                <p className="text-white font-nunito">{suggestion}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {pastCurios && pastCurios.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-nunito font-bold text-white mb-4 flex items-center">
              <BookOpen className="h-5 w-5 text-wonderwhiz-vibrant-yellow mr-2" />
              Your Recent Adventures
            </h2>
            <div className="space-y-3">
              {pastCurios.slice(0, 3).map((curio, index) => (
                <motion.div
                  key={curio.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 + (index * 0.1) }}
                  className="bg-gradient-to-br from-white/5 to-white/10 hover:from-white/10 hover:to-white/15 border border-white/10 rounded-lg p-4 cursor-pointer transition-all"
                  onClick={() => onCurioSuggestionClick(curio.query || curio.title)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <p className="text-white font-medium font-nunito">{curio.title}</p>
                  <p className="text-white/60 text-sm mt-1 font-inter">
                    {new Date(curio.created_at).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WelcomeView;
