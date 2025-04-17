
import React, { useState } from 'react';
import { useWhizzyChat } from '@/hooks/useWhizzyChat';
import WhizzyChat from '@/components/curio/WhizzyChat';

interface TalkToWhizzyProps {
  childId?: string;
  curioTitle?: string;
  ageGroup?: '5-7' | '8-11' | '12-16';
  onNewQuestionGenerated?: (question: string) => void;
}

const TalkToWhizzy: React.FC<TalkToWhizzyProps> = ({
  childId,
  curioTitle,
  ageGroup = '8-11',
  onNewQuestionGenerated
}) => {
  // Convert ageGroup to numeric age for the hook
  const getAgeFromGroup = (group: '5-7' | '8-11' | '12-16'): number => {
    switch (group) {
      case '5-7': return 6;
      case '8-11': return 10;
      case '12-16': return 14;
      default: return 10;
    }
  };

  const childAge = getAgeFromGroup(ageGroup);
  
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
    childAge,
    curioContext: curioTitle,
    onNewQuestionGenerated
  });

  return (
    <WhizzyChat
      messages={chatHistory}
      onSend={(message) => {
        if (onNewQuestionGenerated) {
          onNewQuestionGenerated(message);
        }
      }}
      isListening={isListening}
      isProcessing={isProcessing}
      isMuted={isMuted}
      onToggleMute={toggleMute}
      onToggleVoice={toggleVoice}
      transcript={transcript}
      childAge={childAge}
    />
  );
};

export default TalkToWhizzy;
