
import React from 'react';
import WelcomeSection from './WelcomeSection';
import { motion } from 'framer-motion';
import WhizzyChat from '@/components/curio/WhizzyChat';
import { useWhizzyChat } from '@/hooks/useWhizzyChat';

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
  const {
    isMuted,
    toggleMute,
    isListening,
    transcript,
    toggleVoice,
    isProcessing,
    chatHistory,
    voiceSupported
  } = useWhizzyChat({
    childAge: childProfile?.age,
    curioContext: childProfile?.name,
    onNewQuestionGenerated: (question) => onCurioSuggestionClick(question)
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <WelcomeSection 
        childId={childId}
        childProfile={childProfile}
        curioSuggestions={curioSuggestions}
        pastCurios={pastCurios}
        query={query}
        setQuery={setQuery}
        handleSubmitQuery={handleSubmitQuery}
        isGenerating={isGenerating}
        handleCurioSuggestionClick={onCurioSuggestionClick}
        handleRefreshSuggestions={onRefreshSuggestions || (() => {})}
        isLoadingSuggestions={isLoadingSuggestions}
      />
      
      <WhizzyChat
        messages={chatHistory}
        onSend={(message) => onCurioSuggestionClick(message)}
        isListening={isListening}
        isProcessing={isProcessing}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onToggleVoice={toggleVoice}
        transcript={transcript}
        childAge={childProfile?.age}
      />
    </motion.div>
  );
};

export default WelcomeView;
