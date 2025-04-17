
import React from 'react';
import { useWhizzyChat } from '@/hooks/useWhizzyChat';
import WhizzyChat from '@/components/curio/WhizzyChat';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  const navigate = useNavigate();
  
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

  // Handle direct creation of curio from chat
  const handleCreateCurioFromChat = async (message: string) => {
    if (!childId || !message.trim()) return;
    
    try {
      toast.loading("Creating new exploration...");
      
      const { data: newCurio, error } = await supabase
        .from('curios')
        .insert({
          child_id: childId,
          title: message,
          query: message,
        })
        .select('id')
        .single();
        
      if (error) throw error;
      
      if (newCurio) {
        toast.success("New exploration created!");
        
        try {
          await supabase.functions.invoke('increment-sparks-balance', {
            body: JSON.stringify({
              profileId: childId,
              amount: 2
            })
          });
          
          toast.success("You earned 2 sparks for your curiosity!");
          
          // Navigate to the new curio
          navigate(`/curio/${childId}/${newCurio.id}`);
        } catch (err) {
          console.error('Error awarding sparks:', err);
          // Still navigate even if sparks awarding fails
          navigate(`/curio/${childId}/${newCurio.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating curio from chat:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  return (
    <WhizzyChat
      messages={chatHistory}
      onSend={(message) => {
        if (onNewQuestionGenerated) {
          onNewQuestionGenerated(message);
        } else if (childId) {
          handleCreateCurioFromChat(message);
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
