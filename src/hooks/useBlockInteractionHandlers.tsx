
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ChildProfile {
  id: string;
  sparks_balance: number;
}

export const useBlockInteractionHandlers = (
  profileId?: string,
  childProfile?: ChildProfile | null,
  setChildProfile?: (profile: any) => void,
  contentBlocks?: any[]
) => {
  const [blockReplies, setBlockReplies] = useState<Record<string, any[]>>({});

  const handleBlockReply = useCallback((blockId: string, message: string) => {
    const newReply = {
      id: `reply-${Date.now()}`,
      content: message,
      from_user: true,
      created_at: new Date().toISOString()
    };

    setBlockReplies(prev => ({
      ...prev,
      [blockId]: [...(prev[blockId] || []), newReply]
    }));

    // Award sparks for engagement
    if (setChildProfile && childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: childProfile.sparks_balance + 2
      });
    }

    toast.success("Great thinking! +2 sparks! ✨", {
      position: 'top-center',
      duration: 2000,
    });
  }, [setChildProfile, childProfile]);

  const handleQuizCorrect = useCallback((blockId: string) => {
    if (setChildProfile && childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: childProfile.sparks_balance + 10
      });
    }

    toast.success("Correct! Amazing work! +10 sparks! 🎉", {
      position: 'top-center',
      duration: 3000,
    });
  }, [setChildProfile, childProfile]);

  const handleNewsRead = useCallback((blockId: string) => {
    if (setChildProfile && childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: childProfile.sparks_balance + 3
      });
    }

    toast.success("Great reading! +3 sparks! 📚", {
      position: 'top-center',
      duration: 2000,
    });
  }, [setChildProfile, childProfile]);

  const handleCreativeUpload = useCallback((blockId: string) => {
    if (setChildProfile && childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: childProfile.sparks_balance + 15
      });
    }

    toast.success("Creative work uploaded! +15 sparks! 🎨", {
      position: 'top-center',
      duration: 3000,
    });
  }, [setChildProfile, childProfile]);

  const handleSparkEarned = useCallback((amount: number, reason: string) => {
    if (setChildProfile && childProfile) {
      setChildProfile({
        ...childProfile,
        sparks_balance: childProfile.sparks_balance + amount
      });
    }

    toast.success(`+${amount} sparks for ${reason}! ✨`, {
      position: 'top-center',
      duration: 2000,
    });
  }, [setChildProfile, childProfile]);

  return {
    blockReplies,
    handleBlockReply,
    handleQuizCorrect,
    handleNewsRead,
    handleCreativeUpload,
    handleSparkEarned
  };
};
