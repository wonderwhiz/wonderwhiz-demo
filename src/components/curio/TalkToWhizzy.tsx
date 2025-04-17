
import React from 'react';
import { useWhizzyChat } from '@/hooks/useWhizzyChat';
import WhizzyChat from '@/components/curio/WhizzyChat';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

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
  const [showChat, setShowChat] = React.useState(false);
  
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
          
          toast.success("You earned 2 sparks for your curiosity!", {
            duration: 3000
          });
          
          // Directly insert a placeholder block to show immediately
          const placeholderId = crypto.randomUUID();
          await supabase.from('content_blocks').insert({
            id: placeholderId,
            curio_id: newCurio.id,
            specialist_id: 'nova',
            type: 'fact',
            content: { 
              fact: `We're exploring "${message}" for you! Gathering fascinating information...`,
              rabbitHoles: []
            }
          });
          
          // Navigate to the new curio
          navigate(`/curio/${childId}/${newCurio.id}`);
          
          // Close the chat window
          setShowChat(false);
        } catch (err) {
          console.error('Error awarding sparks:', err);
          // Still navigate even if sparks awarding fails
          navigate(`/curio/${childId}/${newCurio.id}`);
          setShowChat(false);
        }
      }
    } catch (error) {
      console.error('Error creating curio from chat:', error);
      toast.error("Could not create new exploration. Please try again later.");
    }
  };

  return (
    <>
      {/* Floating button when chat is closed */}
      {!showChat && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setShowChat(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-wonderwhiz-bright-pink to-wonderwhiz-purple shadow-lg text-white"
            size="icon"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      {/* Chat window */}
      {showChat && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 shadow-2xl rounded-2xl overflow-hidden"
        >
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
            onClose={() => setShowChat(false)}
          />
        </motion.div>
      )}
    </>
  );
};

export default TalkToWhizzy;
